import { Blue, Green, Red } from '$lib/colors';
import { Scene } from '$lib/scene';
import { Sphere } from '$lib/shapes/sphere';

export const scene = new Scene();
scene.addSphere(new Sphere([0, -1, 3], 1, Red));
scene.addSphere(new Sphere([2, 0, 4], 1, Blue));
scene.addSphere(new Sphere([-2, 0, 4], 1, Green));
