<script lang="ts">
  import type { Piece } from "~/proto/local/data";

  import PieceBrowser from "~/screens/PieceBrowser.svelte";
  import PieceEditor from "~/screens/PieceEditor.svelte";
  import AddButton from "~/components/common/AddButton.svelte";
  import Route from "~/components/common/Route.svelte";

  import { pieces } from "~/store/pieces";
  import PieceCreator from "~/screens/PieceCreator.svelte";
  import Position from "~/wrappers/Position.svelte";
  import PiecePractice from "~/screens/PiecePractice.svelte";

  const enum Routes {
    BROWSING,
    CREATING,
    EDITING,
    VIEWING,
  }

  type RouteContext =
    | { type: Routes.BROWSING }
    | { type: Routes.CREATING }
    | { type: Routes.EDITING; piece: Piece }
    | { type: Routes.VIEWING; piece: Piece };

  let route: RouteContext = { type: Routes.BROWSING };
</script>

{#if route.type === Routes.BROWSING}
  <Route>
    <PieceBrowser
      on:delete={(p) => {
        pieces.remove(p.detail);
      }}
      on:edit={(p) => {
        route = {
          type: Routes.EDITING,
          piece: p.detail,
        };
      }}
      on:choose={(p) => {
        route = {
          type: Routes.VIEWING,
          piece: p.detail,
        };
      }}
    />
    <Position x="right" y="bottom">
      <AddButton
        labelFor=""
        on:click={() => (route = { type: Routes.CREATING })}
      />
    </Position>
  </Route>
{:else if route.type === Routes.CREATING}
  <Route>
    <PieceCreator
      on:submit={(p) => {
        if (p.detail) {
          pieces.add(p.detail);
        }
        route = { type: Routes.BROWSING };
      }}
    />
  </Route>
{:else if route.type === Routes.EDITING}
  <Route>
    <PieceEditor
      piece={route.piece}
      title="Edit a piece"
      on:submit={() => (route = { type: Routes.BROWSING })}
    />
  </Route>
{:else if route.type === Routes.VIEWING}
  <Route>
    <PiecePractice
      piece={route.piece}
      on:close={() => (route = { type: Routes.BROWSING })}
    />
  </Route>
{/if}
