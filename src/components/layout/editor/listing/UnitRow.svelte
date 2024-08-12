<script lang="ts">
    import { ArrowRightToLine, Trash } from "lucide-svelte";
    import type { Unit } from "../../../../../lib/types";
    import { getDerivedFiles, projects, selectedFile, selectedUnit } from '../../../../stores/data';
    import IconButton from "../../../shared/IconButton.svelte";
    import Tooltip from '../../../shared/Tooltip.svelte';
    import { openDialog } from "../../../../stores/uiStores";
    import { DialogProperty } from "../../../../utils/types";
    import MoveUnitDialog from "../../../overlay/dialogs/MoveUnitDialog.svelte";
    import { findGroup, getUnit } from "../../../../../lib/util";
    import { onMount } from "svelte";
    export let unit: Unit;

    function openMoveDialog() {
        openDialog(new DialogProperty(MoveUnitDialog, {unit: unit}, () => {
            $selectedFile = $selectedFile;
        }));
    }

    function removeUnit() {
        let files = getDerivedFiles($selectedFile);

        for(let file of files) {
            let grp = findGroup(file.rootGroup, unit.path);
            let fileUnit = getUnit(file.rootGroup, unit.getFullPath());
            grp!.units.splice(grp.units.indexOf(fileUnit), 1);
        }

        if($selectedUnit == unit) {
            $selectedUnit = null;
        }
        $selectedFile = $selectedFile;
    }

    let btn;

    onMount(() => {
        if($selectedUnit === unit) btn.scrollIntoView(false);  // Ensure visible
    });
</script>

<button bind:this={btn} class="container" class:active={$selectedUnit == unit} on:click={() => $selectedUnit = unit}>
    <div class="translate-status">
        <Tooltip tooltip="{unit.getTranslationStatus().text}">
            <span class="status" style="background-color:{unit.getTranslationStatus().color}"></span>
        </Tooltip>
    </div>
    <div class="srctrg">
        {unit.source}
    </div>
    <div class="srctrg">
        {unit.target ?? ""}
    </div>
    <div class="action-row">
        <IconButton tooltip="Delete Unit" on:click={removeUnit}><Trash color="red" size={20}/></IconButton>
        <IconButton tooltip="Move..." on:click={openMoveDialog}><ArrowRightToLine size={20}/></IconButton>
    </div>
</button>

<style>
    .container {
        width: 100%;
        font-family: var(--primary-font-set);
        font-size: 16px;
		display: flex;
        gap: 2rem;
        padding: 0 1rem;
        border-top: 1px solid #CCC;
        cursor: pointer;
        background: none;
        transition: background-color .1s;
	}

    .srctrg {
        word-break: break-word;
        white-space: pre-wrap;
        line-height: 1.5rem;
        padding: 1rem;
        flex: 1;
    }

    .translate-status, .action-row {
        display: flex;
        align-items: center;
    }

    .status {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin: 0;
        padding: 0;
    }

    .container:hover {
        background: #EEE;
    }

    .active {
        background-color: var(--highlight-secondary) !important;
    }

    .container .action-row {
        opacity: 0;
    }

    .container:hover .action-row {
        opacity: 1;
    }
</style>