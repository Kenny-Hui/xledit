<script lang="ts">
  import ProjectComponent from './components/layout/Project.svelte';
  import Header from './components/Header.svelte';
  import UiOverlay from './components/overlay/Overlay.svelte';
  import About from './components/layout/about/About.svelte';
  import BatchOperation from './components/layout/batch/BatchOperations.svelte';
  import Router from 'svelte-spa-router';
    import { preferences } from './stores/preferenceStore';

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

  const themes = {
    blue: "0, 119, 221",
    purple: "130, 71, 190",
    pink: "180, 60, 180"
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible&family=Noto+Sans+JP&family=Roboto:wght@400;500&display=swap" rel="stylesheet">
</svelte:head>

<div style="--highlight-color: rgba({themes[$preferences.appearance.color]}, 1); --highlight-secondary: rgba({themes[$preferences.appearance.color]}, 0.2)">
  <UiOverlay />
  <Header {tabs} {themes} />
  <Router {routes}/>
</div>