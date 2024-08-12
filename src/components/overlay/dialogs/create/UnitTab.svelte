<script lang="ts">
    import { DialogProperty } from "../../../../utils/types";
    import { Unit, TranslationFile } from "../../../../../lib/types";
    import Button from "../../../shared/Button.svelte";
    import OptionEntry from "../../../shared/OptionEntry.svelte";
    import { createUnit } from "../../../../../lib/util";
    import { getDerivedFiles, selectedFile, selectedUnit } from "../../../../stores/data";

    export let dialog: DialogProperty;

    let unit = new Unit("", "", "", dialog.data.path, [], [], [], document.createElement("span").attributes);

    function createNewUnit() {
        let fileAffected: TranslationFile[] = getDerivedFiles($selectedFile);

        for(let file of fileAffected) {
            let newUnit = createUnit(unit, file.rootGroup);
            if($selectedFile === file) $selectedUnit = newUnit;
        }
        
        $selectedFile = $selectedFile;
        dialog.callback();
    }
</script>

<OptionEntry>
    <div slot="key">
        <label for="id">
            ID: 
        </label>
    </div>
    <div slot="value">
        <input id="id" bind:value={unit.id}>
    </div>
</OptionEntry>
<OptionEntry>
    <div slot="key">
        <label for="src-text">
            Source Text: 
        </label>
    </div>
    <div slot="value">
        <textarea id="src-text" bind:value={unit.source}></textarea>
    </div>
</OptionEntry>

<OptionEntry>
    <div slot="key">
        {#if $selectedFile.isSource}
            <p class="note">You are creating a translation on all files translating from {$selectedFile.sourceLanguage}</p>
        {:else}
            <p class="note">You are creating a translation in this file. ({$selectedFile.targetLanguage})<br>Please edit the source file ({$selectedFile.sourceLanguage}) if you wish to apply to all files.           </p>
        {/if}
    </div>
</OptionEntry>



<div class="create-btn">
    <Button disabled={unit.id.length == 0} on:click={createNewUnit} on:click>Create</Button>
</div>

<style>
    input, #src-text {
        box-sizing: border-box;
        resize: vertical;
        width: 100%;
    }

    .note {
        font-size: 14px;
        color: #444;
    }
</style>