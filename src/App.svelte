<script lang="ts">
  import { preferences } from "./stores/preferenceStore";
  import { themes } from "./utils/types";
  import ProjectComponent from "./components/layout/edit/Project.svelte";
  import Header from "./components/Header.svelte";
  import UiOverlay from "./components/Overlay.svelte";
  import About from "./components/layout/about/About.svelte";
  import BatchOperation from "./components/layout/batch/BatchOperations.svelte";
  import Router from "svelte-spa-router";

  const tabs = [
    {
      name: "About",
      link: "/",
    },
    {
      name: "Editor",
      link: "/edit",
    },
    {
      name: "Batch Operation",
      link: "/batch",
    },
  ];

  const routes = {
    "/": About,
    "/edit": ProjectComponent,
    "/batch": BatchOperation,
  };
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible&family=Noto+Sans+JP&family=Roboto:wght@400;500&display=swap" rel="stylesheet"/>
</svelte:head>

<div style="--highlight-color: rgba({themes[$preferences.appearance.color]}, 1); --highlight-secondary: rgba({themes[$preferences.appearance.color]}, 0.2)">
  <UiOverlay />
  <Header {tabs} />
  <div class="router">
    <Router {routes} />
  </div>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100vh;
  }

  .router {
    flex: 1;
    overflow: auto;
  }

  :global(:root) {
    --background: #fff;
    --border: #b8b8b8;
    --color-gray: #ddd;
    --highlight: #e2e2e2;
    --disabled: #bbb;
    --green-lime: #007700;
    --color-black: #000000;
    --primary-font-set: "Atkinson Hyperlegible", "Noto Sans TC", "Noto Sans JP",
      "Noto Sans SC", sans-serif;
    --secondary-font-set: "Roboto", "Noto Sans TC", "Noto Sans JP",
      "Noto Sans SC", sans-serif;
  }

  :global(a[href]) {
    color: var(--highlight-color);
    text-underline-offset: 0.25rem;
  }

  :global(input, textarea, select) {
    font-family: inherit;
    font-size: .9rem;
    padding: 0.25rem;
    border: 1px solid var(--border);
    border-radius: 0.25rem;
    margin: 0.1rem 0;
  }
</style>
