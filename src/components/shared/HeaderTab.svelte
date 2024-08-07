<script lang="ts">
    import {push, location} from 'svelte-spa-router'
    export let items: any[];

    function onEntrySelected(i: number): void {
        push(items[i].link);
    }
</script>
    
<ul class="header-tab">
    {#each items as item, i}    
        {#if item != null}
            <li>
                <button on:click={() => onEntrySelected(i)} on:keydown={() => onEntrySelected(i)} class:selected={$location == item.link}>
                    {item.name}
                </button>
            </li>
        {/if}
    {/each}
</ul>

<style>
    .header-tab {
        display: flex;
        gap: .75rem;
    }

    button {
        font-weight: 400;
        padding: .5em;
        cursor: pointer;
        text-align: center;
        transition: background-color .1s;
        border-radius: .35rem;
    }

    button:hover:not(.selected) {
        background-color: var(--highlight);
    }

    .selected {
        background: var(--highlight-color);
        color: white;
    }
</style>