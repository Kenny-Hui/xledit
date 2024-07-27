<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { DialogProperty } from "../../../utils/types";
    import Button from "../../shared/Button.svelte";   
    import OptionEntry from "../../shared/OptionEntry.svelte";
    import { findGroup, getUnit } from "../../../../lib/util";
    import { getDerivedFiles, selectedFile } from "../../../stores/data";
    export let dialog: DialogProperty;

    const dispatch = createEventDispatcher();

    let newPath = dialog.data.unit.path.join("/");

    export let dialogTitle;
    dialogTitle = "Move Unit";

    function moveUnit(): void {
        let files = getDerivedFiles($selectedFile);
        let unitPath = dialog.data.unit.getFullPath();

        for(let file of files) {
            let unit = getUnit(file.rootGroup, unitPath);
            if(unit == null) continue;
            let oldGrp = findGroup(file.rootGroup, unit.path);
            oldGrp!.units.splice(oldGrp!.units.indexOf(unit), 1);

            unit.path = newPath.split("/");

            let grp = findGroup(file.rootGroup, unit.path);
            grp.addUnit(unit);
        }

        dialog.callback();
        dispatch('close', null);
    }
</script>

<div class="root">
    <OptionEntry>
        <div slot="key">
            <label for="new-path">Move to...</label>
        </div>
        <div slot="value">
            <input id="new-path" type="text" bind:value={newPath}>
        </div>
    </OptionEntry>

    <div class="move-btn">
        <Button disabled={newPath === dialog.data.unit.path.join("/") || findGroup($selectedFile.rootGroup, newPath.split("/")) == null} on:click={moveUnit} on:click>Move</Button>
    </div>
</div>

<style>
    .root {
        min-width: 320px;
    }
</style>