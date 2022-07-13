import { Blue, Green, Red, Yellow } from '$lib/colors';
import { Ambient, Directional, Point } from '$lib/lights';
import { Scene } from '$lib/scene';
import { Sphere } from '$lib/shapes/sphere';

export const scene = new Scene([new Ambient(0.2), new Point([2, 1, 0], 0.6), new Directional([1, 4, 4], 0.2)]);

scene.addSphere(new Sphere([0, -1, 3], 1, Red));
scene.addSphere(new Sphere([2, 0, 4], 1, Blue));
scene.addSphere(new Sphere([-2, 0, 4], 1, Green));
scene.addSphere(new Sphere([0, -5001, 0], 5000, Yellow));
