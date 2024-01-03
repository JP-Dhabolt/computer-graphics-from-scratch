import type { Sphere } from './shapes/sphere';

export type Vector2 = [number, number];
export type Vector3 = [number, number, number];

export interface StaticScene {
  spheres: Sphere[];
  lights: SceneLight[];
}

export interface BaseLight {
  calculateIntensity: (
    point: Vector3,
    normal: Vector3,
    viewVector: Vector3,
    specular: number,
    scene: StaticScene
  ) => number;
}

export interface AmbientLight extends BaseLight {
  type: 'ambient';
  intensity: number;
}

export interface PointLight extends BaseLight {
  type: 'point';
  intensity: number;
  position: Vector3;
  tMax: number;
}

export interface DirectionalLight extends BaseLight {
  type: 'directional';
  intensity: number;
  direction: Vector3;
  tMax: number;
}

export type SceneLight = AmbientLight | PointLight | DirectionalLight;
