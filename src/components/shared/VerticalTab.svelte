<script lang="ts">
    let { items, selectedIndex = $bindable() }: { items: any[], selectedIndex?: number } = $props();

    function onEntrySelected(i: number): void {
        selectedIndex = i;
    }
</script>

<div class="vertical-tab">
    <ul>
        {#each items as item, i}
            {#if item != null}
                <li>
                    <button onclick={() => onEntrySelected(i)} class:selected={selectedIndex == i}>
                        {item.name}
                    </button>
                </li>
            {/if}
        {/each}
    </ul>
</div>

<style>
    .vertical-tab {
        margin-left: .5rem;
    }

    button {
        background: none;
        font-size: 1.1rem;
        font-weight: 400;
        text-align: left;
        width: 100%;
        padding: 0.75rem 1.25rem;
        margin: 0.25rem 0;
        border: none;
        border-radius: .5rem 0 0 .5rem;
        cursor: pointer;
        transition: background-color 0.1s;
    }

    button:hover {
        background-color: #eee;
    }

    .selected {
        background-color: var(--highlight-color) !important;
        color: white;
    }
</style>
