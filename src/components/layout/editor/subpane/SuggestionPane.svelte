<script lang="ts">
    import { type TranslationFile, Unit, type Group } from "../../../../../lib/types";
    import { stringSimilarity } from 'string-similarity-js';
    import { forEach } from '../../../../../lib/util';
    import { projects, selectedUnit } from "../../../../stores/data";
    import HorizontalTab from '../../../shared/HorizontalTab.svelte';
    import SuggestionEntry from './SuggestionEntry.svelte';

    export let selectedFile: TranslationFile;
    const SUGGESTION_MATCH_PERCENTAGE = 0.7;

    let lastSelectedUnit: Unit = null;
    let matchedUnit = [];
    let tabs = [
        {
            name: "By Source"
        },
        {
            name: "By Translated"
        }
    ];
    let selectedIndex = 0;
    let findBySource = false;
    let findByTarget = false;


    function findSuggestions() {
        matchedUnit = [];

        if(selectedFile != null && $selectedUnit != null) {
            let targetString = findBySource ? $selectedUnit.source : $selectedUnit.target;
            if(targetString == "") return;

            for(let file of $projects.files) {
                forEach(file.rootGroup, (data: Unit | Group) => {
                    if(data instanceof Unit) {
                        // Unfinished translation are not useful
                        if(data.target == "") return;
                        // No better than unfinished translation, as it's the same source but copied
                        if(data.source == data.target) return;
                        // Everything is same as what is already the case, not useful
                        if(data.source == $selectedUnit.source && data.target == $selectedUnit.target) return;
                        let stringMatchAgainst = findBySource ? data.source : data.target;

                        let matchPercent = stringSimilarity(targetString, stringMatchAgainst);
                        if(matchPercent > SUGGESTION_MATCH_PERCENTAGE) {
                            matchedUnit.push({
                                unit: data,
                                match: Math.round(matchPercent * 100),
                                lang: file
                            });
                            sortSuggestions(matchedUnit);
                            matchedUnit = matchedUnit;
                        }
                    }
                });
            }
            lastSelectedUnit = $selectedUnit;
        }
    }

    function sortSuggestions(arr: any[]) {
        let targetLanguage = selectedFile.targetLanguage ?? selectedFile.sourceLanguage;
        arr.sort((a, b) => {
            let aSamePath = a.unit.getFullPathStr() == $selectedUnit.getFullPathStr() ? 1 : 0;
            let bSamePath = b.unit.getFullPathStr() == $selectedUnit.getFullPathStr() ? 1 : 0;
            let aSameLang = a.lang?.targetLanguage == targetLanguage ? 1 : 0;
            let bSameLang = b.lang?.targetLanguage == targetLanguage ? 1 : 0;
            let aSameLangGroup = a.lang.targetLanguage == null ? 0 : a.lang.targetLanguage.split("-")[0] == targetLanguage.split("-")[0] ? 1 : 0;
            let bSameLangGroup = b.lang.targetLanguage == null ? 0 : b.lang.targetLanguage.split("-")[0] == targetLanguage.split("-")[0] ? 1 : 0;
            return (bSameLang - aSameLang) || (bSameLangGroup - aSameLangGroup) || (bSamePath - aSamePath) || (b.match - a.match);
        });
    }

    $: {
        if(selectedFile != null && $selectedUnit != null) {            
            if(lastSelectedUnit == null || $selectedUnit.getFullPathStr() != lastSelectedUnit.getFullPathStr() || $selectedUnit.target != lastSelectedUnit.target || $selectedUnit.source != lastSelectedUnit.source) {
                findSuggestions();
            }
        }
    }

    $: {
        findBySource = selectedIndex == 0;
        findByTarget = selectedIndex == 1;
        findSuggestions();
    }
</script>

<div class="suggestion">
    <div class="suggestion-tab">
        <HorizontalTab items={tabs} bind:selectedIndex={selectedIndex}/>
    </div>
    
    {#if matchedUnit.length <= 0}
        <p class="no">No suggestion found</p>
    {:else}
        {#each matchedUnit as unit}
            <SuggestionEntry on:applyTargetText suggestion={unit} />
        {/each}
    {/if}
</div>

<style>
    .suggestion {
        font-family: var(--primary-font-set);
    }

    .suggestion-tab {
        text-align: center;
        margin: auto;
    }

    p {
        color: #444;
        line-height: 1.25;
    }

    .no {
        margin: 1em;
        color: var(--disabled);
        text-align: center;
    }
</style>