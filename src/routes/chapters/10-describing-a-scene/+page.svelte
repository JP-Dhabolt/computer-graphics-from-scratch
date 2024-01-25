<script lang="ts">
  import { onMount, getContext } from 'svelte';
  import { Renderer } from '$lib/rasterizer/renderer';
  import { Blue, Cyan, Green, Purple, Red, Yellow } from '$lib/colors';

  const context = getContext<{ getCanvas: () => HTMLCanvasElement }>('canvas');

  onMount(() => {
    const canvas = context.getCanvas();
    const renderer = new Renderer({ canvas });
    renderer.renderObject(
      [
        { x: -0.5, y: 1, z: 8 },
        { x: -2.5, y: 1, z: 8 },
        { x: -2.5, y: -1, z: 8 },
        { x: -0.5, y: -1, z: 8 },
        { x: -0.5, y: 1, z: 6 },
        { x: -2.5, y: 1, z: 6 },
        { x: -2.5, y: -1, z: 6 },
        { x: -0.5, y: -1, z: 6 },
      ],
      [
        { a: 0, b: 1, c: 2, color: Red },
        { a: 0, b: 2, c: 3, color: Red },
        { a: 4, b: 0, c: 3, color: Green },
        { a: 4, b: 3, c: 7, color: Green },
        { a: 5, b: 4, c: 7, color: Blue },
        { a: 5, b: 7, c: 6, color: Blue },
        { a: 1, b: 5, c: 6, color: Yellow },
        { a: 1, b: 6, c: 2, color: Yellow },
        { a: 4, b: 5, c: 1, color: Purple },
        { a: 4, b: 1, c: 0, color: Purple },
        { a: 2, b: 6, c: 7, color: Cyan },
        { a: 2, b: 7, c: 3, color: Cyan },
      ]
    );
    renderer.updateCanvas();
  });
</script>

<h1>Chapter 10: Describing and Rendering a Scene</h1>
<p>
  This is my implementation of <a
    href="https://gabrielgambetta.com/computer-graphics-from-scratch/10-describing-and-rendering-a-scene.html"
    >10-describing-and-rendering-a-scene</a
  >.
</p>
