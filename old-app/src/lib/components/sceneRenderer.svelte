<script lang="typescript">
  import { onMount, getContext } from 'svelte';

  import { Renderer } from '$lib/renderer';
  import type { StaticScene } from '$lib/types';

  const { getCanvas } = getContext<{ getCanvas: () => HTMLCanvasElement }>('canvas');
  export let scene: StaticScene;

  onMount(() => {
    const canvas = getCanvas();
    const width = canvas.width;
    const height = canvas.height;
    const r = new Renderer({ canvas, scene });
    for (let x = -width / 2; x < width / 2; x++) {
      for (let y = -height / 2; y < height / 2; y++) {
        const direction = r.canvasToViewport([x, y]);
        const color = r.traceRay({
          origin: r.cameraPosition,
          direction,
          minTime: 1,
          maxTime: Infinity,
        });
        r.putPixel(x, y, color);
      }
    }
    r.updateCanvas();
  });
</script>

<slot />
