<script lang="ts">
  import { createEventDispatcher } from "svelte/internal";
  import type { Piece } from "~/proto/local/data";

  import PieceCreator from "~/screens/PieceCreator.svelte";
  import Message from "~/wrappers/Message.svelte";
  import Loading from "~/wrappers/Loading.svelte";

  const dispatcher = createEventDispatcher<{
    completed: Piece | null;
  }>();
</script>

<Message>
  <Loading>
    <PieceCreator on:submit={(p) => dispatcher("completed", p.detail)} />
  </Loading>
</Message>
