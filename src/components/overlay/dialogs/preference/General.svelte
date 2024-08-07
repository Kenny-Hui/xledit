<script lang="ts">
    import { preferences } from "../../../../stores/preferenceStore";
    import SettingsEntry from "../../../shared/SettingsEntry.svelte";
</script>

<SettingsEntry>
    <p slot="key">File Pane View</p>
    <p slot="description">Display Configuration for File Pane</p>
    <div slot="value">
        <div class="section">
            <label for="langSelectName">
                Display by: 
            </label>
            <select name="langSelectName" bind:value={$preferences.langSelect.displayName}>
                <option value="name">Language Name</option>
                <option value="filename">File Name</option>
            </select>
        </div>
        
        <div class="section">
            <label for="langSelectMode">
                Display Mode: 
            </label>
            <select name="langSelectMode" bind:value={$preferences.langSelect.displayMode}>
                <option value="src">Source Language</option>
                <option value="target">Target Language</option>
                <option value="both">Source & Target Language</option>
            </select>
        </div>
    </div>
</SettingsEntry>

<style>
    .section {
        padding: 0.25rem 0;
    }
</style>