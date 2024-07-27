<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { DialogProperty } from "../../../utils/types";
    import { Context, ContextGroup, ContextGroupPurpose, ContextType, Unit } from "../../../../lib/types";
    import Button from "../../shared/Button.svelte";   
    import ContextComponent from "../../layout/editor/editing/Context.svelte";
    export let dialog: DialogProperty;

    export let dialogTitle;
    dialogTitle = "Add Contexts";

    const dispatch = createEventDispatcher();

    let contextGroup = new ContextGroup(ContextGroupPurpose.information, [new Context("Your Context Here", ContextType.database)]);

    function addContexts(): void {
        let units: Unit[] = dialog.data?.units;

        for(let unit of units) {
            unit.contextGroups.push(contextGroup.clone());
        }
        
        dialog.callback();
        dispatch('close', null);
    }
</script>

<div class="root">
    <ContextComponent contextGrp={contextGroup} embedded={true} />

    <div class="create-btn">
        <Button on:click={addContexts} on:click>Add</Button>
    </div>
</div>

<style>
    .root {
        min-width: 320px;
    }
</style>