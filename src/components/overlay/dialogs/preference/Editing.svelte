<script lang="ts">
    import { preferences } from "../../../../stores/preferenceStore";
    import OptionEntry from "../../../shared/OptionEntry.svelte";
    import SettingsEntry from "../../../shared/SettingsEntry.svelte";

    
</script>

<SettingsEntry>
    <label for="translator" slot="key">Translator</label>
    <p slot="description">Translator to open in the Editing Pane</p>
    <div slot="value">
        <select name="translator" bind:value={$preferences.editPane.translator}>
            <option value="GOOGLE_TRANSLATE">Google Translate</option>
            <option value="DEEPL_TRANSLATE">DeepL Translate</option>
            <option value="YANDEX_TRANSLATE">Yandex Translate</option>
        </select>
    </div>
</SettingsEntry>

<SettingsEntry>
    <label for="noteauthor" slot="key">Note Author</label>
    <p slot="description">Name to use when creating a new translation note</p>
    <div slot="value">
        <input name="noteauthor" type="text" bind:value={$preferences.editPane.noteAuthor} />
    </div>
</SettingsEntry>