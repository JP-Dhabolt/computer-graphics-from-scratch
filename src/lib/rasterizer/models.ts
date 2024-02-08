import { Red, Green, Blue, Yellow, Purple, Cyan } from '$lib/colors';
import type { Point3D, Triangle } from '$lib/types';

export interface RasterModel {
  vertices: Point3D[];
  triangles: Triangle[];
  center: Point3D;
  radius: number;
}

export const cubeModel: RasterModel = {
  vertices: [
    { x: 1, y: 1, z: 1 },
    { x: -1, y: 1, z: 1 },
    { x: -1, y: -1, z: 1 },
    { x: 1, y: -1, z: 1 },
    { x: 1, y: 1, z: -1 },
    { x: -1, y: 1, z: -1 },
    { x: -1, y: -1, z: -1 },
    { x: 1, y: -1, z: -1 },
  ],
  triangles: [
    { a: 0, b: 1, c: 2, color: Red },
    { a: 0, b: 2, c: 3, color: Red },
    { a: 4, b: 0, c: 3, color: Green },
    { a: 4, b: 3, c: 7, color: Green },
    { a: 5, b: 4, c: 7, color: Blue },
    { a: 5, b: 7, c: 6, color: Blue },
    { a: 1, b: 5, c: 6, color: Yellow },
    { a: 1, b: 6, c: 2, color: Yellow },
    { a: 4, b: 5, c: 1, color: Purple },
    { a: 4, b: 1, c: 0, color: Purple },
    { a: 2, b: 6, c: 7, color: Cyan },
    { a: 2, b: 7, c: 3, color: Cyan },
  ],
  center: { x: 0, y: 0, z: 0 },
  radius: Math.sqrt(3),
};

export const modelMap = {
  cube: cubeModel,
};
