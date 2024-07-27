<script lang="ts">
    export let items: any[];
    export let selectedIndex: number;

    function onEntrySelected(i: number): void {
        selectedIndex = i;
    }
</script>
    
<ul class="header-tab">
    {#each items as item, i}    
        {#if item != null}
            <li>
                <button on:click={() => onEntrySelected(i)} on:keydown={() => onEntrySelected(i)} class:selected={selectedIndex == i}>
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
        background: var(--blue-highlight);
        color: white;
    }
</style>