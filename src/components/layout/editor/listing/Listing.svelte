<script lang="ts">
  import { Filter, Search } from 'lucide-svelte';
  import { selectedFile } from '../../../../stores/data';
  import Group from './GroupRow.svelte';
  import type { SearchQuery } from '../../../../utils/types';
  import IconButton from '../../../shared/IconButton.svelte';

  let searchQuery: SearchQuery = {
    searchTerm: "",
    showTranslated: true,
    showUntranslated: true,
    showNumericOnly: true
  };

  let visible = false;
</script>

<div class="root">
  {#if $selectedFile != null}  
    <div class="searchbox">
      <div class="search-icon">
        <Search size={20} />
      </div>
      <input placeholder="Search Here..." type="text" bind:value={searchQuery.searchTerm}>
      <div class="filter-icon">
        <IconButton tooltip="Filter..." on:click={() => visible = !visible}><Filter color={(!searchQuery.showTranslated || !searchQuery.showUntranslated || !searchQuery.showNumericOnly) ? "#005FAA" : "#000"} size={20} /></IconButton>
        {#if visible}
          <div class="filter-popmenu" on:focusout={() => visible = false}>
            <p>Search Filter...</p>
            <input type="checkbox" bind:checked={searchQuery.showTranslated}>Show Translated String
            <br>
            <input type="checkbox" bind:checked={searchQuery.showUntranslated}>Show Untranslated String
            <br>
            <input type="checkbox" bind:checked={searchQuery.showNumericOnly}>Show Numeric-Only String
          </div>
        {/if}
      </div>
    </div>
    <Group {searchQuery} bind:group={$selectedFile.rootGroup} />
  {/if}
</div>

<style>
  .filter-icon {
    position: relative;
  }

  .filter-popmenu {
    position: absolute;
    top: 100%;
    right: 0;
    line-height: 1.5;
    margin-top: 0.25rem;
    background-color: var(--background);
    box-shadow: 0 0 6px black;
    border-radius: 8px;
    padding: 0.5rem;
    width: max-content;
  }

  .searchbox {
    position: sticky;
    top: 0;
    display: flex;
    width: 100%;
    padding: .25rem;
    align-items: center;
    box-sizing: border-box;
    gap: 8px;
    background: var(--background);
    border: 1px solid var(--border);
    z-index: 1;
  }

  .searchbox > input {
    border: 0;
    flex: 1;
    padding: .4rem;
    font-size: 16px;
    color: #666;
  }

  .search-icon {
    margin: .5rem;
  }
</style>