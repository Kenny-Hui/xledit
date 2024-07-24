<script lang="ts">
    import { type Unit, type TranslationFile } from "../../../../../lib/types";
    import { Translators } from "../../../../utils/types";
    import { ClipboardList, ArrowDown, Globe, Undo } from 'lucide-svelte';
    import { copyToClipboard } from "../../../../utils/util";
    import { preferences } from "../../../../stores/preferenceStore";
    import IconButton from "../../../shared/IconButton.svelte";
    import { createEventDispatcher } from "svelte";
    export let unit: Unit;
    export let selectedFile: TranslationFile;
    export let srcElement: Node;
    export let edited: boolean;

    const dispatch = createEventDispatcher();

    function undoChange() {
        dispatch('setTargetText', selectedFile.isSource ? unit.source : unit.target)
    }

    function openTranslate() {
        if(srcElement) {
            let url = Translators[$preferences.editPane.translator].getURL(selectedFile.sourceLanguage, selectedFile.targetLanguage, srcElement?.textContent);
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }
</script>

<div class="toolBox">
    <IconButton on:click={() => copyToClipboard(srcElement?.textContent)} tooltip="Copy Source">
        <ClipboardList />
    </IconButton>

    <IconButton on:click={() => dispatch('setTargetText', unit.source)} tooltip="Use Source">
        <ArrowDown />
    </IconButton>

    <IconButton on:click={undoChange} disabled={!edited} tooltip="Undo Change">
        <Undo />
    </IconButton>

    {#if selectedFile?.isSource == false}
        <IconButton on:click={openTranslate} tooltip="Open {Translators[$preferences.editPane.translator].name}">
            <Globe />
        </IconButton>
    {/if}
</div>

<style>
    .toolBox {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin: 2px;
    }
</style>