<script lang="ts">
  import { onMount, getContext } from 'svelte';
  import { Renderer } from '$lib/rasterizer/renderer';
  import { RasterScene, SceneInstance, Transform } from '$lib/rasterizer/scene';
  import { Black } from '$lib/colors';
  import { createRotationMatrix4x4X, createRotationMatrix4x4Y } from '$lib/algebra';

  const context = getContext<{ getCanvas: () => HTMLCanvasElement }>('canvas');

  onMount(() => {
    const canvas = context.getCanvas();
    const instances: SceneInstance[] = [
      new SceneInstance(
        'cube',
        new Transform({ translation: { x: -1.5, y: 0, z: 7 }, rotation: createRotationMatrix4x4X(45), scale: 0.75 })
      ),
      new SceneInstance(
        'cube',
        new Transform({ translation: { x: 2.5, y: 0, z: 7 }, rotation: createRotationMatrix4x4Y(45), scale: 0.5 })
      ),
    ];
    const camera = new Transform({ translation: { x: 0, y: 0, z: 0 } });
    const scene = new RasterScene(instances, camera);
    var s2 = 1.0 / Math.sqrt(2);
    const renderer = new Renderer({
      canvas,
      scene,
      backgroundColor: Black,
      clippingPlanes: [
        { normal: [0, 0, 1], distance: -6.7 }, // Near
        { normal: [s2, 0, s2], distance: 0 }, // Left
        { normal: [-s2, 0, s2], distance: 0 }, // Right
        { normal: [0, -s2, s2], distance: 0 }, // Top
        { normal: [0, s2, s2], distance: 0 }, // Bottom
      ],
    });
    renderer.renderScene();
    renderer.updateCanvas();
  });
</script>

<h1>Chapter 11: Clipping</h1>
<p>
  This is my implementation of <a href="https://gabrielgambetta.com/computer-graphics-from-scratch/11-clipping.html"
    >11-clipping</a
  >.
</p>
