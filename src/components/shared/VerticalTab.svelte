<script lang="ts">
    export let items = [];
    export let selectedIndex: number;

    function onEntrySelected(i: number) {
        selectedIndex = i;
    }
</script>
    
<div class="vertical-tab">
    <ul>
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
</div>

<style>
    .vertical-tab {
        margin-left: 10px;
    }

    button {
        background: none;
        font-size: 18px;
        font-weight: 400;
        text-align: left;
        width: 100%;
        padding: 10px 20px;
        margin: 5px 0;
        border: none;
        border-radius: 8px 0 0 8px;
        cursor: pointer;
        transition: background-color .1s;
    }

    button:hover {
        background-color: #EEE;
    }

    .selected {
        background-color: var(--blue-highlight) !important;
        color: white;
    }
</style>