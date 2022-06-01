<script lang="ts">
  import { afterUpdate, onDestroy } from "svelte";
  import { imageStore } from "../store/image";

  export let bytes: Uint8Array;
  export let alt: string;

  let root: HTMLDivElement;
  let container: HTMLDivElement;
  let image: HTMLImageElement;

  let observer: ResizeObserver;

  afterUpdate(async () => {
    await new Promise((r) => (image.onload = r));

    const widthRatio = image.clientWidth / image.clientHeight;
    const heightRatio = image.clientHeight / image.clientWidth;

    observer = new ResizeObserver(() => {
      if (!image) return;

      const rx = (image.clientHeight * widthRatio) / root.clientWidth;
      const ry = (image.clientWidth * heightRatio) / root.clientHeight;
      if (
        ry > rx &&
        !image.classList.contains("h-full") &&
        !container.classList.contains("h-full")
      ) {
        image.classList.remove("w-full");
        image.classList.add("h-full");
        container.classList.remove("w-full");
        container.classList.add("h-full");
      } else if (
        rx > ry &&
        !image.classList.contains("w-full") &&
        !container.classList.contains("w-full")
      ) {
        image.classList.remove("h-full");
        image.classList.add("w-full");
        container.classList.remove("h-full");
        container.classList.add("w-full");
      }
    });

    observer.observe(root);
  });

  onDestroy(() => observer.disconnect());
</script>

<div bind:this={root} class="centered h-full">
  <div bind:this={container} class="relative">
    <img bind:this={image} src={imageStore.fetch(bytes)} {alt} />
    <slot />
  </div>
</div>
