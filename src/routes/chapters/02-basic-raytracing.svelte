<script lang="typescript">
  import { onMount, getContext } from 'svelte';

  import { scene } from '$lib/scenes/chapter-2-scene';
  import { Renderer } from '$lib/renderer';

  const { getCanvas } = getContext<{ getCanvas: () => HTMLCanvasElement }>('canvas');

  onMount(() => {
    const canvas = getCanvas();
    const width = canvas.width;
    const height = canvas.height;
    const r = new Renderer({ canvas });
    for (let x = -width / 2; x < width / 2; x++) {
      for (let y = -height / 2; y < height / 2; y++) {
        const direction = r.canvasToViewport([x, y]);
        const color = r.traceRay({
          origin: r.cameraPosition,
          direction,
          minTime: 1,
          maxTime: Infinity,
          scene,
        });
        r.putPixel(x, y, color);
      }
    }
    r.updateCanvas();
  });
</script>

<h1>Chapter 2: Basic Raytracing</h1>
<p>
  This is my implementation of <a
    href="https://gabrielgambetta.com/computer-graphics-from-scratch/02-basic-raytracing.html">02-basic-raytracing</a
  >. The main difference is that I have attempted to keep the scene logic and the renderer logic separate in order to
  avoid duplication of effort between chapters. As I continue through the chapters, this logic will most certainly be
  refactored and refined.
</p>
