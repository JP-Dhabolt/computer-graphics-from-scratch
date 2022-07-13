import { dotProduct, length, subtract } from './algebra';
import type { AmbientLight, DirectionalLight, PointLight, StaticScene, Vector3 } from './types';

export function computeLighting(point: Vector3, normal: Vector3, scene: StaticScene): number {
  let intensity = 0.0;
  scene.lights.forEach((light) => {
    intensity += light.calculateIntensity(point, normal);
  });
  return intensity;
}
export class Ambient implements AmbientLight {
  type: 'ambient' = 'ambient';
  intensity: number;

  constructor(intensity: number) {
    this.intensity = intensity;
  }

  calculateIntensity(): number {
    return this.intensity;
  }
}

export class Point implements PointLight {
  type: 'point';
  intensity: number;
  position: Vector3;

  constructor(position: Vector3, intensity: number) {
    this.position = position;
    this.intensity = intensity;
  }

  calculateIntensity(point: Vector3, normal: Vector3): number {
    const lightVector = subtract(this.position, point);
    const dot = dotProduct(normal, lightVector);
    if (dot <= 0) {
      return 0;
    }
    return (this.intensity * dot) / (length(normal) * length(lightVector));
  }
}

export class Directional implements DirectionalLight {
  type: 'directional';
  intensity: number;
  direction: Vector3;

  constructor(direction: Vector3, intensity: number) {
    this.direction = direction;
    this.intensity = intensity;
  }

  calculateIntensity(_: Vector3, normal: Vector3): number {
    const dot = dotProduct(normal, this.direction);
    if (dot <= 0) {
      return 0;
    }

    return (this.intensity * dot) / (length(normal) * length(this.direction));
  }
}
