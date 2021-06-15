import { dotProduct, subtract } from './algebra';
import type { Color } from './colors';
import type { Sphere } from './shapes/sphere';
import type { StaticScene, Vector2, Vector3 } from './types';

export interface RendererOptions {
  canvas: HTMLCanvasElement;
  viewportSize?: number;
  zProjectionPlane?: number;
  cameraPosition?: Vector3;
  backgroundColor?: Color;
}

export interface TraceRayInput {
  origin: Vector3;
  direction: Vector3;
  minTime: number;
  maxTime: number;
  scene: StaticScene;
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

  constructor({ canvas, viewportSize, zProjectionPlane, cameraPosition, backgroundColor }: RendererOptions) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.buffer = this.context.getImageData(0, 0, canvas.width, canvas.height);
    this.pitch = this.buffer.width * 4;
    this.viewportSize = viewportSize || 1;
    this.zProjectionPlane = zProjectionPlane || 1;
    this.cameraPosition = cameraPosition || [0, 0, 0];
    this.backgroundColor = backgroundColor || { red: 255, green: 255, blue: 255 };
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

  traceRay({ origin, direction, minTime, maxTime, scene }: TraceRayInput): Color {
    let closestT = Infinity;
    let closestSphere: Sphere | null = null;

    for (let i = 0; i < scene.spheres.length; i++) {
      const solutions = intersectRaySphere(origin, direction, scene.spheres[i]);
      const checkSolution = (s: number) => {
        if (s < closestT && minTime < s && s < maxTime) {
          closestT = s;
          closestSphere = scene.spheres[i];
        }
      };

      checkSolution(solutions[0]);
      checkSolution(solutions[1]);
    }

    if (closestSphere === null) {
      return this.backgroundColor;
    }

    return closestSphere.color;
  }
}

function intersectRaySphere(origin: Vector3, direction: Vector3, sphere: Sphere): Vector2 {
  const originToSphere = subtract(origin, sphere.center);

  const quadraticA = dotProduct(direction, direction);
  const quadraticB = 2 * dotProduct(originToSphere, direction);
  const quatraticC = dotProduct(originToSphere, originToSphere) - sphere.radius * sphere.radius;

  const discriminant = quadraticB * quadraticB - 4 * quadraticA * quatraticC;
  if (discriminant < 0) {
    return [Infinity, Infinity];
  }

  const solution1 = (-quadraticB + Math.sqrt(discriminant)) / (2 * quadraticA);
  const solution2 = (-quadraticB - Math.sqrt(discriminant)) / (2 * quadraticA);
  return [solution1, solution2];
}
