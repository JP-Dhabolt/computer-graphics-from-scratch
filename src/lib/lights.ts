import { dotProduct, length, multiply, subtract } from './algebra';
import type { AmbientLight, DirectionalLight, PointLight, StaticScene, Vector3 } from './types';
import { calculateClosestIntersection } from './utilities';

export const MIN_TIME_ABOVE_ZERO = 0.001;

export function computeLighting(
  point: Vector3,
  normal: Vector3,
  viewVector: Vector3,
  scene: StaticScene,
  specular = -1
): number {
  let intensity = 0.0;
  scene.lights.forEach((light) => {
    intensity += light.calculateIntensity(point, normal, viewVector, specular, scene);
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
    const reflectionVector = calculateReflectionVector(normal, lightVector);
    const reflectionViewDot = dotProduct(reflectionVector, viewVector);
    if (reflectionViewDot > 0) {
      return lightIntensity * Math.pow(reflectionViewDot / (length(reflectionVector) * length(viewVector)), specular);
    }
  }
  return 0;
}

export function calculateReflectionVector(normal: Vector3, lightVector: Vector3): Vector3 {
  return subtract(multiply(dotProduct(normal, lightVector), multiply(2, normal)), lightVector);
}

function calculateDiffuseLightIntensity(lightVector: Vector3, normal: Vector3, lightIntensity: number): number {
  const normalLightDotProduct = dotProduct(normal, lightVector);
  if (normalLightDotProduct > 0) {
    return (lightIntensity * normalLightDotProduct) / (length(normal) * length(lightVector));
  }
  return 0;
}

function calculateLightIntensity(
  origin: Vector3,
  direction: Vector3,
  normal: Vector3,
  viewVector: Vector3,
  lightIntensity: number,
  specular: number,
  tMax: number,
  scene: StaticScene
) {
  const { closestSphere } = calculateClosestIntersection({
    origin,
    direction,
    maxTime: tMax,
    minTime: MIN_TIME_ABOVE_ZERO,
    scene,
  });

  if (closestSphere !== null) {
    return 0;
  }

  return (
    calculateDiffuseLightIntensity(direction, normal, lightIntensity) +
    calculateSpecularLightIntensity(specular, normal, direction, viewVector, lightIntensity)
  );
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
  tMax = 1;

  constructor(position: Vector3, intensity: number) {
    this.position = position;
    this.intensity = intensity;
  }

  calculateIntensity(
    point: Vector3,
    normal: Vector3,
    viewVector: Vector3,
    specular: number,
    scene: StaticScene
  ): number {
    const lightVector = subtract(this.position, point);
    return calculateLightIntensity(point, lightVector, normal, viewVector, this.intensity, specular, this.tMax, scene);
  }
}

export class Directional implements DirectionalLight {
  type: 'directional';
  intensity: number;
  direction: Vector3;
  tMax = Infinity;

  constructor(direction: Vector3, intensity: number) {
    this.direction = direction;
    this.intensity = intensity;
  }

  calculateIntensity(
    point: Vector3,
    normal: Vector3,
    viewVector: Vector3,
    specular: number,
    scene: StaticScene
  ): number {
    return calculateLightIntensity(
      point,
      this.direction,
      normal,
      viewVector,
      this.intensity,
      specular,
      this.tMax,
      scene
    );
  }
}
