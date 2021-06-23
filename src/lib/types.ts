import type { Sphere } from './shapes/sphere';

export type Vector2 = [number, number];
export type Vector3 = [number, number, number];

export interface StaticScene {
  spheres: Sphere[];
  lights: SceneLight[];
}

export interface BaseLight {
  calculateIntensity: (point: Vector3, normal: Vector3) => number;
}

export interface AmbientLight extends BaseLight {
  type: 'ambient';
  intensity: number;
}

export interface PointLight extends BaseLight {
  type: 'point';
  intensity: number;
  position: Vector3;
}

export interface DirectionalLight extends BaseLight {
  type: 'directional';
  intensity: number;
  direction: Vector3;
}

export type SceneLight = AmbientLight | PointLight | DirectionalLight;
