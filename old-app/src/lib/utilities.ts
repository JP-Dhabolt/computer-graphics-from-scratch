import { dotProduct, subtract } from './algebra';
import type { Sphere } from './shapes/sphere';
import type { StaticScene, Vector2, Vector3 } from './types';

export interface ClosestIntersection {
  closestSphere: Sphere;
  closestT: number;
}

export interface CalculateClosestIntersectionCommand {
  origin: Vector3;
  direction: Vector3;
  minTime: number;
  maxTime: number;
  scene: StaticScene;
}

export function calculateClosestIntersection({
  origin,
  direction,
  minTime,
  maxTime,
  scene,
}: CalculateClosestIntersectionCommand): ClosestIntersection {
  let closestT = Infinity;
  let closestSphere: Sphere | null = null;

  for (let i = 0; i < scene.spheres.length; i++) {
    const solutions = intersectRaySphere(origin, direction, scene.spheres[i]);
    const checkSolution = (s: number) => {
      if (s < closestT && minTime < s && s < maxTime) {
        closestT = s;
        closestSphere = scene.spheres[i];
      }
    };

    checkSolution(solutions[0]);
    checkSolution(solutions[1]);
  }
  return { closestSphere, closestT };
}

function intersectRaySphere(origin: Vector3, direction: Vector3, sphere: Sphere): Vector2 {
  const originToSphere = subtract(origin, sphere.center);

  const quadraticA = dotProduct(direction, direction);
  const quadraticB = 2 * dotProduct(originToSphere, direction);
  const quatraticC = dotProduct(originToSphere, originToSphere) - sphere.radius * sphere.radius;

  const discriminant = quadraticB * quadraticB - 4 * quadraticA * quatraticC;
  if (discriminant < 0) {
    return [Infinity, Infinity];
  }

  const solution1 = (-quadraticB + Math.sqrt(discriminant)) / (2 * quadraticA);
  const solution2 = (-quadraticB - Math.sqrt(discriminant)) / (2 * quadraticA);
  return [solution1, solution2];
}
