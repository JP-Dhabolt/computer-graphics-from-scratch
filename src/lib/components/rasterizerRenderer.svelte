<script lang="ts">
  import { onMount, getContext } from 'svelte';

  import { Renderer } from '$lib/rasterizer/renderer';

  const { getCanvas } = getContext<{ getCanvas: () => HTMLCanvasElement }>('canvas');

  onMount(() => {
    const canvas = getCanvas();
    const r = new Renderer({ canvas });
    r.updateCanvas();
  });
</script>

<slot />
