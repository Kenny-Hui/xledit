<script lang="ts">
    import { Unit, type Group } from "../../../../../lib/types";
    import { stringSimilarity } from 'string-similarity-js';
    import { forEach } from '../../../../../lib/util';
    import { projects, selectedFile, selectedUnit } from "../../../../stores/data";
    import HorizontalTab from '../../../shared/HorizontalTab.svelte';
    import SuggestionPane from "./SuggestionPane.svelte";
    import NotesPane from "./NoteContextView.svelte";

    const SUGGESTION_MATCH_PERCENTAGE = 0.75;
    let matchedUnit = [];

    let tabs = [
        {
            name: "Suggestions",
            count: 0
        },
        {
            name: "Notes/Contexts",
            count: 0
        }
    ];
    let selectedIndex = 0;

    function findSuggestions() {
        matchedUnit = [];
        tabs[0].count = 0;

        for(let file of $projects.files) {
            forEach(file.rootGroup, (data: Unit | Group) => {
                if(data instanceof Unit) {
                    // Filter our non-translated/copied units.
                    if(data.target.text == "" || data.source.text == data.target.text) return;
                    // Same as our result
                    if(data.source.text == $selectedUnit.source.text && data.target.text == $selectedUnit.target.text) return;

                    let matchPercent = stringSimilarity($selectedUnit.source.text, data.source.text);
                    if(matchPercent > SUGGESTION_MATCH_PERCENTAGE) {
                        if(matchedUnit.filter(e => e.unit == data).length == 0) { // Slight convenient hack to prevent duplicate, since this is async recursion
                            matchedUnit.push({
                                unit: data,
                                match: Math.round(matchPercent * 100),
                                type: "XLEdit",
                                lang: file
                            });
                        }
                        
                        tabs[0].count = matchedUnit.length;
                        sortSuggestions(matchedUnit);
                        matchedUnit = matchedUnit;
                    }
                }
            });
        }

        for(const match of $selectedUnit.matches) {
            matchedUnit.push({
                unit: match,
                match: null,
                type: "Manual",
                lang: $selectedFile
            });
        }
    }

    function sortSuggestions(arr: any[]) {
        let targetLanguage = $selectedFile.targetLanguage ?? $selectedFile.sourceLanguage;

        arr.sort((a, b) => {
            let aType = a.type == "Manual" ? 1 : 0;
            let bType = b.type == "Manual" ? 1 : 0;

            let aSamePath = a.unit instanceof Unit ? a.unit.getFullPathStr() == $selectedUnit.getFullPathStr() ? 1 : 0 : 0;
            let bSamePath = b.unit instanceof Unit ? b.unit.getFullPathStr() == $selectedUnit.getFullPathStr() ? 1 : 0 : 0;

            let aSameLang = a.lang?.targetLanguage == targetLanguage ? 1 : 0;
            let bSameLang = b.lang?.targetLanguage == targetLanguage ? 1 : 0;

            let aSameLangGroup = a.lang.targetLanguage == null ? 0 : a.lang.targetLanguage.split("-")[0] == targetLanguage.split("-")[0] ? 1 : 0;
            let bSameLangGroup = b.lang.targetLanguage == null ? 0 : b.lang.targetLanguage.split("-")[0] == targetLanguage.split("-")[0] ? 1 : 0;

            return (bType - aType) || (bSameLang - aSameLang) || (bSameLangGroup - aSameLangGroup) || (bSamePath - aSamePath) || (b.match - a.match);
        });
    }

    $: {
        if($selectedFile != null && $selectedUnit != null) {            
            findSuggestions();
            tabs[1].count = ($selectedUnit.notes.length) + ($selectedUnit.contextGroups.length)
        } else {
            tabs[0].count = 0;
            tabs[1].count = 0;
        }
    }
</script>

<div class="suggestion">
    <div class="suggestion-tab">
        <HorizontalTab bind:tabs bind:selectedIndex/>
    </div>
    <div class="content">
        {#if selectedIndex == 0}
            <SuggestionPane on:applyTargetText {matchedUnit} />
        {/if}
        {#if selectedIndex == 1}
            <NotesPane />
        {/if}
    </div>
</div>

<style>
    .suggestion {
        font-family: var(--primary-font-set);
    }

    .suggestion-tab {
        text-align: center;
        margin: auto;
        position: sticky;
        top: 0;
        background-color: var(--background);
    }
</style>