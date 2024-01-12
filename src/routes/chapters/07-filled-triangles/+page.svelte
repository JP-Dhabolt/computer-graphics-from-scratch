<script lang="ts">
  import { onMount, getContext } from 'svelte';

  import { Green, Red } from '$lib/colors';
  import { Renderer } from '$lib/rasterizer/renderer';

  const context = getContext<{ getCanvas: () => HTMLCanvasElement }>('canvas');

  onMount(() => {
    const canvas = context.getCanvas();
    const renderer = new Renderer({ canvas });
    renderer.drawFilledTriangle([-200, -250], [200, 50], [20, 250], Red);
    renderer.drawWireframeTriangle([-200, -250], [200, 50], [20, 250], Green);
    renderer.updateCanvas();
  });
</script>

<h1>Chapter 7: Filled Triangles</h1>
<p>
  This is my implementation of <a
    href="https://gabrielgambetta.com/computer-graphics-from-scratch/07-filled-triangles.html">07-filled-triangles</a
  >.
</p>
