<script lang="ts">
  import { scene } from '$lib/scenes/chapter-3-scene';
  import SceneRenderer from '$lib/components/rayTraceRenderer.svelte';
</script>

<SceneRenderer {scene}>
  <h1>Chapter 3: Lights</h1>
  <p>
    This is my implementation of <a href="https://gabrielgambetta.com/computer-graphics-from-scratch/03-light.html"
      >03-light</a
    >.
  </p>
</SceneRenderer>
