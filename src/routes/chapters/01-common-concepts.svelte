<script lang="typescript">
  import { onMount, getContext } from 'svelte';

  import { Green } from '$lib/colors';
  import { Renderer } from '$lib/renderer';

  const { getCanvas } = getContext<{ getCanvas: () => HTMLCanvasElement }>('canvas');

  onMount(() => {
    const canvas = getCanvas();
    const width = canvas.width;
    const renderer = new Renderer({ canvas });
    for (let x = -width / 2; x < width / 2; x++) {
      renderer.putPixel(x, 0, Green);
    }
    renderer.updateCanvas();
  });
</script>

<h1>Chapter 1: Common Concepts</h1>
<p>
  Here, I've simply implemented some of the common functionality and drawn a green light in the middle of the canvas to
  validate functionality.
</p>
