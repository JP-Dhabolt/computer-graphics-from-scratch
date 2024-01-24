<script lang="ts">
  import { onMount, getContext } from 'svelte';
  import { Renderer } from '$lib/rasterizer/renderer';

  const context = getContext<{ getCanvas: () => HTMLCanvasElement }>('canvas');

  onMount(() => {
    const canvas = context.getCanvas();
    const renderer = new Renderer({ canvas, zProjectionPlane: 0.1 });
    renderer.drawCube();
    renderer.updateCanvas();
  });
</script>

<h1>Chapter 9: Shaded Triangles</h1>
<p>
  This is my implementation of <a
    href="https://gabrielgambetta.com/computer-graphics-from-scratch/09-perspective-projection.html"
    >09-perspective-projection</a
  >.
</p>
