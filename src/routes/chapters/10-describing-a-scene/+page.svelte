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
    const renderer = new Renderer({ canvas, scene, backgroundColor: Black });
    renderer.renderScene();
    renderer.updateCanvas();
  });
</script>

<h1>Chapter 10: Describing and Rendering a Scene</h1>
<p>
  This is my implementation of <a
    href="https://gabrielgambetta.com/computer-graphics-from-scratch/10-describing-and-rendering-a-scene.html"
    >10-describing-and-rendering-a-scene</a
  >.
</p>
