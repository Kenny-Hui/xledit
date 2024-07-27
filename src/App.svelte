<script lang="ts">
  import ProjectComponent from './components/layout/Project.svelte';
  import Header from './components/Header.svelte';
  import UiOverlay from './components/overlay/Overlay.svelte';
  import About from './components/layout/about/About.svelte';
  import { states } from './stores/preferenceStore';

  const tabs = [
      {
          name: "About",
          component: About
      },
      {
          name: "Editor",
          component: ProjectComponent,
      },
      {
          name: "Tools",
          component: About
      }
  ];
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible&family=Noto+Sans+JP&family=Roboto:wght@400;500&display=swap" rel="stylesheet">
</svelte:head>
  
<UiOverlay />
<Header bind:selectedTab={$states.selectedTab} />

<svelte:component this={tabs[$states.selectedTab].component} />