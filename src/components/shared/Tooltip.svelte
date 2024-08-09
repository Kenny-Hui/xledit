<script lang="ts">
    import { get } from "svelte/store";
    export let tooltip: string;
    let tooltipElement: HTMLElement;
    import { activeTooltip as activeTooltip } from "../../stores/uiStores";

    function onHover(e): void {
        if(tooltip != null && tooltipElement != null) {
            activeTooltip.set({
                content: tooltip,
                rect: tooltipElement.getBoundingClientRect()
            });
        }
    }

    function onLeave(): void {
        activeTooltip.set(null);
    }
</script>

<div class="tooltip-container" bind:this={tooltipElement} on:mouseenter={onHover} on:focusin={onHover} on:mouseleave={onLeave}>
    <slot />
</div>

<style>
    .tooltip-container {
        display: inline;
    }
</style>