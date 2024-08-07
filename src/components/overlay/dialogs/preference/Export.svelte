<script lang="ts">
    import { preferences } from "../../../../stores/preferenceStore";
    import SettingsEntry from "../../../shared/SettingsEntry.svelte";
</script>

<SettingsEntry>
    <label for="indent" slot="key">XML Indentation</label>
    <p slot="description">Indentation to use for the exported XLIFF file</p>
    <div slot="value">
        <input name="indent" type="radio" value={true} bind:group={$preferences.export.useTab}> Use Tab
        <input name="indent" type="radio" value={false} bind:group={$preferences.export.useTab}> Use Space

        {#if !$preferences.export.useTab}
        <br>
        No. of space <input type="number" min=1 size=4 bind:value={$preferences.export.spaceChar}>
        {/if}
    </div>
</SettingsEntry>

<SettingsEntry>
    <label for="ab" slot="key">Exported file name</label>
    <p slot="description">Default filename when exporting via 'Export All'</p>
    <div slot="value">
        <input name="ab" type="text" bind:value={$preferences.export.filename}>.zip
    </div>
</SettingsEntry>