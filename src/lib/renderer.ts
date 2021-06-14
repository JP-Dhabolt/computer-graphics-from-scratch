import type { Color } from './colors';

export interface RendererOptions {
  canvas: HTMLCanvasElement;
}

export class Renderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  buffer: ImageData;
  pitch: number;

  constructor({ canvas }: RendererOptions) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.buffer = this.context.getImageData(0, 0, canvas.width, canvas.height);
    this.pitch = this.buffer.width * 4;
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
}
