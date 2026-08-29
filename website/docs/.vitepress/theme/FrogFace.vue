<script setup>
import { withBase } from "vitepress";
import { onBeforeUnmount, onMounted, ref } from "vue";

/**
 * The face barely moves — a blink, a glance, a smile that creeps — so running it
 * at display rate would spend a laptop's battery on frames nobody can tell
 * apart. Same cap the admin login canvases use.
 */
const FPS_CAP = 14;

/**
 * Square drawing buffer. The renderer otherwise leaves the canvas on its
 * 1280x720 default, and the frog is drawn around a centered square, so a 16:9
 * buffer scaled into the CSS box would squash the face. Larger than the 320px
 * the hero gives it, to hold up on a high-density screen.
 */
const BUFFER_SIZE = 512;

/** The renderer finds its canvas by id, so this has to be unique in the page. */
const CANVAS_ID = "frogFaceCanvas";

const ready = ref(false);

let animation = null;
let observer = null;
let disposed = false;

onBeforeUnmount(() => {
  disposed = true;
  observer?.disconnect();
  animation?.stop();
});

onMounted(async () => {
  try {
    // Imported here rather than at the top of the module because VitePress
    // prerenders every page in Node, where these libraries have no document to
    // reach for. onMounted never runs during that pass.
    const [{ Player }, { FullscreenQuad, Mesh, PerspectiveCamera, Renderer, Scene }] =
      await Promise.all([
        import("@lcluber/frameratjs"),
        import("@lcluber/roostrjs"),
      ]);
    if (disposed) return;

    const [vertexShader, fragmentShader] = await Promise.all([
      loadShader("frog-face_vert-ready.glsl"),
      loadShader("frog-face_frag-ready.glsl"),
    ]);
    if (disposed) return;

    const renderer = new Renderer(CANVAS_ID);
    const context = renderer.getContext();
    if (!context) return;
    // The renderer puts its own 1280x720 default on the canvas, which both
    // stretches the element's box to 16:9 and leaves the viewport drawing into
    // one corner of the buffer, so the size has to be set back afterwards.
    renderer.canvas.width = BUFFER_SIZE;
    renderer.canvas.height = BUFFER_SIZE;
    renderer.setViewport(BUFFER_SIZE, BUFFER_SIZE);

    const scene = new Scene(context);
    const camera = new PerspectiveCamera(75, 0.1, 1000, context);
    const quad = new Mesh(new FullscreenQuad(), context);
    scene.addMesh(quad);
    quad.addProgram(vertexShader, fragmentShader, null);

    animation = new Player(() => {
      renderer.clearFrame();
      scene.render(camera, animation.getTime());
    });
    animation.capFPS(FPS_CAP);
    animation.start();
    ready.value = true;

    // The hero is at the top of the page, so the frog is scrolled past within a
    // few seconds of anyone arriving and then draws for as long as they read.
    // requestAnimationFrame stops itself for a hidden tab but knows nothing
    // about a canvas that has left the viewport, so that case is watched here.
    // pause() leaves the clock where it stands, unlike stop(), which resets it
    // and would snap the face back to the start of every cycle it is mid-way
    // through on the way back up.
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) animation.start();
      else animation.pause();
    });
    observer.observe(renderer.canvas);
  } catch {
    // The frog is decoration. A machine without WebGL, or a shader that failed
    // to load, leaves the hero without it rather than without a page: `ready`
    // stays false and the canvas keeps the space but shows nothing.
  }
});

async function loadShader(file) {
  const response = await fetch(withBase(`/shader/${file}`));
  if (!response.ok) throw new Error(`Cannot load shader ${file}`);
  return response.text();
}
</script>

<template>
  <canvas
    :id="CANVAS_ID"
    class="image-src frog-face"
    :class="{ 'is-ready': ready }"
    :width="BUFFER_SIZE"
    :height="BUFFER_SIZE"
    aria-hidden="true"
  />
</template>

<style scoped>
/* Positioning, and the size at each breakpoint, come from the hero's own
   `.image-src` rule, which this canvas stands in for. */
.frog-face {
  border-radius: 50%;
  opacity: 0;
  transition: opacity 400ms ease;
}

.frog-face.is-ready {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .frog-face {
    transition: none;
  }
}
</style>
