<script lang="typescript">
  import { setContext } from 'svelte';
  const width = 600;
  const height = 600;
  let canvas: HTMLCanvasElement;

  setContext('canvas', {
    getCanvas: () => canvas,
  });
</script>

<a href="/">Go Back Home</a>
<slot />
<canvas bind:this={canvas} {width} {height} />

<style>
  canvas {
    border: 1px grey solid;
  }
</style>
