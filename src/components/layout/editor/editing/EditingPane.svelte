<script lang="ts">
    import { type Unit, type TranslationFile } from "../../../../../lib/types";
    import { DialogProperty } from "../../../../utils/types";
    import { StickyNote } from 'lucide-svelte';
    import { getUnit } from "../../../../../lib/util";
    import { getDerivedFiles, selectedFile as selectedFileStore, selectedUnit } from "../../../../stores/data";
    import { openDialog } from "../../../../stores/uiStores";
    import Button from "../../../shared/Button.svelte";
    import UnitInfo from "./UnitInfo.svelte";
    import Note from "./Note.svelte";
    import NoteDialog from "../../../overlay/dialogs/NoteDialog.svelte";
    import ActionRow from "./ActionRow.svelte";
    import Context from "./Context.svelte";
    import ContextDialog from "../../../overlay/dialogs/ContextDialog.svelte";
    import { onMount } from "svelte";
    export let selectedFile: TranslationFile;

    let srcElement: Node;
    let targetElement: HTMLElement;
    let edited: boolean;

    export function setTargetText(targetString: string) {
        if(targetElement != null) {
            targetElement.textContent = targetString;
            afterType();
        }
    }1

    function afterType() {
        if($selectedUnit == null) {
            edited = false;
        } else {
            if(selectedFile?.isSource) {
                edited = $selectedUnit.source != targetElement.textContent;
            } else {
                edited = ($selectedUnit.target ?? "") != targetElement.textContent;
            }
        }
        if(targetElement.textContent.length == 0) targetElement.innerHTML = ""; // Clear empty <br> for placeholder
    }

    function save() {
        let newEntry = $selectedUnit;
        if(selectedFile.isSource) {
            // Edit Source
            $selectedUnit.source = targetElement.textContent;

            // Apply to all file
            for(let file of getDerivedFiles(selectedFile)) {
                let targetUnit = getUnit(file.rootGroup, $selectedUnit.getFullPath());
                if(targetUnit == null) continue; // TODO: We should sync the entry to there as well
                targetUnit.source = newEntry.source;
                targetUnit = targetUnit;
            }
        } else {
            $selectedUnit.target = targetElement.textContent;
        }

        $selectedFileStore = $selectedFileStore;
    }

    function selectedEntryChanged(unit: Unit) {
        if(unit == null) {
            setTargetText("");
        } else {
            setTargetText(selectedFile?.isSource ? unit.source : unit.target);
        }
    }

    function addNote() {
        openDialog(new DialogProperty(NoteDialog, {units: getUnits()}, () => {
            $selectedUnit.notes = $selectedUnit.notes;
        }));
    }

    function addContexts() {
        openDialog(new DialogProperty(ContextDialog, {units: getUnits()}, () => {
            $selectedUnit.contextGroups = $selectedUnit.contextGroups;
        }));
    }

    function getUnits() {
        let entries = [];

        for(let file of getDerivedFiles(selectedFile)) {
            let unitInFile = getUnit(file.rootGroup, $selectedUnit.getFullPath());
            if(unitInFile != null) entries.push(unitInFile);
        }

        return entries;
    }

    function removeNote(noteObject: any) {
        $selectedUnit.notes.splice($selectedUnit.notes.indexOf(noteObject), 1);
        $selectedUnit.notes = $selectedUnit.notes;
    }

    function removeContext(contextObject: any) {
        $selectedUnit.contextGroups.splice($selectedUnit.contextGroups.indexOf(contextObject));
        $selectedUnit.contextGroups = $selectedUnit.contextGroups;
    }

    $: selectedEntryChanged($selectedUnit);

    onMount(() => {
        selectedEntryChanged($selectedUnit);
    })
</script>

<div class="editing">
    {#if $selectedUnit != null && $selectedUnit.notes.length > 0}
        <div id="notes">
            {#each $selectedUnit.getNotes() as note}
                <Note on:remove={removeNote} {note}/>
            {/each}
        </div>
    {/if}

    {#if $selectedUnit != null && $selectedUnit.contextGroups.length > 0}
        <div id="contexts">
            {#each $selectedUnit.contextGroups as contextGrp}
                <Context {contextGrp} on:remove={removeContext} />
            {/each}
        </div>
    {/if}

    <div id="src" class="box source-panel">
        <p class="source-string">Source String</p>
        <p bind:this={srcElement}>{$selectedUnit?.source ?? ""}</p>
    </div>

    {#if $selectedUnit != null}
        <ActionRow unit={$selectedUnit} {selectedFile} {srcElement} {edited} on:setTargetText={(e) => setTargetText(e.detail)} />
    {/if}

    <div class="editContainer">
        <div
            class="box editBox"
            spellcheck="true"
            role="textbox"
            tabindex={0}
            bind:this={targetElement}
            class:disabled={$selectedUnit == null}
            placeholder="Enter translated text here..."
            contenteditable={$selectedUnit != null ? "true" : "false"}
            on:keyup={() => afterType()}>
        </div>
        <div class="save-button">
            <Button on:click={save} disabled={$selectedUnit == null || !edited}>
                {selectedFile?.isSource ? "Edit Source" : "Save Changes"}
            </Button>
        </div>
    </div>

    {#if $selectedUnit != null}
        <div class="option">
            <button on:click={addNote}><StickyNote size={16} /> Add Note</button>
            <button on:click={addContexts}><StickyNote size={16} /> Add Contexts</button>
        </div>

        <UnitInfo unit={$selectedUnit}/>
    {/if}
</div>

<style>
    .editing {
        font-size: 15px;
        line-height: 1.5;
    }

    .box {
        position: relative;
        border-top: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        min-height: 150px;
        padding: 1em;
        word-break: break-word;
    }

    .box > * {
        white-space: pre-wrap;
    }

    .editBox {
        padding-bottom: 4em;
        outline: none;
        white-space: pre-wrap;
    }

    .editBox:focus {
        box-shadow: 0 2px 0 var(--highlight-color) inset,
        0 -2px 0 var(--highlight-color) inset;
        border-top: 1px solid transparent;
        border-bottom: 1px solid transparent;
    }

    .source-string {
        font-size: 0.75em;
        color: #AAA;
        text-transform: uppercase;
        padding: 10px 0;
    }
    
    .source-panel {
        background-color: #F4F4F4;
    }

    .editContainer {
        position: relative;
    }

    .save-button {
        position: absolute;
        bottom: 0;
        right: 0;
        margin: 10px;
    }

    .disabled {
        cursor: not-allowed;
    }
    
    .option {
        display: flex;
        flex-wrap: wrap;
    }

    .option > button {
        display: flex;
        gap: 0.25rem;
        justify-content: center;
        cursor: pointer;
        padding: 0.5rem;
        border: 1px solid var(--border);
        color: #555;
        transition: background-color 0.2s;
    }

    .option > button:hover {
        background-color: #DDD;
    }

    [contenteditable=true]:empty:before{
        content: attr(placeholder);
        pointer-events: none;
        display: block; /* For Firefox */
        color: var(--disabled);
    }

    .option > * {
        flex: 1;
    }
</style>