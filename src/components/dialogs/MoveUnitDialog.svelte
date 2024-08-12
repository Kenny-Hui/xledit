<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { DialogProperty } from "../../utils/types";
    import Button from "../shared/Button.svelte";
    import OptionEntry from "../shared/OptionEntry.svelte";
    import { findGroup, getUnit } from "../../../lib/util";
    import { getDerivedFiles, selectedFile } from "../../stores/data";
    import { ChevronRight, PlusIcon } from "lucide-svelte";
    import IconButton from "../shared/IconButton.svelte";
    export let dialog: DialogProperty;

    const dispatch = createEventDispatcher();

    let newPath = [...dialog.data.unit.path];

    export let dialogTitle;
    dialogTitle = "Move Unit";

    function moveUnit(): void {
        let files = getDerivedFiles($selectedFile);
        let unitPath = dialog.data.unit.getFullPath();

        for (let file of files) {
            let unit = getUnit(file.rootGroup, unitPath);
            if (unit == null) continue;
            let oldGrp = findGroup(file.rootGroup, unit.path);
            oldGrp!.units.splice(oldGrp!.units.indexOf(unit), 1);

            unit.path = newPath;

            let grp = findGroup(file.rootGroup, unit.path);
            grp.units = [...grp.units, unit];
        }

        dialog.callback();
        dispatch("close", null);
    }

    function stripEmptyPath() {
        newPath = newPath.filter((e) => e.length !== 0);
    }
</script>

<div class="root">
    <OptionEntry>
        <div slot="key">
            <label for="new-path">Move to...</label>
        </div>
        <div class="paths" slot="value">
            {#each newPath as path, i}
                {#if i != 0}
                    <ChevronRight size={18} />
                {/if}
                <input
                    id="new-path"
                    type="text"
                    on:keyup={stripEmptyPath}
                    size={Math.max(1, path.length)}
                    bind:value={path}
                />
            {/each}
            <IconButton
                on:click={() => {
                    newPath = [...newPath, ""];
                }}><PlusIcon size={16} /></IconButton
            >
        </div>
    </OptionEntry>

    <div class="move-btn">
        <Button
            disabled={newPath.join("/") === dialog.data.unit.path.join("/") ||
                findGroup($selectedFile.rootGroup, newPath) == null}
            on:click={moveUnit}
            on:click>Move</Button
        >
    </div>
</div>

<style>
    .root {
        min-width: 320px;
    }

    .paths {
        display: flex;
        align-items: center;
        justify-content: end;
    }
</style>
