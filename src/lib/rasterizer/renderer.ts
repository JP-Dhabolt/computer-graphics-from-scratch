import { interpolate } from '$lib/algebra';
import type { Color } from '../colors';
import type { Vector2, Vector3 } from '../types';

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
  recursionDepth?: number;
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
    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) {
      throw new Error('Could not get canvas context');
    }
    this.context = canvasContext;
    this.buffer = this.context.getImageData(0, 0, canvas.width, canvas.height);
    this.pitch = this.buffer.width * 4;
    this.viewportSize = viewportSize || 1;
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
      (point2d[0] * this.viewportSize) / this.canvas.width,
      (point2d[1] * this.viewportSize) / this.canvas.height,
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
}
