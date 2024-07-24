<script lang="ts">
    import { preferences } from "../../../../stores/preferenceStore";
</script>

<h1 for="indent">XML Indentation</h1>

<div>   
    <input name="indent" type="radio" value={true} bind:group={$preferences.export.useTab}> Use Tab
    <input name="indent" type="radio" value={false} bind:group={$preferences.export.useTab}> Use Space

    {#if !$preferences.export.useTab}
    <br>
    No. of space <input type="number" min=1 size=4 bind:value={$preferences.export.spaceChar}>
    {/if}
</div>