<script lang="ts">
  import { Piece } from "../proto/local/data_pb";

  import AddButton from "../components/AddButton.svelte";

  import PieceBrowser from "./PieceBrowser.svelte";
  import PieceEditor from "./PieceEditor.svelte";
  import PieceViewer from "./PieceViewer.svelte";
  import Route from "../components/Route.svelte";

  enum Routes {
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

  let pieces: Piece[] = [];
</script>

{#if route.type === Routes.BROWSING}
  <Route>
    <PieceBrowser
      {pieces}
      on:delete={(p) => {
        const index = pieces.indexOf(p.detail);
        pieces = [...pieces.slice(0, index), ...pieces.slice(index + 1)];
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
    <AddButton
      labelFor=""
      on:click={() => (route = { type: Routes.CREATING })}
    />
  </Route>
{:else if route.type === Routes.CREATING}
  <Route>
    <PieceEditor
      piece={new Piece()}
      title="Add a piece"
      on:submit={(p) => {
        if (p.detail) {
          pieces = [...pieces, p.detail];
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
    <PieceViewer
      piece={route.piece}
      on:close={() => (route = { type: Routes.BROWSING })}
    />
  </Route>
{/if}
