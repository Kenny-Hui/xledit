<script lang="ts">
    import { X } from "lucide-svelte";
    import { closeDialog } from "../../../stores/uiStores";
    import { DialogProperty } from "../../../utils/types";

    export let dialogProperty: DialogProperty;

    let dialogTitle = "";
</script>

<div class="dialog" role="dialog" on:keydown={(e) => {if(e.key === "Escape") closeDialog()}}>
    <div class="header">
        <div class="title">
            <h1>{dialogTitle}</h1>
        </div>
        <button class="close-button" on:click={closeDialog}>
            <X />
        </button>
    </div>
    
    <svelte:component this={dialogProperty.component} bind:dialogTitle dialog={dialogProperty} on:close={closeDialog}></svelte:component>
</div>

<style>
    .dialog {
        padding: 1rem 1.25rem;
        width: max-content;
        background: #FFF;
        border-radius: .5rem;
        box-shadow: 0 0 16px 0px #333;
    }

    h1 {
        font-size: 1.5em;
        margin: .5em 0px;
    }

    .close-button {
        cursor: pointer;
        background: none;
        border: none;
        color: var(--color-black);
        margin: 0;
        padding: 0;
    }

    .header {
        border-bottom: 4px solid var(--highlight-color);
        display: flex;
        justify-content: space-between;
    }
</style>