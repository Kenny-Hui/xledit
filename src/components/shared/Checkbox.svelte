<script lang="ts">
    import { get } from "svelte/store";
    export let checked = false;
    export let tooltips: string = null;
    import { activeTooltip } from "../../stores/uiStores";
    function onHover(e) {
        if(tooltips != null) {
            if(e === null) {
                let newTooltip = get(activeTooltip);
                if(newTooltip == null) return;
                newTooltip.content = tooltips;
                activeTooltip.set(newTooltip);
            } else {
                activeTooltip.set({
                    content: tooltips,
                    rect: e.srcElement.getBoundingClientRect()
                });
            }
        }
    }

    function onLeave(e) {
        activeTooltip.set(null);
    }

    $: if(tooltips) onHover(null);
</script>

<input class="cb" type="checkbox" bind:checked on:click on:mouseover={onHover} on:focus={onHover} on:mouseleave={onLeave} on:focusout={onLeave}>

<style>
    .cb {
        position: relative;
        appearance: none;
        width: 1.25rem;
        height: 1.25rem;
        border: 2px solid #999;
        background-color: #FFF;
        border-radius: 3px;
        transition: background-color .2s, border .2s;
        margin: 0;
    }

    .cb:before {
        overflow: hidden;
        content: "";
        position: absolute;
        transform: translate(75%, 7%) rotateZ(45deg) scale(0);
        width: 4px;
        height: 9px;
        border-bottom: 2px solid #FFF;
        border-right: 2px solid #FFF;
        transition: transform .2s;
    }

    .cb:checked:before {
        transform: translate(75%, 7%) rotateZ(45deg) scale(1);
    }

    .cb:checked {
        border: none;
        background-color: var(--blue-highlight);
        border: 2px solid transparent;
    }
</style>