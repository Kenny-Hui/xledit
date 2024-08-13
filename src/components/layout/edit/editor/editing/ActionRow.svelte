<script lang="ts">
    import { ClipboardList, ArrowDown, Globe, Undo } from "lucide-svelte";
    import {
        type Unit,
        type TranslationFile,
    } from "../../../../../../lib/types";
    import { Translators } from "../../../../../utils/types";
    import { copyToClipboard } from "../../../../../utils/util";
    import { preferences } from "../../../../../stores/preferenceStore";
    import IconButton from "../../../../shared/IconButton.svelte";
    import { createEventDispatcher } from "svelte";
    export let unit: Unit;
    export let selectedFile: TranslationFile;
    export let edited: boolean;

    const dispatch = createEventDispatcher();

    function undoChange() {
        dispatch(
            "setTargetText",
            selectedFile.isSource ? unit.source : unit.target.text,
        );
    }

    function openTranslate() {
        let url = Translators[$preferences.editPane.translator].getURL(
            selectedFile.sourceLanguage,
            selectedFile.targetLanguage,
            unit.source.text,
        );
        window.open(url, "_blank", "noopener,noreferrer");
    }
</script>

<div class="toolBox">
    <IconButton
        on:click={() => copyToClipboard(unit.source.text)}
        tooltip="Copy Source"
    >
        <ClipboardList />
    </IconButton>

    <IconButton
        on:click={() => dispatch("setTargetText", unit.source.text)}
        tooltip="Use Source"
    >
        <ArrowDown />
    </IconButton>

    <IconButton on:click={undoChange} disabled={!edited} tooltip="Undo Change">
        <Undo />
    </IconButton>

    {#if selectedFile?.isSource == false}
        <IconButton
            on:click={openTranslate}
            tooltip="Open {Translators[$preferences.editPane.translator].name}"
        >
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
