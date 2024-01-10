import { Ambient } from './rayTracer/lights';
import type { Sphere } from './shapes/sphere';
import type { SceneLight, StaticScene } from './rayTracer/types';

export class Scene implements StaticScene {
  spheres: Sphere[] = [];
  lights: SceneLight[] = [];

  constructor(lights: SceneLight[] = []) {
    if (lights.length === 0) {
      this.addLights([new Ambient(1)]);
    } else {
      this.addLights(lights);
    }
  }

  clearLights(): void {
    this.lights = [];
  }

  clearSpheres(): void {
    this.spheres = [];
  }

  addSphere(sphere: Sphere): void {
    this.spheres.push(sphere);
  }

  addLights(light: SceneLight[]): void {
    this.lights.push(...light);

    const totalIntensity = this.lights.reduce((prev, curr) => {
      prev += curr.intensity;
      return prev;
    }, 0);

    this.lights.forEach((l) => {
      l.intensity = l.intensity / totalIntensity;
    });
  }
}
