<script lang="ts">
    import Listing from "./listing/Listing.svelte";
    import EditingPane from "./editing/EditingPane.svelte";
    import SuggestionPane from "./subpane/Subpane.svelte";
    let editingPane: EditingPane;

    function setTargetText(event) {
        editingPane.setTargetText(event.detail.text);
    }
</script>

<div class="grid-container">
    <div class="browser">
        <Listing />
    </div>
    <div class="editor">
        <EditingPane bind:this={editingPane} />
    </div>
    <div class="suggestion">
        <SuggestionPane on:applyTargetText={setTargetText} />
    </div>
</div>

<style>
    .grid-container {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        grid-auto-rows: 50%;
        border-top: .3rem solid var(--highlight-color);
        border-left: .3rem solid var(--highlight-color);
        border-radius: 0.5rem;
        border-bottom-left-radius: 0;
        box-sizing: border-box;
    }

    .grid-container > div {
        overflow: auto;
        border: 1px solid var(--border);
    }

    .browser, .editor, .suggestion {
        grid-row: span 2;
    }

    @media only screen and (max-width: 1300px) {
        .grid-container {
            grid-template-columns: 3fr 2fr;
        }

        .browser {
            grid-row: span 2;
        }

        .editor,
        .suggestion {
            grid-row: span 1;
        }
    }

    @media only screen and (max-width: 1000px) {
        .grid-container {
            grid-template-columns: 2fr 2fr;
        }

        .browser {
            grid-column: span 2;
            grid-row: span 1;
        }

        .editor,
        .suggestion {
            grid-row: span 1;
        }
    }
</style>
