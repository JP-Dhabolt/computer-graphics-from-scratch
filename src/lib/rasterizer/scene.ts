import { createScaleMatrix4x4, createTranslationMatrix4x4, multiplyMatrix4x4 } from '$lib/algebra';
import { IdentityMatrix, type Matrix4x4, type Point3D } from '$lib/types';
import { modelMap } from './models';

export interface TransformArgs {
  scale?: number;
  rotation?: Matrix4x4;
  translation?: Point3D;
}

export class Transform {
  scale: number;
  rotation: Matrix4x4;
  translation: Point3D;

  constructor({ scale, rotation, translation }: TransformArgs = {}) {
    this.scale = scale || 1;
    this.rotation = rotation || IdentityMatrix;
    this.translation = translation || { x: 0, y: 0, z: 0 };
  }
}

export class SceneInstance {
  public transformMatrix: Matrix4x4;

  constructor(
    public model: keyof typeof modelMap,
    public transform: Transform = new Transform()
  ) {
    const translationMatrix = createTranslationMatrix4x4([
      transform.translation.x,
      transform.translation.y,
      transform.translation.z,
    ]);
    const scalingMatrix = createScaleMatrix4x4(transform.scale);
    const intermediateMatrix = multiplyMatrix4x4(transform.rotation, scalingMatrix);
    this.transformMatrix = multiplyMatrix4x4(translationMatrix, intermediateMatrix);
  }
}

export class RasterScene {
  instances: SceneInstance[];
  models: typeof modelMap;
  camera: Transform;

  constructor(instances: SceneInstance[], camera: Transform) {
    this.instances = instances;
    this.models = modelMap;
    this.camera = camera;
  }
}
