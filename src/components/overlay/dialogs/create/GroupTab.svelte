<script lang="ts">
    import { Group, TranslationFile } from "../../../../../lib/types";
    import { DialogProperty } from "../../../../utils/types";
    import Button from "../../../shared/Button.svelte";
    import OptionEntry from "../../../shared/OptionEntry.svelte";
    import { createGroup } from "../../../../../lib/util";
    import { projects, selectedFile } from "../../../../stores/data";

    export let dialog: DialogProperty;
 
    let group = new Group("", false, dialog.data.path);

    function createNewGroup(event) {
        let fileAffected: TranslationFile[];

        if($selectedFile.isSource) {
            fileAffected = $projects.files.filter(e => e.sourceLanguage == $selectedFile.sourceLanguage);
        } else {
            fileAffected = [$selectedFile];
        }

        group.path.push(group.id); // This is stupid, path should not contain ID, I should get this fixed properly one day
        
        for(let file of fileAffected) {
            createGroup(group, file.rootGroup);
        }

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
        <input id="id" bind:value={group.id}>
    </div>
</OptionEntry>

<OptionEntry>
    <div slot="key">
        {#if $selectedFile.isSource}
            <p class="note">You are creating a group on all files translating from {$selectedFile.sourceLanguage}</p>
        {:else}
            <p class="note">You are creating a group in this file. ({$selectedFile.targetLanguage})<br>Please edit the source file ({$selectedFile.sourceLanguage}) if you wish to apply to all files.</p>
        {/if}
    </div>
</OptionEntry>



<div class="create-btn">
    <Button disabled={group.id.length == 0} on:click={createNewGroup} on:click>Create</Button>
</div>

<style>
    .note {
        font-size: 14px;
        color: #444;
    }
</style>