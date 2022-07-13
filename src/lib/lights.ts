import { dotProduct, length, multiply, subtract } from './algebra';
import type { AmbientLight, DirectionalLight, PointLight, StaticScene, Vector3 } from './types';

export function computeLighting(
  point: Vector3,
  normal: Vector3,
  viewVector: Vector3,
  scene: StaticScene,
  specular = -1
): number {
  let intensity = 0.0;
  scene.lights.forEach((light) => {
    intensity += light.calculateIntensity(point, normal, viewVector, specular);
  });
  return intensity;
}

function calculateSpecularLightIntensity(
  specular: number,
  normal: Vector3,
  lightVector: Vector3,
  viewVector: Vector3,
  lightIntensity: number
) {
  if (specular != -1) {
    const reflectionVector = subtract(multiply(dotProduct(normal, lightVector), multiply(2, normal)), lightVector);
    const reflectionViewDot = dotProduct(reflectionVector, viewVector);
    if (reflectionViewDot > 0) {
      return lightIntensity * Math.pow(reflectionViewDot / (length(reflectionVector) * length(viewVector)), specular);
    }
  }
  return 0;
}

function calculateDiffuseLightIntensity(lightVector: Vector3, normal: Vector3, lightIntensity: number): number {
  const normalLightDotProduct = dotProduct(normal, lightVector);
  if (normalLightDotProduct > 0) {
    return (lightIntensity * normalLightDotProduct) / (length(normal) * length(lightVector));
  }
  return 0;
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

  calculateIntensity(point: Vector3, normal: Vector3, viewVector: Vector3, specular: number): number {
    let intensity = 0.0;
    const lightVector = subtract(this.position, point);
    intensity += calculateDiffuseLightIntensity(lightVector, normal, this.intensity);
    intensity += calculateSpecularLightIntensity(specular, normal, lightVector, viewVector, this.intensity);
    return intensity;
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

  calculateIntensity(_: Vector3, normal: Vector3, viewVector: Vector3, specular: number): number {
    let intensity = 0.0;
    intensity += calculateDiffuseLightIntensity(this.direction, normal, this.intensity);
    intensity += calculateSpecularLightIntensity(specular, normal, this.direction, viewVector, this.intensity);
    return intensity;
  }
}
