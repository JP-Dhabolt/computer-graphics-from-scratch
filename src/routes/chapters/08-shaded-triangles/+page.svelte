<script lang="ts">
  import { onMount, getContext } from 'svelte';

  import { Green } from '$lib/colors';
  import { Renderer } from '$lib/rasterizer/renderer';

  const context = getContext<{ getCanvas: () => HTMLCanvasElement }>('canvas');

  onMount(() => {
    const canvas = context.getCanvas();
    const renderer = new Renderer({ canvas });
    renderer.drawShadedTriangle(
      {
        x: -200,
        y: -250,
        intensity: 0.0,
      },
      {
        x: 200,
        y: 50,
        intensity: 0.0,
      },
      {
        x: 20,
        y: 250,
        intensity: 1.0,
      },
      Green
    );
    renderer.updateCanvas();
  });
</script>

<h1>Chapter 8: Shaded Triangles</h1>
<p>
  This is my implementation of <a
    href="https://gabrielgambetta.com/computer-graphics-from-scratch/08-shaded-triangles.html">08-shaded-triangles</a
  >.
</p>
