<script lang="ts">
    import SuggestionEntry from './SuggestionEntry.svelte';
    export let matchedUnit = [];
</script>

{#if matchedUnit.length <= 0}
    <p class="no">No suggestion found</p>
{:else}
    {#each matchedUnit as unit}
        <SuggestionEntry on:applyTargetText suggestion={unit} />
    {/each}
{/if}

<style>
    p {
        color: #444;
        line-height: 1.25;
    }

    .no {
        margin: 1em;
        color: var(--disabled);
        text-align: center;
    }
</style>