import type { Point3D } from '$lib/types';
import { modelMap } from './models';

export interface SceneInstance {
  model: keyof typeof modelMap;
  position: Point3D;
}

export class RasterScene {
  instances: SceneInstance[];
  models: typeof modelMap;

  constructor(instances: SceneInstance[]) {
    this.instances = instances;
    this.models = modelMap;
  }
}
