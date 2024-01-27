import type { Point3D } from '$lib/types';
import { modelMap } from './models';

export interface TransformArgs {
  scale?: number;
  rotation?: Point3D;
  translation?: Point3D;
}

export class Transform {
  scale: number;
  rotation: Point3D;
  translation: Point3D;

  constructor({ scale, rotation, translation }: TransformArgs = {}) {
    this.scale = scale || 1;
    this.rotation = rotation || { x: 0, y: 0, z: 0 };
    this.translation = translation || { x: 0, y: 0, z: 0 };
  }
}

export class SceneInstance {
  constructor(
    public model: keyof typeof modelMap,
    public transform: Transform = new Transform()
  ) {}
}

export class RasterScene {
  instances: SceneInstance[];
  models: typeof modelMap;

  constructor(instances: SceneInstance[]) {
    this.instances = instances;
    this.models = modelMap;
  }
}
