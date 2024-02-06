import type { Line3D, Matrix4x4, Plane, Point3D, Vector3, Vector4 } from './types';

export function dotProduct(v1: Vector3, v2: Vector3): number {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

export function dotProduct4(v1: Vector4, v2: Vector4): number {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2] + v1[3] * v2[3];
}

export function subtract(v1: Vector3, v2: Vector3): Vector3 {
  return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

export function add(v1: Vector3, v2: Vector3): Vector3 {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}

export function length(vector: Vector3): number {
  return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2) + Math.pow(vector[2], 2));
}

export function multiply(x: number, v: Vector3): Vector3 {
  return [x * v[0], x * v[1], x * v[2]];
}

export function clamp(x: number, min: number, max: number): number {
  return Math.min(Math.max(x, min), max);
}

export function interpolate(i0: number, d0: number, i1: number, d1: number): number[] {
  if (i0 === i1) {
    return [d0];
  }

  const values = [];
  const a = (d1 - d0) / (i1 - i0);
  let d = d0;

  for (let i = i0; i <= i1; i++) {
    values.push(d);
    d += a;
  }

  return values;
}

export function multiplyMatrix4x4(m1: Matrix4x4, m2: Matrix4x4): Matrix4x4 {
  const result: Matrix4x4 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        result[i][j] += m1[i][k] * m2[k][j];
      }
    }
  }

  return result;
}

export function transposeMatrix4x4(m: Matrix4x4): Matrix4x4 {
  const result: Matrix4x4 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < m.length; j++) {
      result[i][j] = m[j][i];
    }
  }

  return result;
}

export function multiplyMatrix4x4Vector4(m: Matrix4x4, v: Vector4): Vector4 {
  const result: Vector4 = [0, 0, 0, 0];

  for (let i = 0; i < 4; i++) {
    result[i] = dotProduct4(m[i], v);
  }

  return result;
}

export function createRotationMatrix4x4X(angleInDegrees: number): Matrix4x4 {
  const c = Math.cos((angleInDegrees * Math.PI) / 180);
  const s = Math.sin((angleInDegrees * Math.PI) / 180);

  return [
    [1, 0, 0, 0],
    [0, c, -s, 0],
    [0, s, c, 0],
    [0, 0, 0, 1],
  ];
}

export function createRotationMatrix4x4Y(angleInDegrees: number): Matrix4x4 {
  const c = Math.cos((angleInDegrees * Math.PI) / 180);
  const s = Math.sin((angleInDegrees * Math.PI) / 180);

  return [
    [c, 0, s, 0],
    [0, 1, 0, 0],
    [-s, 0, c, 0],
    [0, 0, 0, 1],
  ];
}

export function createRotationMatrix4x4Z(angleInDegrees: number): Matrix4x4 {
  const c = Math.cos((angleInDegrees * Math.PI) / 180);
  const s = Math.sin((angleInDegrees * Math.PI) / 180);

  return [
    [c, -s, 0, 0],
    [s, c, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
}

export function createTranslationMatrix4x4(v: Vector3): Matrix4x4 {
  return [
    [1, 0, 0, v[0]],
    [0, 1, 0, v[1]],
    [0, 0, 1, v[2]],
    [0, 0, 0, 1],
  ];
}

export function createScaleMatrix4x4(scale: number): Matrix4x4 {
  return [
    [scale, 0, 0, 0],
    [0, scale, 0, 0],
    [0, 0, scale, 0],
    [0, 0, 0, 1],
  ];
}

export function convertPoint3dToHomogeneous(p: Point3D): Vector4 {
  return [p.x, p.y, p.z, 1];
}

export function getSignedDistance(plane: Plane, point: Point3D): number {
  return point.x * plane.normal[0] + point.y * plane.normal[1] + point.z * plane.normal[2] + plane.distance;
}

export function getIntersectionPoint(plane: Plane, line: Line3D): Point3D {
  const lineVector = {
    x: line.end.x - line.start.x,
    y: line.end.y - line.start.y,
    z: line.end.z - line.start.z,
  };

  const numerator = -(
    line.start.x * plane.normal[0] +
    line.start.y * plane.normal[1] +
    line.start.z * plane.normal[2] +
    plane.distance
  );

  const denominator = lineVector.x * plane.normal[0] + lineVector.y * plane.normal[1] + lineVector.z * plane.normal[2];

  const t = numerator / denominator;

  return {
    x: line.start.x + t * lineVector.x,
    y: line.start.y + t * lineVector.y,
    z: line.start.z + t * lineVector.z,
  };
}
