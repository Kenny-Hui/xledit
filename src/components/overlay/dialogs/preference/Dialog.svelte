<script lang="ts">
    import { DialogProperty } from "../../../../utils/types";
    import VertTab from "../../../shared/VerticalTab.svelte";
    import Editing from "./Editing.svelte";
    import Export from "./Export.svelte";
    import File from "./File.svelte";

    export let dialogTitle;
    dialogTitle = "Preferences";

    const tabs = [
        {
            name: 'File View',
            component: File
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
    <div>
        <svelte:component this={tabs[selectedPane].component}/>
    </div>
</div>

<style>
    .inner {
        display: grid;
        grid-template-columns: auto 2fr;
        gap: 10px;
    }

    .inner > div:nth-child(1) {
        border-right: 4px solid var(--blue-highlight);
    }
</style>