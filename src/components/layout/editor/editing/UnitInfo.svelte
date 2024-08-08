<script lang="ts">
    import { ChevronRight, Plus, Trash } from "lucide-svelte";
    import type { Unit } from "../../../../../lib/types";
    import IconButton from "../../../shared/IconButton.svelte";
    import { getDerivedFiles, selectedFile } from "../../../../stores/data";
    import { getUnit } from "../../../../../lib/util";
    import AttributeDialog from "../../../overlay/dialogs/AttributeDialog.svelte";
    import { DialogProperty } from "../../../../utils/types";
    import { openDialog } from "../../../../stores/uiStores";
    export let unit: Unit;

    function onPathType(e) {
        let newId = e.srcElement.value;
        let files = getDerivedFiles($selectedFile);
        let oldPath = unit.getFullPath();
        
        for(let file of files) {
            let unitInFile = getUnit(file.rootGroup, oldPath);
            if(unitInFile != null) unitInFile.id = newId;
        }

        unit = unit;
    }

    function removeAttribute(attrName: string) {
        unit.attributes.removeNamedItem(attrName);
        unit = unit;
    }

    function addAttribute() {
        openDialog(new DialogProperty(AttributeDialog, { unit: unit }, () => {
            unit = unit;
		}));
    }
</script>

<div class="unitinfo">
    {#if unit != null}
        <h1>ID</h1>
        <input type="text" on:keyup={onPathType} value={unit.id}>
        <h1>Full Path</h1>
        <p>
            {#each unit.path as path}
                {path}
                <ChevronRight size={14} />
            {/each}
            {unit.id}
        </p>

        {#each unit.attributes as attr}
            {#if attr.name != "id"}
                <h1>{attr.name} <IconButton tooltip="Delete Attribute" on:click={() => removeAttribute(attr.name)}><Trash size={16}/></IconButton></h1>
                <input type="text" bind:value={attr.value}>
            {/if}
        {/each}
        <button on:click={addAttribute}><Plus size={16} /> Add Attribute</button>
    {/if}
</div>

<style>
    .unitinfo {
        font-family: var(--primary-font-set);
        line-height: 1.5;
        font-size: 16px;
        padding: 1em;
        border-top: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        word-break: break-all;
    }

    button {
        display: flex;
        width: 100%;
        justify-content: center;
        border: 1px solid var(--border);
        padding: 0.4rem;
        color: #555;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    button:hover {
        background-color: #DDD;
    }

    h1 {
        font-weight: 500;
    }

    p, input {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        font-family: var(--secondary-font-set);
        border: none;
        padding: 4px 0;
        font-weight: 400;
        font-size: 14px;
        color: #666;
    }

    input {
        width: 100%;
    }

    input:hover {
        outline: 1px solid var(--border);
    }

    input:focus {
        outline: 1px solid gray;
    }
</style>