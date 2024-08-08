<script lang="ts">
  import ProjectComponent from './components/layout/Project.svelte';
  import Header from './components/Header.svelte';
  import UiOverlay from './components/overlay/Overlay.svelte';
  import About from './components/layout/about/About.svelte';
  import BatchOperation from './components/layout/batch/BatchOperations.svelte';
  import Router from 'svelte-spa-router';
  import { preferences } from './stores/preferenceStore';
  import { themes } from './utils/types';

  const tabs = [
      {
          name: "About",
          link: '/'
      },
      {
          name: "Editor",
          link: '/edit'
      },
      {
          name: "Batch Operation",
          link: '/batch'
      }
  ];

  const routes = {
    '/': About,
    '/edit': ProjectComponent,
    '/batch': BatchOperation
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible&family=Noto+Sans+JP&family=Roboto:wght@400;500&display=swap" rel="stylesheet">
</svelte:head>

<div style="--highlight-color: rgba({themes[$preferences.appearance.color]}, 1); --highlight-secondary: rgba({themes[$preferences.appearance.color]}, 0.2)">
  <UiOverlay />
  <Header {tabs} />
  <Router {routes}/>
</div>

<style>
  :global(:root) {
    --background: #FFF;
    --border: #B8B8B8;
    --color-gray: #DDD;
    --highlight: #E2E2E2;
    --disabled: #BBB;
    --green-lime: #007700;
    --color-black: #000000;
    --primary-font-set: "Atkinson Hyperlegible", "Noto Sans TC", "Noto Sans JP", "Noto Sans SC", sans-serif;
    --secondary-font-set: "Roboto", "Noto Sans TC", "Noto Sans JP", "Noto Sans SC", sans-serif;
  }

  :global(a[href]) {
    color: var(--highlight-color);
    text-underline-offset: 0.25rem;
  }

  :global(input, textarea) {
    padding: 0.25rem;
    border: 1px solid var(--border);
    border-radius: 0.25rem;
    margin: 0.1rem 0;
  }
</style>