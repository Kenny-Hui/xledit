<script lang="ts">
    import VertTab from "../../shared/VerticalTab.svelte";
    import Editing from "./Editing.svelte";
    import Export from "./Export.svelte";
    import General from "./Appearance.svelte";

    export let dialogTitle;
    dialogTitle = "Preferences";

    const tabs = [
        {
            name: "General",
            component: General,
        },
        {
            name: "Editing",
            component: Editing,
        },
        {
            name: "Exporting",
            component: Export,
        },
    ];
    let selectedPane = 0;
</script>

<div class="inner">
    <div class="tab">
        <VertTab items={tabs} bind:selectedIndex={selectedPane} />
    </div>
    <div class="pane">
        <svelte:component this={tabs[selectedPane].component} />
    </div>
</div>

<style>
    .inner {
        min-width: 512px;
        height: 16rem;
        display: flex;
    }

    .pane {
        border-left: 4px solid var(--highlight-color);
        flex: 1;
        padding: 0 0.25rem;
        overflow: auto;
    }
</style>
