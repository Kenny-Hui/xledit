<script lang="ts">
    import { get } from "svelte/store";
    import Button from "../../shared/Button.svelte";
    import { projects } from "../../../stores/data";
    import { Unit, type Group } from "../../../../lib/types";
    import { addToast } from "../../../stores/uiStores";
    import { forEachBlocking } from "../../../../lib/util";
    import { BookA, Play } from "lucide-svelte";

    let deleteEntry = false;
    let prefix = "";
    let suffix = "";

    let replaceSrc = true;
    let replaceTrg = true;

    let replaceFrom = "";
    let replaceTo = "";
    
    function removeDuplicatedAction() {
        let removedElements = 0;
        for(let file of get(projects).files) {
            removedElements += removeDuplicated(file.rootGroup);
            file = file;
        }

        addToast(`${deleteEntry ? "Deleted" : "Renamed"} ${removedElements} units in ${get(projects).files.length} files.`, "success", 4000);
    }

    function removeDuplicated(grp: Group): number {
        let i = 0;
        for(let subgroup of grp.groups) {
            i += removeDuplicated(subgroup);
        }

        let unitIds = [];
        for(let unit of grp.units) {
            if(unitIds.includes(unit.id)) {
                if(!deleteEntry) {
                    unit.id = `${prefix}${unit.id}${suffix}`;
                } else {
                    grp.units.splice(grp.units.indexOf(unit), 1);
                }
                i++;
            } else {
                unitIds.push(unit.id);
            }
        }
        return i;
    }

    function replaceAction() {
        for(let file of $projects.files) {
            forEachBlocking(file.rootGroup, unit => {
                if(unit instanceof Unit) {
                    if(replaceSrc) {
                        unit.source = unit.source.replaceAll(replaceFrom, replaceTo);
                    }
                    if(replaceTrg && unit.target != null) {
                        unit.target = unit.target.replaceAll(replaceFrom, replaceTo);
                    }
                }
            });
        }
        addToast(`Replaced all instances of '${replaceFrom}' to '${replaceTo}'`, "success", 4000);
    }
</script>

<main>
    <div>
        <h1>Batch Operations</h1>
        <hr>
        <h2>Duplicated Unit ID</h2>
        <input id="a" type="radio" value={true} bind:group={deleteEntry} name="dupm">
        <label for="a">Delete entry</label>
        
        <input id="b" type="radio" value={false} bind:group={deleteEntry} name="dupm">
        <label for="b">Rename entry ID</label>
        
        {#if !deleteEntry}
            <div>
                <input bind:value={prefix} placeholder="Prefix">
                <br>
                <input bind:value={suffix} placeholder="Suffix">
            </div>
        {/if}
        <Button disabled={!deleteEntry && prefix.length == 0 && suffix.length == 0} on:click={removeDuplicatedAction}><Play size={16}/>Perform</Button>
    </div>
    <div>
        <h2>Replace Text</h2>
        <input id="c" type="checkbox" bind:checked={replaceSrc}>
        <label for="c">Source Text</label>
        
        <input id="d" type="checkbox" bind:checked={replaceTrg}>
        <label for="d">Target Text</label>

        <div>
            <input bind:value={replaceFrom} placeholder="From">
            <br>
            <input bind:value={replaceTo} placeholder="To">
        </div>
        <Button disabled={(!replaceSrc && !replaceTrg) || replaceFrom.length == 0} on:click={replaceAction}><BookA size={16} />Replace</Button>
    </div>
</main>

<style>
    main {
        width: 1024px;
        max-width: 100%;
        margin: 2rem auto;
    }

    h1 {
        font-size: 2rem;
        margin: 1rem 0;
    }

    h2 {
        font-size: 1.5rem;
        margin: 1rem 0;
    }
</style>