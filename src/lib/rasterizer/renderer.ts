import {
  convertPoint3dToHomogeneous,
  createTranslationMatrix4x4,
  getIntersectionPoint,
  getSignedDistance,
  interpolate,
  multiply,
  multiplyMatrix4x4,
  multiplyMatrix4x4Vector4,
  transposeMatrix4x4,
} from '$lib/algebra';
import { adjustIntensity, Blue, Green, Red, type Color } from '../colors';
import {
  IdentityMatrix,
  type Matrix4x4,
  type Plane,
  type Point3D,
  type ShadedPoint,
  type Triangle,
  type Vector2,
  type Vector3,
  type Vector4,
} from '../types';
import { RasterScene, SceneInstance } from './scene';

export interface RendererOptions {
  canvas: HTMLCanvasElement;
  viewportSize?: Vector2;
  zProjectionPlane?: number;
  backgroundColor?: Color;
  scene?: RasterScene;
  clippingPlanes?: Plane[];
}

export class Renderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  buffer: ImageData;
  pitch: number;
  viewportSize: Vector2;
  zProjectionPlane: number;
  backgroundColor: Color;
  scene: RasterScene;
  clippingPlanes: Plane[];

  constructor({ canvas, viewportSize, zProjectionPlane, backgroundColor, scene, clippingPlanes }: RendererOptions) {
    this.canvas = canvas;
    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) {
      throw new Error('Could not get canvas context');
    }
    this.context = canvasContext;
    this.backgroundColor = backgroundColor || { red: 255, green: 255, blue: 255 };
    this.context.fillStyle = `rgb(${this.backgroundColor.red}, ${this.backgroundColor.green}, ${this.backgroundColor.blue})`;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.buffer = this.context.getImageData(0, 0, canvas.width, canvas.height);
    this.pitch = this.buffer.width * 4;
    this.viewportSize = viewportSize || [1, 1];
    this.zProjectionPlane = zProjectionPlane || 1;
    this.scene =
      scene || new RasterScene([], { scale: 1, rotation: IdentityMatrix, translation: { x: 0, y: 0, z: 0 } });
    this.clippingPlanes = clippingPlanes || [];
  }

  putPixel(x: number, y: number, color: Color): void {
    const actualX = Math.floor(this.canvas.width / 2 + x);
    const actualY = Math.floor(this.canvas.height / 2 - y - 1);

    if (actualX < 0 || actualX >= this.canvas.width || actualY < 0 || actualY >= this.canvas.height) {
      return;
    }

    let offset = 4 * actualX + this.pitch * actualY;
    this.buffer.data[offset++] = color.red;
    this.buffer.data[offset++] = color.green;
    this.buffer.data[offset++] = color.blue;
    this.buffer.data[offset++] = color.alpha !== undefined ? color.alpha : 255;
  }

  updateCanvas(): void {
    this.context.putImageData(this.buffer, 0, 0);
  }

  canvasToViewport(point2d: Vector2): Vector3 {
    return [
      (point2d[0] * this.viewportSize[0]) / this.canvas.width,
      (point2d[1] * this.viewportSize[1]) / this.canvas.height,
      this.zProjectionPlane,
    ];
  }

  drawLine(startPoint: Vector2, endPoint: Vector2, color: Color): void {
    const isHorizontal = Math.abs(endPoint[0] - startPoint[0]) > Math.abs(endPoint[1] - startPoint[1]);
    if (isHorizontal) {
      this._drawLine(startPoint[0], startPoint[1], endPoint[0], endPoint[1], color, true);
    } else {
      // We are vertical
      this._drawLine(startPoint[1], startPoint[0], endPoint[1], endPoint[0], color, false);
    }
  }

  drawWireframeTriangle(p0: Vector2, p1: Vector2, p2: Vector2, color: Color): void {
    this.drawLine(p0, p1, color);
    this.drawLine(p1, p2, color);
    this.drawLine(p2, p0, color);
  }

  drawFilledTriangle(p0: Vector2, p1: Vector2, p2: Vector2, color: Color): void {
    let [point0, point1, point2] = [p0, p1, p2];

    if (point1[1] < point0[1]) {
      [point0, point1] = [point1, point0];
    }
    if (point2[1] < point0[1]) {
      [point0, point2] = [point2, point0];
    }
    if (point2[1] < point1[1]) {
      [point1, point2] = [point2, point1];
    }

    let x01 = interpolate(point0[1], point0[0], point1[1], point1[0]);
    const x12 = interpolate(point1[1], point1[0], point2[1], point2[0]);
    const x02 = interpolate(point0[1], point0[0], point2[1], point2[0]);
    x01 = x01.slice(0, -1); // Remove the last element, as it is the same as x12[0]
    const x012 = x01.concat(x12);
    const middleIndex = Math.floor(x012.length / 2);
    let x_left: number[] = [];
    let x_right: number[] = [];

    if (x02[middleIndex] < x012[middleIndex]) {
      x_left = x02;
      x_right = x012;
    } else {
      x_left = x012;
      x_right = x02;
    }

    for (let y = point0[1]; y <= point2[1]; y++) {
      for (let x = x_left[y - point0[1]]; x <= x_right[y - point0[1]]; x++) {
        this.putPixel(x, y, color);
      }
    }
  }

  drawShadedTriangle(p0: ShadedPoint, p1: ShadedPoint, p2: ShadedPoint, color: Color): void {
    let [point0, point1, point2] = [p0, p1, p2];

    if (point1.y < point0.y) {
      [point0, point1] = [point1, point0];
    }
    if (point2.y < point0.y) {
      [point0, point2] = [point2, point0];
    }
    if (point2.y < point1.y) {
      [point1, point2] = [point2, point1];
    }

    let x01 = interpolate(point0.y, point0.x, point1.y, point1.x);
    let h01 = interpolate(point0.y, point0.intensity, point1.y, point1.intensity);
    const x12 = interpolate(point1.y, point1.x, point2.y, point2.x);
    const h12 = interpolate(point1.y, point1.intensity, point2.y, point2.intensity);
    const x02 = interpolate(point0.y, point0.x, point2.y, point2.x);
    const h02 = interpolate(point0.y, point0.intensity, point2.y, point2.intensity);
    x01 = x01.slice(0, -1); // Remove the last element, as it is the same as x12[0]
    h01 = h01.slice(0, -1); // Remove the last element, as it is the same as h12[0]
    const x012 = x01.concat(x12);
    const h012 = h01.concat(h12);
    const middleIndex = Math.floor(x012.length / 2);
    let x_left: number[] = [];
    let x_right: number[] = [];
    let h_left: number[] = [];
    let h_right: number[] = [];

    if (x02[middleIndex] < x012[middleIndex]) {
      x_left = x02;
      h_left = h02;
      x_right = x012;
      h_right = h012;
    } else {
      x_left = x012;
      h_left = h012;
      x_right = x02;
      h_right = h02;
    }

    for (let y = point0.y; y <= point2.y; y++) {
      const x_l = x_left[y - point0.y];
      const x_r = x_right[y - point0.y];
      const hSegment = interpolate(x_l, h_left[y - point0.y], x_r, h_right[y - point0.y]);
      for (let x = x_l; x <= x_r; x++) {
        const hSegmentIndex = Math.round(x - x_l);
        const shadedColor = adjustIntensity(color, hSegment[hSegmentIndex]);
        this.putPixel(x, y, shadedColor);
      }
    }
  }

  drawCube() {
    // "Front" vertices
    const vAf: Point3D = { x: -3, y: -1, z: 1 };
    const vBf: Point3D = { x: -1, y: -1, z: 1 };
    const vCf: Point3D = { x: -1, y: -3, z: 1 };
    const vDf: Point3D = { x: -3, y: -3, z: 1 };

    // "Back" vertices
    const vAb: Point3D = { x: -3, y: -1, z: 2 };
    const vBb: Point3D = { x: -1, y: -1, z: 2 };
    const vCb: Point3D = { x: -1, y: -3, z: 2 };
    const vDb: Point3D = { x: -3, y: -3, z: 2 };

    // Front face
    this.drawLine(
      this._projectVertex(convertPoint3dToHomogeneous(vAf)),
      this._projectVertex(convertPoint3dToHomogeneous(vBf)),
      Blue
    );
    this.drawLine(
      this._projectVertex(convertPoint3dToHomogeneous(vBf)),
      this._projectVertex(convertPoint3dToHomogeneous(vCf)),
      Blue
    );
    this.drawLine(
      this._projectVertex(convertPoint3dToHomogeneous(vCf)),
      this._projectVertex(convertPoint3dToHomogeneous(vDf)),
      Blue
    );
    this.drawLine(
      this._projectVertex(convertPoint3dToHomogeneous(vDf)),
      this._projectVertex(convertPoint3dToHomogeneous(vAf)),
      Blue
    );

    // Back face
    this.drawLine(
      this._projectVertex(convertPoint3dToHomogeneous(vAb)),
      this._projectVertex(convertPoint3dToHomogeneous(vBb)),
      Red
    );
    this.drawLine(
      this._projectVertex(convertPoint3dToHomogeneous(vBb)),
      this._projectVertex(convertPoint3dToHomogeneous(vCb)),
      Red
    );
    this.drawLine(
      this._projectVertex(convertPoint3dToHomogeneous(vCb)),
      this._projectVertex(convertPoint3dToHomogeneous(vDb)),
      Red
    );
    this.drawLine(
      this._projectVertex(convertPoint3dToHomogeneous(vDb)),
      this._projectVertex(convertPoint3dToHomogeneous(vAb)),
      Red
    );

    // Front to back edges
    this.drawLine(
      this._projectVertex(convertPoint3dToHomogeneous(vAf)),
      this._projectVertex(convertPoint3dToHomogeneous(vAb)),
      Green
    );
    this.drawLine(
      this._projectVertex(convertPoint3dToHomogeneous(vBf)),
      this._projectVertex(convertPoint3dToHomogeneous(vBb)),
      Green
    );
    this.drawLine(
      this._projectVertex(convertPoint3dToHomogeneous(vCf)),
      this._projectVertex(convertPoint3dToHomogeneous(vCb)),
      Green
    );
    this.drawLine(
      this._projectVertex(convertPoint3dToHomogeneous(vDf)),
      this._projectVertex(convertPoint3dToHomogeneous(vDb)),
      Green
    );
  }

  renderScene(): void {
    const cameraTranslation = this.scene.camera.translation;
    const invertedCameraPosition = multiply(-1, [cameraTranslation.x, cameraTranslation.y, cameraTranslation.z]);
    const cameraTranslationMatrix = createTranslationMatrix4x4(invertedCameraPosition);
    const transposedCameraRotationMatrix = transposeMatrix4x4(this.scene.camera.rotation);
    const cameraMatrix = multiplyMatrix4x4(transposedCameraRotationMatrix, cameraTranslationMatrix);
    const clippedScene = this._clipScene();
    for (const instance of clippedScene.instances) {
      const transform = multiplyMatrix4x4(cameraMatrix, instance.transformMatrix);
      this.renderObject(instance.vertices, instance.triangles, transform);
    }
  }

  renderObject(vertices: Point3D[], triangles: Triangle[], transform: Matrix4x4): void {
    const projected: Vector2[] = [];
    for (const vertex of vertices) {
      const vertexH: Vector4 = [vertex.x, vertex.y, vertex.z, 1];
      projected.push(this._projectVertex(multiplyMatrix4x4Vector4(transform, vertexH)));
    }

    for (const triangle of triangles) {
      this._renderTriangle(triangle, projected);
    }
  }

  _clipScene(): RasterScene {
    const clippedInstances = this.scene.instances.map((instance) => {
      return this._clipInstance(instance, this.clippingPlanes);
    });
    return new RasterScene(clippedInstances.filter((i) => i !== undefined) as SceneInstance[], this.scene.camera);
  }

  _clipInstance(instance: SceneInstance, planes: Plane[]): SceneInstance | undefined {
    if (planes.length === 0) {
      return instance;
    }

    for (const plane of planes) {
      return this._clipInstanceAgainstPlane(instance, plane);
    }
  }

  _clipInstanceAgainstPlane(instance: SceneInstance, plane: Plane): SceneInstance | undefined {
    const distance = getSignedDistance(plane, instance.boundingSphereCenter);
    if (distance > instance.boundingSphereRadius) {
      return instance;
    } else if (distance < -instance.boundingSphereRadius) {
      console.log('Discarding instance');
      return undefined;
    } else {
      console.log('Clipping instance');
      const copiedVertices: Point3D[] = instance.vertices.map((v) => ({ x: v.x, y: v.y, z: v.z }));
      const copiedTriangles: Triangle[] = instance.triangles.map((t) => ({ a: t.a, b: t.b, c: t.c, color: t.color }));
      const clippedInstance = new SceneInstance(instance.model, instance.transform, copiedVertices, copiedTriangles);
      clippedInstance.triangles = this._clipTrianglesAgainstPlane(clippedInstance.triangles, plane, copiedVertices);
    }
  }

  _clipTrianglesAgainstPlane(triangles: Triangle[], plane: Plane, vertices: Point3D[]): Triangle[] {
    const clippedTriangles = triangles.map((t) => this._clipTriangle(t, plane, vertices));
    const flattenedTriangles = clippedTriangles.flat();
    return flattenedTriangles;
  }

  _clipTriangle(triangle: Triangle, plane: Plane, vertices: Point3D[]): Triangle[] {
    const d0 = getSignedDistance(plane, vertices[triangle.a]);
    const d1 = getSignedDistance(plane, vertices[triangle.b]);
    const d2 = getSignedDistance(plane, vertices[triangle.c]);

    const isD0Positive = d0 >= 0;
    const isD1Positive = d1 >= 0;
    const isD2Positive = d2 >= 0;

    const positiveCount = [isD0Positive, isD1Positive, isD2Positive].filter(Boolean).length;

    if (positiveCount === 3) {
      return [triangle];
    } else if (positiveCount === 2) {
      return this._clipTriangleWithTwoPositive(plane, triangle, [d0, d1, d2], vertices);
    } else if (positiveCount === 1) {
      return this._clipTriangleWithOnePositive(plane, triangle, [d0, d1, d2], vertices);
    }
    // All negative
    return [];
  }

  _clipTriangleWithTwoPositive(plane: Plane, triangle: Triangle, distances: number[], vertices: Point3D[]): Triangle[] {
    // Determine the negative vertex
    const negativeVertexIndex = distances.findIndex((d) => d < 0);
    const negativeVertex = vertices[negativeVertexIndex];

    // Determine the positive vertices
    const positiveVerticesIndices = distances.filter((d) => d >= 0);
    const positiveVertices = positiveVerticesIndices.map((index) => vertices[index]);

    // Calculate the intersection points of the lines starting with the positive vertices and ending with the negative vertex with the plane
    const intersectionPoints = positiveVertices.map((positiveVertex) =>
      getIntersectionPoint(plane, { start: positiveVertex, end: negativeVertex })
    );

    // Append the new vertices to the vertices array
    vertices.push(...intersectionPoints);

    // Return two new triangles with the positive vertices and the new vertices
    const newTriangles: Triangle[] = [
      { a: positiveVerticesIndices[0], b: positiveVerticesIndices[1], c: vertices.length - 2, color: triangle.color },
      { a: vertices.length - 2, b: positiveVerticesIndices[1], c: vertices.length - 1, color: triangle.color },
    ];

    return newTriangles;
  }

  _clipTriangleWithOnePositive(plane: Plane, triangle: Triangle, distances: number[], vertices: Point3D[]): Triangle[] {
    // Determine the positive vertex
    const positiveVertexIndex = distances.findIndex((d) => d >= 0);
    const positiveVertex = vertices[positiveVertexIndex];

    // Determine the negative indices
    const negativeVerticesIndices = distances.filter((d) => d < 0);

    // Calculate the intersection points of the lines starting with the positive vertex and ending with the negative vertices with the plane
    const intersectionPoints = negativeVerticesIndices.map((negativeVertexIndex) =>
      getIntersectionPoint(plane, { start: positiveVertex, end: vertices[negativeVertexIndex] })
    );

    // Append the new vertices to the vertices array
    vertices.push(...intersectionPoints);

    // Return a new triangle with the positive vertex and the new vertices
    return [{ a: positiveVertexIndex, b: vertices.length - 2, c: vertices.length - 1, color: triangle.color }];
  }

  _renderTriangle(triangle: Triangle, projected: Vector2[]): void {
    this.drawWireframeTriangle(projected[triangle.a], projected[triangle.b], projected[triangle.c], triangle.color);
  }

  _drawLine(i0: number, d0: number, i1: number, d1: number, color: Color, isHorizontal: boolean): void {
    const is0LessThan1 = i0 < i1;
    const iStart = is0LessThan1 ? i0 : i1;
    const iEnd = is0LessThan1 ? i1 : i0;
    const dStart = is0LessThan1 ? d0 : d1;
    const dEnd = is0LessThan1 ? d1 : d0;
    const values = interpolate(iStart, dStart, iEnd, dEnd);
    for (let i = iStart; i <= iEnd; i++) {
      if (isHorizontal) {
        this.putPixel(i, values[i - iStart], color);
      } else {
        this.putPixel(values[i - iStart], i, color);
      }
    }
  }

  _viewportToCanvas(x: number, y: number): Vector2 {
    return [(x * this.canvas.width) / this.viewportSize[0], (y * this.canvas.height) / this.viewportSize[1]];
  }

  _projectVertex(vertex: Vector4): Vector2 {
    return this._viewportToCanvas(
      (vertex[0] * this.zProjectionPlane) / vertex[2],
      (vertex[1] * this.zProjectionPlane) / vertex[2]
    );
  }
}
