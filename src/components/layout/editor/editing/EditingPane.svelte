<script lang="ts">
    import Button from "../../../shared/Button.svelte";
    import UnitInfo from "./UnitInfo.svelte";
    import ActionRow from "./ActionRow.svelte";
    import { type Unit } from "../../../../../lib/types";
    import { getUnit } from "../../../../../lib/util";
    import { getDerivedFiles, selectedFile, selectedFile as selectedFileStore, selectedUnit } from "../../../../stores/data";
    import { onMount } from "svelte";

    let srcElement: Node;
    let targetElement: HTMLElement;
    let edited: boolean;

    export function setTargetText(targetString: string) {
        if(targetElement != null) {
            targetElement.textContent = targetString;
            afterType();
        }
    }

    function afterType() {
        if($selectedUnit == null) {
            edited = false;
        } else {
            if($selectedFile?.isSource) {
                edited = $selectedUnit.source != targetElement.textContent;
            } else {
                edited = ($selectedUnit.target ?? "") != targetElement.textContent;
            }
        }
        if(targetElement.textContent.length == 0) targetElement.innerHTML = ""; // Clear empty <br> for placeholder
    }

    function save() {
        let newEntry = $selectedUnit;
        if($selectedFile.isSource) {
            // Edit Source
            $selectedUnit.source = targetElement.textContent;

            // Apply to all file
            for(let file of getDerivedFiles($selectedFile)) {
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
            setTargetText($selectedFile?.isSource ? unit.source : unit.target);
        }
    }

    $: selectedEntryChanged($selectedUnit);

    onMount(() => {
        selectedEntryChanged($selectedUnit);
    });
</script>

<div class="editing">
    <div id="src" class="box source-panel">
        <p class="source-string">Source String</p>
        <p bind:this={srcElement}>{$selectedUnit?.source ?? ""}</p>
    </div>

    {#if $selectedUnit != null}
        <ActionRow unit={$selectedUnit} selectedFile={$selectedFile} {srcElement} {edited} on:setTargetText={(e) => setTargetText(e.detail)} />
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
                {$selectedFile?.isSource ? "Edit Source" : "Save Changes"}
            </Button>
        </div>
    </div>

    {#if $selectedUnit != null}
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

    [contenteditable=true]:empty:before{
        content: attr(placeholder);
        pointer-events: none;
        display: block; /* For Firefox */
        color: var(--disabled);
    }
</style>