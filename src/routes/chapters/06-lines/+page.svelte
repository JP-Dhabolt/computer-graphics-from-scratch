<script lang="ts">
  import { onMount, getContext } from 'svelte';
  import type { Vector2 } from '$lib/types';

  import { Green } from '$lib/colors';
  import { Renderer } from '$lib/rasterizer/renderer';

  const context = getContext<{ getCanvas: () => HTMLCanvasElement }>('canvas');

  onMount(() => {
    const canvas = context.getCanvas();
    const renderer = new Renderer({ canvas });
    const startPoint: Vector2 = [0, 0];
    const endPoint: Vector2 = [150, 50];
    renderer.drawLine(startPoint, endPoint, Green);
    renderer.updateCanvas();
  });
</script>

<h1>Chapter 6: Lines</h1>
<p>
  This is my implementation of <a href="https://gabrielgambetta.com/computer-graphics-from-scratch/06-lines.html"
    >06-lines</a
  >.
</p>
