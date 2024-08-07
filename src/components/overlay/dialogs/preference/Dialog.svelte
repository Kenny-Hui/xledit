<script lang="ts">
    import VertTab from "../../../shared/VerticalTab.svelte";
    import Editing from "./Editing.svelte";
    import Export from "./Export.svelte";
    import General from "./General.svelte";

    export let dialogTitle;
    dialogTitle = "Preferences";

    const tabs = [
        {
            name: 'General',
            component: General
        },
        {
            name: 'Editing',
            component: Editing
        },
        {
            name: 'Exporting',
            component: Export
        }
    ];
    let selectedPane = 0;
</script>

<div class="inner">
    <div>
        <VertTab items={tabs} bind:selectedIndex={selectedPane}/>
    </div>
    <div class="pane">
        <svelte:component this={tabs[selectedPane].component}/>
    </div>
</div>

<style>
    .inner {
        width: 500px;
        height: 240px;
        display: grid;
        grid-template-columns: auto 2fr;
        gap: 10px;
    }

    .inner > div:nth-child(1) {
        border-right: 4px solid var(--blue-highlight);
    }

    .pane {
        overflow: auto;
    }
</style>