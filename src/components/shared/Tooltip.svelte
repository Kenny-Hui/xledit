<script lang="ts">
    import { get } from "svelte/store";
    export let tooltip: string;
    let tooltipElement: HTMLElement;
    import { activeTooltip as activeTooltip } from "../../stores/uiStores";

    function onHover(e): void {
        if(tooltip != null) {
            if(e === null) {
                let newTooltip = get(activeTooltip);
                if(newTooltip == null) return;
                newTooltip.content = tooltip;
                activeTooltip.set(newTooltip);
            } else {
                activeTooltip.set({
                    content: tooltip,
                    rect: tooltipElement.getBoundingClientRect()
                });
            }
        }
    }

    function onLeave(): void {
        activeTooltip.set(null);
    }

    $: if(tooltip) onHover(null);
</script>

<div class="tooltip-container" bind:this={tooltipElement} on:mouseenter={onHover} on:focus={onHover} on:mouseleave={onLeave}>
    <slot />
</div>

<style>
    .tooltip-container {
        display: inline;
    }
</style>