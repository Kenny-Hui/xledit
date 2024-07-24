<script lang="ts">
    import { preferences } from "../../../../stores/preferenceStore";
    import OptionEntry from "../../../shared/OptionEntry.svelte";

    
</script>

<OptionEntry>
    <div slot="key">
        <label for="translator">
            Translator: 
        </label>
    </div>
    <div slot="value">
        <select name="translator" bind:value={$preferences.editPane.translator}>
            <option value="GOOGLE_TRANSLATE">Google Translate</option>
            <option value="DEEPL_TRANSLATE">DeepL Translate</option>
            <option value="YANDEX_TRANSLATE">Yandex Translate</option>
        </select>
    </div>
</OptionEntry>

<OptionEntry>
    <div slot="key">
        <label for="noteauthor">
            Author Note As: 
        </label>
    </div>
    <div slot="value">
        <input name="noteauthor" type="text" bind:value={$preferences.editPane.noteAuthor} />
    </div>
</OptionEntry>