<script lang="ts">
    export let items: any[];
    export let selectedIndex: number;

    function onEntrySelected(i: number): void {
        selectedIndex = i;
    }
</script>
    
<ul class="horizontal-tab">
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
    .horizontal-tab {
        display: flex;
    }

    .horizontal-tab li {
        flex: 1;
    }

    button {
        width: 100%;
        font-weight: 400;
        padding: .75em;
        border-bottom: 1px solid var(--border);
        cursor: pointer;
        text-align: center;
        transition: background-color .1s;
    }

    button:hover {
        background-color: var(--highlight);
    }

    .selected {
        box-shadow: inset 0px -3px var(--highlight-color);
    }
</style>