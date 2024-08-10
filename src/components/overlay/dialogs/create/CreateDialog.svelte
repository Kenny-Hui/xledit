<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import UnitTab from "./UnitTab.svelte";
    import HorizontalTab from "../../../shared/HorizontalTab.svelte";
    import GroupTab from "./GroupTab.svelte";
    import { DialogProperty } from "../../../../utils/types";

    export let dialogTitle;
    dialogTitle = "Create";

    export let dialog: DialogProperty;

    const tabs = [
        {
            name: 'Translation',
            component: UnitTab
        },
        {
            name: 'Group',
            component: GroupTab
        }
    ];

    const dispatch = createEventDispatcher();
    let selectedPane = 0;

    function closeDialog(event) {
        dispatch('close', event.detail);
    }
</script>

<div class="inner">
    <div>
        <HorizontalTab tabs={tabs} bind:selectedIndex={selectedPane}/>
    </div>
    <div>
        <svelte:component on:click={closeDialog} this={tabs[selectedPane].component} {dialog}/>
    </div>
</div>

<style>
    .inner {
        padding: 10px;
        gap: 10px;
    }
</style>