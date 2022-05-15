<script lang="ts">
  export let filter: (f: File) => boolean
  export let handler: (files: File[]) => void

  const upload = (e: Event & {
    currentTarget: EventTarget & HTMLInputElement;
  }) => {
    if (!e.currentTarget.files) return
    const files = []
    for (const f of e.currentTarget.files) {
      if (filter(f)) {
        files.push(f)
      }
    }
    handler(files)
  };
</script>

<input class="hidden" id="file-input" type="file" multiple on:change={upload} />
