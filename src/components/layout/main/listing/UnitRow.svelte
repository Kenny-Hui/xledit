<script lang="ts">
    import type { Unit } from "../../../../../lib/types";
    import { selectedUnits } from '../../../../stores/data';
    import { createEventDispatcher } from "svelte";
    import Tooltip from '../../../shared/Tooltip.svelte';
    export let entry: Unit;
    let container: HTMLElement;

    const dispatch = createEventDispatcher();

    function selectUnit() {
        $selectedUnits = [entry.getFullPathStr()];
        dispatch('handleClick', {entry: entry});
    }
    
    $: thisSelected = $selectedUnits.includes(entry.getFullPathStr());
    $: if(entry != null && thisSelected) selectUnit();
</script>

{#if entry != null}
    <button class="container" bind:this={container} class:active={thisSelected} on:click={selectUnit}>
        <div class="translate-status">
            <Tooltip tooltip="{entry.target == null ? "Not " : ""}Translated">
                <span class="status" class:translated={entry.target != null}></span>
            </Tooltip>
        </div>
        <div class="srctrg">
            {entry.source}
        </div>
        <div class="srctrg">
            {entry.target ?? ""}
        </div>
    </button>
{/if}

<style>
    .container {
        background: none;
        width: 100%;
        font-family: var(--primary-font-set);
        font-size: 16px;
        line-height: 1.5rem;
		display: flex;
        gap: 2rem;
        padding: 1rem;
        border-top: 1px solid #CCC;
        cursor: pointer;
        transition: background-color .1s;
	}

    .srctrg {
        word-break: break-word;
        white-space: pre-wrap;
        flex: 1;
    }

    .translate-status {
        display: flex;
        align-items: center;
    }

    .status {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #999;
        margin: 0;
        padding: 0;
    }

    .status.translated {
        background: var(--blue-highlight);
    }

    .container:hover {
        background: #EEE;
    }

    .active {
        background-color: var(--light-blue) !important;
    }
</style>