<script lang="ts">
  import { Piece } from "./proto/local/data_pb";

  import PieceBrowser from "./screens/PieceBrowser.svelte";
  import PieceEditor from "./screens/PieceEditor.svelte";
  import PieceViewer from "./screens/PieceViewer.svelte";
  import AddButton from "./components/AddButton.svelte";
  import Route from "./components/Route.svelte";

  import { pieces } from "./store/pieces";

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
    <PieceViewer
      piece={route.piece}
      on:close={() => (route = { type: Routes.BROWSING })}
    />
  </Route>
{/if}
