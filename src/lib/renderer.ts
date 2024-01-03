import { add, clamp, length, multiply, subtract } from './algebra';
import type { Color } from './colors';
import { computeLighting } from './lights';
import { Scene } from './scene';
import type { StaticScene, Vector2, Vector3 } from './types';
import { calculateClosestIntersection } from './utilities';

export interface RendererOptions {
  canvas: HTMLCanvasElement;
  viewportSize?: number;
  zProjectionPlane?: number;
  cameraPosition?: Vector3;
  backgroundColor?: Color;
  scene?: StaticScene;
}

export interface TraceRayInput {
  origin: Vector3;
  direction: Vector3;
  minTime: number;
  maxTime: number;
}

export class Renderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  buffer: ImageData;
  pitch: number;
  viewportSize: number;
  zProjectionPlane: number;
  cameraPosition: Vector3;
  backgroundColor: Color;
  scene: StaticScene;

  constructor({ canvas, viewportSize, zProjectionPlane, cameraPosition, backgroundColor, scene }: RendererOptions) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.buffer = this.context.getImageData(0, 0, canvas.width, canvas.height);
    this.pitch = this.buffer.width * 4;
    this.viewportSize = viewportSize || 1;
    this.zProjectionPlane = zProjectionPlane || 1;
    this.cameraPosition = cameraPosition || [0, 0, 0];
    this.backgroundColor = backgroundColor || { red: 255, green: 255, blue: 255 };
    this.scene = scene || new Scene();
  }

  putPixel(x: number, y: number, color: Color): void {
    const actualX = this.canvas.width / 2 + x;
    const actualY = this.canvas.height / 2 - y - 1;

    if (actualX < 0 || actualX >= this.canvas.width || actualY < 0 || actualY >= this.canvas.height) {
      return;
    }

    let offset = 4 * actualX + this.pitch * actualY;
    this.buffer.data[offset++] = color.red;
    this.buffer.data[offset++] = color.green;
    this.buffer.data[offset++] = color.blue;
    this.buffer.data[offset++] = color.alpha || 255;
  }

  updateCanvas(): void {
    this.context.putImageData(this.buffer, 0, 0);
  }

  canvasToViewport(point2d: Vector2): Vector3 {
    return [
      (point2d[0] * this.viewportSize) / this.canvas.width,
      (point2d[1] * this.viewportSize) / this.canvas.height,
      this.zProjectionPlane,
    ];
  }

  traceRay({ origin, direction, minTime, maxTime }: TraceRayInput): Color {
    const { closestSphere, closestT } = calculateClosestIntersection({
      scene: this.scene,
      origin,
      direction,
      minTime,
      maxTime,
    });

    if (closestSphere === null) {
      return this.backgroundColor;
    }
    const point = add(origin, multiply(closestT, direction)); // Compute intersection
    let normal = subtract(point, closestSphere.center); // Compute sphere normal at intersection
    normal = multiply(1.0 / length(normal), normal);
    const intensity = computeLighting(point, normal, multiply(-1, direction), this.scene, closestSphere.specular);
    return {
      ...closestSphere.color,
      red: clamp(closestSphere.color.red * intensity, 0, 255),
      blue: clamp(closestSphere.color.blue * intensity, 0, 255),
      green: clamp(closestSphere.color.green * intensity, 0, 255),
    };
  }
}
