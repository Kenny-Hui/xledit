<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { copyToClipboard } from "../../../../utils/util";
    import Tooltip from "../../../shared/Tooltip.svelte";
    import { ChevronRight, Copy, CornerUpLeft } from "lucide-svelte";
    import { selectedUnit, selectedFile } from "../../../../stores/data";

    export let suggestion;

    const dispatch = createEventDispatcher();

    function setTargetText(str: string) {
        dispatch("applyTargetText", {
            text: str,
        });
    }

    function jumpToSuggestion(suggestionUnit) {
        $selectedUnit = suggestionUnit.unit;
        $selectedFile = suggestionUnit.lang;
    }
</script>

<div class="entry">
    <div class="percentMatch">
        <div class="percentSquare">
            <span class="percentage">{suggestion.match}%</span>
            <br />match
        </div>
    </div>
    <div class="detail">
        <p class="string" title="Translated string">{suggestion.unit.target}</p>
        <p class="target string" title="Source string">{suggestion.unit.source}</p>
        <p class="source">
            <button class="link-button srcpath"
                class:matchpath={suggestion.unit.getFullPathStr() == $selectedUnit?.getFullPathStr()}
                on:click={() => jumpToSuggestion(suggestion)}>

                {#each suggestion.unit.path as path}
                    {path}
                    <ChevronRight size={14}/>
                {/each}
                {suggestion.unit.id}
            </button>
             &bull;
            <span class="langname">{suggestion.lang.targetLanguage}</span>
        </p>
    </div>
    <div class="action">
        <Tooltip tooltip="Copy">
            <button class="action-button" on:click={() => copyToClipboard(suggestion.unit.target)}>
                <Copy size={18} />
            </button>
        </Tooltip>
        <Tooltip tooltip="Use">
            <button class="action-button" on:click={() => setTargetText(suggestion.unit.target)}>
                <CornerUpLeft size={18} />
            </button>
        </Tooltip>
    </div>
</div>

<style>
    .entry {
        border-bottom: 1px solid var(--border);
        padding: 0.75em;
        display: flex;
        word-break: break-word;
    }

    .action {
        margin-left: auto;
    }

    .percentMatch {
        display: flex;
        align-items: center;
        min-width: 48px;
        font-family: var(--secondary-font-set);
    }

    p {
        color: #444;
        line-height: 1.25;
    }

    .percentMatch {
        font-size: 12px;
        color: #666;
        padding-right: 0.25em;
    }

    .percentage {
        color: var(--highlight-color);
        font-weight: 600;
        font-size: 14px;
    }

    .percentSquare {
        border: 2px solid black;
        border-radius: 4px;
        padding: 4px;
        aspect-ratio: 1/1;
        align-items: center;
    }

    .link-button {
        text-align: left;
        cursor: pointer;
    }

    .link-button:hover {
        text-decoration: underline;
    }

    .detail {
        margin-left: 6px;
    }

    .target {
        font-size: 0.9rem;
        color: #888;
    }

    .source {
        font-size: 0.8rem;
        color: #888;
        margin-top: 8px;
    }

    .string {
        white-space: pre-wrap;
    }

    .srcpath {
        color: var(--highlight-color);
        word-break: break-all;
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
    }

    .matchpath {
        color: var(--color-black);
    }

    .langname {
        white-space: nowrap;
    }

    .action-button {
        display: block;
        background: none;
        border: none;
        outline: transparent 1px;
        cursor: pointer;
        color: #888;
        padding: 0;
        margin-bottom: 4px;
        transition: color 0.2s;
    }

    .action-button:hover {
        color: #000;
    }
</style>
