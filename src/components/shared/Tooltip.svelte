<script lang="ts">
    import { activeTooltip as activeTooltip } from "../../stores/uiStores";

    let { tooltip, children }: { tooltip?: string, children: any } = $props();
    let tooltipElement: HTMLElement = $state();

    function onHover(): void {
        if (tooltip != null && tooltipElement != null) {
            activeTooltip.set({
                content: tooltip,
                rect: tooltipElement.getBoundingClientRect(),
            });
        }
    }

    function onLeave(): void {
        activeTooltip.set(null);
    }
</script>

<div class="tooltip-container" bind:this={tooltipElement} role="tooltip" onmouseenter={onHover} onfocusin={onHover} onmouseleave={onLeave}>
    {@render children()}
</div>

<style>
    .tooltip-container {
        display: inline;
    }
</style>
