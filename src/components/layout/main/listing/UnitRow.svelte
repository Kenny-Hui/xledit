<script lang="ts">
    import type { Unit } from "../../../../../lib/types";
    import { selectedUnit } from '../../../../stores/data';
    import Tooltip from '../../../shared/Tooltip.svelte';
    export let entry: Unit;
</script>

<button class="container" class:active={$selectedUnit == entry} on:click={() => $selectedUnit = entry}>
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
        align-items: center;
        transition: background-color .1s;
	}

    .srctrg {
        word-break: break-word;
        white-space: pre-wrap;
        flex: 1;
    }

    .translate-status {
        display: flex;
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