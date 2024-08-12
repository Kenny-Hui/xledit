<script lang="ts">
    import { preferences } from "../../../stores/preferenceStore";
    import { themes } from "../../../utils/types";
    import SettingsEntry from "../../shared/SettingsEntry.svelte";
</script>

<SettingsEntry>
    <p slot="key">Accent Color</p>
    <p slot="description">The accent color to use for the user interface</p>
    <div class="color-list" slot="value">
        {#each Object.entries(themes) as [key, value]}
            <button
                class="color-pick"
                class:color-picked={$preferences.appearance.color == key}
                title="Accent color {key}"
                on:click={() => ($preferences.appearance.color = key)}
                style="background-color: rgb({value});outline-color: rgb({value})"
            ></button>
        {/each}
    </div>
</SettingsEntry>

<SettingsEntry>
    <p slot="key">File Pane View</p>
    <p slot="description">Display Configuration for File Pane</p>
    <div slot="value">
        <div class="section">
            <label for="langSelectName"> Display by: </label>
            <select
                name="langSelectName"
                bind:value={$preferences.langSelect.displayName}
            >
                <option value="name">Language Name</option>
                <option value="filename">File Name</option>
            </select>
        </div>

        <div class="section">
            <label for="langSelectMode"> Display Mode: </label>
            <select
                name="langSelectMode"
                bind:value={$preferences.langSelect.displayMode}
            >
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

    .color-list {
        display: flex;
        gap: 0.5rem;
    }

    .color-pick {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid var(--background);
    }

    .color-picked {
        outline: 2px solid;
    }
</style>
