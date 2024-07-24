<script lang="ts">
    import { preferences } from "../../../../stores/preferenceStore";
    import OptionEntry from "../../../shared/OptionEntry.svelte";
</script>

<OptionEntry>
    
    <label for="langSelectName" slot="key">
        Displayed By:
    </label>

    <select name="langSelectName" slot="value" bind:value={$preferences.langSelect.displayName}>
        <option value="name">Language Name</option>
        <option value="filename">File Name</option>
    </select>
</OptionEntry>
<OptionEntry>
    <div slot="key">
        <label for="langSelectMode">
            Displayed Mode: 
        </label>
    </div>
    <div slot="value">
        <select name="langSelectMode" bind:value={$preferences.langSelect.displayMode}>
            <option value="src">Source Language</option>
            <option value="target">Target Language</option>
            <option value="both">Source & Target Language</option>
        </select>
    </div>
</OptionEntry>