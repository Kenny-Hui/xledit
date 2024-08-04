<script lang="ts">
    import { get } from "svelte/store";
    import Button from "../../shared/Button.svelte";
    import { projects } from "../../../stores/data";
    import type { Group } from "../../../../lib/types";
    import { addToast } from "../../../stores/uiStores";

    let deleteEntry = false;

    let prefix = "";
    let suffix = "";
    
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
</script>

<main>
    <h1>Batch Operations</h1>
    <hr>
    <h2>Duplicated Unit ID</h2>
    <input id="a" type="radio" value={true} bind:group={deleteEntry} name="dupm">
    <label for="a">Delete entry</label>
    
    <input id="b" type="radio" value={false} bind:group={deleteEntry} name="dupm">
    <label for="b">Rename entry</label>
    
    {#if !deleteEntry}
        <div>
            <input bind:value={prefix} placeholder="Prefix">
            <br>
            <input bind:value={suffix} placeholder="Suffix">
        </div>
    {/if}
    <Button on:click={removeDuplicatedAction}>Perform</Button>
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