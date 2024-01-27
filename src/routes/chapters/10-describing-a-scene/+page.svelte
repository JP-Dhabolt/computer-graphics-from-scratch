<script lang="ts">
  import { onMount, getContext } from 'svelte';
  import { Renderer } from '$lib/rasterizer/renderer';
  import { RasterScene } from '$lib/rasterizer/scene';

  const context = getContext<{ getCanvas: () => HTMLCanvasElement }>('canvas');

  onMount(() => {
    const canvas = context.getCanvas();
    const scene = new RasterScene([
      {
        model: 'cube',
        position: { x: -1.5, y: 0, z: 7 },
      },
      {
        model: 'cube',
        position: { x: 2.5, y: 0, z: 7 },
      },
    ]);
    const renderer = new Renderer({ canvas, scene });
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
