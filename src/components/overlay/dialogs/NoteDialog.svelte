<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { DialogProperty } from "../../../utils/types";
    import { Note, Unit } from "../../../../lib/types";
    import Button from "../../shared/Button.svelte";   
    import NoteComponent from "../../layout/editor/editing/Note.svelte";
    import { preferences } from "../../../stores/preferenceStore";
    export let dialog: DialogProperty;

    const dispatch = createEventDispatcher();

    export let dialogTitle;
    dialogTitle = "Add Note";

    let note = new Note($preferences.editPane.noteAuthor, "Your note here.");

    function addNotes(): void {
        let units: Unit[] = dialog.data?.units;

        for(let unit of units) {
            unit.notes.push(note.clone());
        }
        
        dialog.callback();
        dispatch('close', null);
    }
</script>

<div class="root">
    <NoteComponent {note} embedded={true} />

    <div class="create-btn">
        <Button on:click={addNotes} on:click>Add</Button>
    </div>
</div>

<style>
    .root {
        min-width: 320px;
    }
</style>