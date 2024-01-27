<script lang="ts">
  import { onMount, getContext } from 'svelte';
  import { Renderer } from '$lib/rasterizer/renderer';
  import { RasterScene, SceneInstance, Transform } from '$lib/rasterizer/scene';
  import { Black } from '$lib/colors';

  const context = getContext<{ getCanvas: () => HTMLCanvasElement }>('canvas');

  onMount(() => {
    const canvas = context.getCanvas();
    const instances: SceneInstance[] = [
      new SceneInstance(
        'cube',
        new Transform({ translation: { x: -1.5, y: 0, z: 7 }, rotation: { x: 45, y: 0, z: 0 }, scale: 0.75 })
      ),
      new SceneInstance(
        'cube',
        new Transform({ translation: { x: 2.5, y: 0, z: 7 }, rotation: { x: 0, y: 45, z: 0 }, scale: 0.5 })
      ),
    ];
    const scene = new RasterScene(instances);
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
