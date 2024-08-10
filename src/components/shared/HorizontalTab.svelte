<script lang="ts">
    export let tabs: any[];
    export let selectedIndex: number;

    function onEntrySelected(i: number): void {
        selectedIndex = i;
    }
</script>
    
<ul class="horizontal-tab">
    {#each tabs as item, i}    
        {#if item != null}
            <li>
                <button on:click={() => onEntrySelected(i)} on:keydown={() => onEntrySelected(i)} class:selected={selectedIndex == i}>
                    <span class="name">
                        {item.name}
                    </span>
                    {#if i != selectedIndex && item.count}
                        <span class="count">{item.count}</span>
                    {/if}
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
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        font-weight: 400;
        border-bottom: 1px solid var(--border);
        cursor: pointer;
        text-align: center;
        gap: 0.25rem;
        transition: background-color .1s;
    }

    .name {
        padding: .75rem 0.25rem;
    }

    button:hover {
        background-color: var(--highlight);
    }

    .selected {
        box-shadow: inset 0px -3px var(--highlight-color);
    }

    .count {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        color: white;
        background-color: var(--highlight-color);
        padding: 0.25rem;
        border-radius: 50px;
        font-size: .75rem;
        width: 12px;
        height: 12px;
        aspect-ratio: 1 / 1;
    }
</style>