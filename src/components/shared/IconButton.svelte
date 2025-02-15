<script lang="ts">
    import Tooltip from "./Tooltip.svelte";
    let { disabled = false, tooltip = null, onclick, onfocusout, children }: { disabled?: boolean, tooltip?: string, onclick: any, onfocusout?: any, children: any } = $props();
</script>

<Tooltip {tooltip}>
    <button {onclick} {onfocusout} {disabled}>
        {@render children()}
    </button>
</Tooltip>

<style>
    button {
        padding: 0.3rem;
        transition: background-color 0.2s;
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
