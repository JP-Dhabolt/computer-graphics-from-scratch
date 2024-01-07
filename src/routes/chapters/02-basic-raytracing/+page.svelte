<script lang="ts">
  import { scene } from '$lib/scenes/chapter-2-scene';
  import SceneRenderer from '$lib/components/sceneRenderer.svelte';
</script>

<SceneRenderer {scene}>
  <h1>Chapter 2: Basic Raytracing</h1>
  <p>
    This is my implementation of <a
      href="https://gabrielgambetta.com/computer-graphics-from-scratch/02-basic-raytracing.html">02-basic-raytracing</a
    >. The main difference is that I have attempted to keep the scene logic and the renderer logic separate in order to
    avoid duplication of effort between chapters. As I continue through the chapters, this logic will most certainly be
    refactored and refined.
  </p>
</SceneRenderer>
