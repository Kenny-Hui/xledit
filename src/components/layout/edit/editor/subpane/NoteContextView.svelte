<script lang="ts">
    import {
        getDerivedFiles,
        selectedFile,
        selectedUnit,
    } from "../../../../../stores/data";
    import Note from "../editing/Note.svelte";
    import Context from "../editing/Context.svelte";
    import { StickyNote } from "lucide-svelte";
    import { openDialog } from "../../../../../stores/uiStores";
    import { DialogProperty } from "../../../../../utils/types";
    import NoteDialog from "../../../../dialogs/NoteDialog.svelte";
    import ContextDialog from "../../../../dialogs/ContextDialog.svelte";
    import { getUnit } from "../../../../../../lib/util";

    function addNote() {
        openDialog(
            new DialogProperty(NoteDialog, { units: getUnits() }, () => {
                $selectedUnit.notes = $selectedUnit.notes;
            }),
        );
    }

    function addContexts() {
        openDialog(
            new DialogProperty(ContextDialog, { units: getUnits() }, () => {
                $selectedUnit.contextGroups = $selectedUnit.contextGroups;
            }),
        );
    }

    function getUnits() {
        let entries = [];

        for (let file of getDerivedFiles($selectedFile)) {
            let unitInFile = getUnit(
                file.rootGroup,
                $selectedUnit.getFullPath(),
            );
            if (unitInFile != null) entries.push(unitInFile);
        }

        return entries;
    }

    function removeNote(noteObject: any) {
        $selectedUnit.notes.splice($selectedUnit.notes.indexOf(noteObject), 1);
        $selectedUnit.notes = $selectedUnit.notes;
    }

    function removeContext(contextObject: any) {
        $selectedUnit.contextGroups.splice(
            $selectedUnit.contextGroups.indexOf(contextObject),
        );
        $selectedUnit.contextGroups = $selectedUnit.contextGroups;
    }
</script>

{#if $selectedUnit != null}
    <div class="main">
        {#each $selectedUnit.notes.sort((a, b) => a.priority - b.priority) as note}
            <Note {note} on:remove={removeNote} />
        {/each}

        {#each $selectedUnit.contextGroups as contexts}
            <Context contextGrp={contexts} on:remove={removeContext} />
        {/each}

        <div class="option">
            <button on:click={addNote}
                ><StickyNote size={16} /> Add Note...</button
            >
            <button on:click={addContexts}
                ><StickyNote size={16} /> Add Contexts...</button
            >
        </div>
    </div>
{/if}

<style>
    .main {
        padding: 0.5rem;
    }

    .option {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .option > button {
        display: flex;
        gap: 0.25rem;
        justify-content: center;
        cursor: pointer;
        padding: 0.5rem;
        border: 1px solid var(--border);
        color: #555;
        flex: 1;
        transition: background-color 0.2s;
    }

    .option > button:hover {
        background-color: #ddd;
    }
</style>
