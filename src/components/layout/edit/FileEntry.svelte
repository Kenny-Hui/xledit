<script lang="ts">
    import { Group, Unit, type TranslationFile } from "../../../../lib/types";
    import { shortHandedLang } from "../../../utils/types";
    import { preferences } from "../../../stores/preferenceStore";
    import { ArrowRight } from "lucide-svelte";
    import { projects, selectedFile, selectedUnit } from "../../../stores/data";
    import { forEachBlocking, getUnit } from "../../../../lib/util";
    import Tooltip from "../../shared/Tooltip.svelte";
    import { onMount } from "svelte";

    export let file: TranslationFile;
    $: canShowSource =
        $preferences.langSelect.displayMode == "src" ||
        $preferences.langSelect.displayMode == "both";
    $: canShowTarget =
        $preferences.langSelect.displayMode == "target" ||
        $preferences.langSelect.displayMode == "both";
    $: displayFileName = $preferences.langSelect.displayName;

    function select() {
        $selectedFile = file;
        if ($selectedUnit != null) {
            $selectedUnit = getUnit(
                file.rootGroup,
                $selectedUnit.getFullPath(),
            );
        }
    }

    function getLangName(nameType: string, langCode: string) {
        if (nameType == "filename") {
            let srcFile = $projects.files.filter(
                (e) => (e.targetLanguage ?? e.sourceLanguage) == langCode,
            );
            if (srcFile.length > 0) {
                return srcFile[0].filename;
            } else {
                return langCode;
            }
        } else {
            if (shortHandedLang[langCode.toLowerCase()] != null) {
                return shortHandedLang[langCode.toLowerCase()];
            }

            const languageNames = new Intl.DisplayNames([langCode], {
                type: "language",
                fallback: "code",
                languageDisplay: "standard",
            });
            let res = languageNames.of(langCode);
            return shortHandedLang[res] ?? res;
        }
    }

    let translatedUnit = 0;
    let totalUnit = 0;

    function checkTranslatedUnits() {
        totalUnit = 0;
        translatedUnit = 0;

        forEachBlocking(file.rootGroup, (data: Unit | Group) => {
            if (data instanceof Unit) {
                totalUnit++;
                if (file.isSource || data.target.text != "") translatedUnit++;
            }
        });
    }

    $: if ($selectedFile && file) checkTranslatedUnits();

    let btn;

    onMount(() => {
        if ($selectedFile === file) btn.scrollIntoView(false); // Ensure visible
    });
</script>

<button
    bind:this={btn}
    on:click={() => select()}
    on:keydown={() => select()}
    class:selected={$selectedFile === file}
>
    <div>
        {#if canShowSource}
            {getLangName(displayFileName, file.sourceLanguage)}
        {/if}

        {#if canShowSource && canShowTarget && !file.isSource}
            <div class="arrow"><ArrowRight /></div>
        {/if}

        {#if file.isSource}
            <span class="source">source</span>
        {:else if canShowTarget}
            {getLangName(displayFileName, file.targetLanguage)}
        {/if}
    </div>

    <div class="progress">
        <div class="progress-bar-wrapper">
            <div class="progress-bar-total"></div>
            <div
                class="progress-bar"
                class:selected={$selectedFile === file}
                style="width:{(translatedUnit / totalUnit) * 100}%;"
            ></div>
        </div>
        <div class="progress-percent">
            <Tooltip tooltip={`${translatedUnit}/${totalUnit}`}>
                <p>{Math.floor((translatedUnit / totalUnit) * 100)}%</p>
            </Tooltip>
        </div>
    </div>
</button>

<style>
    button {
        font-size: 18px;
        width: 100%;
        padding: 0.5em 1em;
        margin: 0.25rem 0;
        border-radius: 10px 0 0 10px;
        cursor: pointer;
        transition: background-color 0.1s;
    }

    button:hover {
        background-color: #eee;
    }

    .arrow {
        display: inline-block;
        vertical-align: middle;
    }

    button.selected {
        background-color: var(--highlight-color) !important;
        color: white;
    }

    .source {
        display: inline-block;
        box-sizing: content-box;
        background-color: #00aa00;
        color: white;
        padding: 4px 8px;
        border-radius: 99px;
    }

    .progress-bar-wrapper {
        position: relative;
        align-items: center;
        width: 100%;
        height: 3px;
    }

    .progress-bar-total {
        position: absolute;
        background: rgba(200, 200, 200, 0.5);
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50px;
    }

    .progress-bar {
        position: absolute;
        background-color: var(--highlight-color);
        top: 0;
        left: 0;
        height: 100%;
        border-radius: 50px;
    }

    .progress-bar.selected {
        background-color: #fff;
    }

    .progress {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .progress-percent {
        font-size: 14px;
        padding-left: 0.5em;
    }
</style>
