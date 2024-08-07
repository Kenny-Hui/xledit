<script lang="ts">
    import { ArrowRightToLine, Trash } from "lucide-svelte";
    import type { Unit } from "../../../../../lib/types";
    import { getDerivedFiles, selectedFile, selectedUnit } from '../../../../stores/data';
    import IconButton from "../../../shared/IconButton.svelte";
    import Tooltip from '../../../shared/Tooltip.svelte';
    import { openDialog } from "../../../../stores/uiStores";
    import { DialogProperty } from "../../../../utils/types";
    import MoveUnitDialog from "../../../overlay/dialogs/MoveUnitDialog.svelte";
    import { findGroup } from "../../../../../lib/util";
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
            grp!.units.splice(grp.units.indexOf(unit), 1);
        }
        $selectedFile = $selectedFile;
    }
</script>

<button class="container" class:active={$selectedUnit == unit} on:click={() => $selectedUnit = unit}>
    <div class="translate-status">
        <Tooltip tooltip="{unit.target == null ? "Not " : ""}Translated">
            <span class="status" class:translated={unit.target != ""}></span>
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
        background: none;
        width: 100%;
        font-family: var(--primary-font-set);
        font-size: 16px;
		display: flex;
        align-items: center;
        gap: 2rem;
        padding: 1rem;
        border-top: 1px solid #CCC;
        cursor: pointer;
        transition: background-color .1s;
	}

    .srctrg {
        word-break: break-word;
        white-space: pre-wrap;
        line-height: 1.5rem;
        flex: 1;
    }

    .action-row {
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

    .container .action-row {
        opacity: 0;
    }

    .container:hover .action-row {
        opacity: 1;
    }
</style>