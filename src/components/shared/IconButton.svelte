<script lang="ts">
    import Tooltip from "./Tooltip.svelte";

    export let disabled = false;
    export let tooltip: string = null;

</script>

<Tooltip tooltip={tooltip}>
    <button on:click on:focusout disabled={disabled}>
        <slot />
    </button>
</Tooltip>

<style>
    button {
        padding: .3rem;
        transition: background-color .2s;
        border-radius: 4px;
        aspect-ratio: 1 / 1;
        color: #444;
        background-color: transparent;
    }

    button:disabled {
        color: var(--disabled);
        cursor: not-allowed;
    }

    button:hover:not(:disabled) {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.15);
    }

    button > * {
        pointer-events: none;
    }
</style>