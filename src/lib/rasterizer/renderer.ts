import { interpolate } from '$lib/algebra';
import { adjustIntensity, Blue, Green, Red, type Color } from '../colors';
import type { Point3D, ShadedPoint, Vector2, Vector3 } from '../types';

export interface RendererOptions {
  canvas: HTMLCanvasElement;
  viewportSize?: Vector2;
  zProjectionPlane?: number;
  cameraPosition?: Vector3;
  backgroundColor?: Color;
}

export interface TraceRayInput {
  origin: Vector3;
  direction: Vector3;
  minTime: number;
  maxTime: number;
  recursionDepth?: number;
}

export class Renderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  buffer: ImageData;
  pitch: number;
  viewportSize: Vector2;
  zProjectionPlane: number;
  cameraPosition: Vector3;
  backgroundColor: Color;

  constructor({ canvas, viewportSize, zProjectionPlane, cameraPosition, backgroundColor }: RendererOptions) {
    this.canvas = canvas;
    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) {
      throw new Error('Could not get canvas context');
    }
    this.context = canvasContext;
    this.buffer = this.context.getImageData(0, 0, canvas.width, canvas.height);
    this.pitch = this.buffer.width * 4;
    this.viewportSize = viewportSize || [1, 1];
    this.zProjectionPlane = zProjectionPlane || 1;
    this.cameraPosition = cameraPosition || [0, 0, 0];
    this.backgroundColor = backgroundColor || { red: 255, green: 255, blue: 255 };
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
    this.drawLine(this._projectVertex(vAf), this._projectVertex(vBf), Blue);
    this.drawLine(this._projectVertex(vBf), this._projectVertex(vCf), Blue);
    this.drawLine(this._projectVertex(vCf), this._projectVertex(vDf), Blue);
    this.drawLine(this._projectVertex(vDf), this._projectVertex(vAf), Blue);

    // Back face
    this.drawLine(this._projectVertex(vAb), this._projectVertex(vBb), Red);
    this.drawLine(this._projectVertex(vBb), this._projectVertex(vCb), Red);
    this.drawLine(this._projectVertex(vCb), this._projectVertex(vDb), Red);
    this.drawLine(this._projectVertex(vDb), this._projectVertex(vAb), Red);

    // Front to back edges
    this.drawLine(this._projectVertex(vAf), this._projectVertex(vAb), Green);
    this.drawLine(this._projectVertex(vBf), this._projectVertex(vBb), Green);
    this.drawLine(this._projectVertex(vCf), this._projectVertex(vCb), Green);
    this.drawLine(this._projectVertex(vDf), this._projectVertex(vDb), Green);
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

  _projectVertex(vertex: Point3D): Vector2 {
    return this._viewportToCanvas(
      (vertex.x * this.zProjectionPlane) / vertex.z,
      (vertex.y * this.zProjectionPlane) / vertex.z
    );
  }
}
