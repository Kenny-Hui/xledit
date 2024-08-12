<script lang="ts">
    import { get } from "svelte/store";
    export let checked = false;
    export let tooltips: string = null;
    import { activeTooltip } from "../../stores/uiStores";
    function onHover(e: any) {
        if (tooltips != null) {
            if (e === null) {
                let newTooltip = get(activeTooltip);
                if (newTooltip == null) return;
                newTooltip.content = tooltips;
                $activeTooltip = newTooltip;
            } else {
                $activeTooltip = {
                    content: tooltips,
                    rect: e.srcElement.getBoundingClientRect(),
                };
            }
        }
    }

    function onLeave() {
        $activeTooltip = null;
    }

    $: if (tooltips) onHover(null);
</script>

<input
    type="checkbox"
    bind:checked
    on:click
    on:mouseover={onHover}
    on:focus={onHover}
    on:mouseleave={onLeave}
    on:focusout={onLeave}
/>

<style>
    input {
        position: relative;
        appearance: none;
        width: 1.25rem;
        height: 1.25rem;
        border: 2px solid #999;
        background-color: #fff;
        border-radius: 3px;
        transition:
            background-color 0.2s,
            border 0.2s;
        margin: 0;
        user-select: none;
    }

    input:before {
        overflow: hidden;
        content: "";
        position: absolute;
        transform: translate(75%, 7%) rotateZ(45deg) scale(0);
        width: 4px;
        height: 9px;
        border-bottom: 2px solid #fff;
        border-right: 2px solid #fff;
        transition: transform 0.2s;
    }

    input:checked:before {
        transform: translate(75%, 7%) rotateZ(45deg) scale(1);
    }

    input:checked {
        border: none;
        background-color: var(--highlight-color);
        border: 2px solid transparent;
    }
</style>
