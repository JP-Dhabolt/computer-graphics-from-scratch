import { Ambient } from './lights';
import type { Sphere } from './shapes/sphere';
import type { SceneLight, StaticScene } from './types';

export class Scene implements StaticScene {
  spheres: Sphere[] = [];
  lights: SceneLight[] = [];

  constructor(useStaticLight: boolean) {
    if (useStaticLight) {
      this.addLight(new Ambient(1));
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

  addLight(light: SceneLight): void {
    this.lights.push(light);

    const totalIntensity = this.lights.reduce((prev, curr) => {
      prev += curr.intensity;
      return prev;
    }, 0);

    this.lights.forEach((l) => {
      l.intensity = l.intensity / totalIntensity;
    });
  }
}
