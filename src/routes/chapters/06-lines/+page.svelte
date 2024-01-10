<script lang="ts">
  import { onMount, getContext } from 'svelte';

  import { Green, Red } from '$lib/colors';
  import { Renderer } from '$lib/rasterizer/renderer';

  const context = getContext<{ getCanvas: () => HTMLCanvasElement }>('canvas');

  onMount(() => {
    const canvas = context.getCanvas();
    const renderer = new Renderer({ canvas });
    renderer.drawLine([-200, -100], [240, 120], Green);
    renderer.drawLine([-50, -200], [60, 240], Red);
    renderer.updateCanvas();
  });
</script>

<h1>Chapter 6: Lines</h1>
<p>
  This is my implementation of <a href="https://gabrielgambetta.com/computer-graphics-from-scratch/06-lines.html"
    >06-lines</a
  >.
</p>
