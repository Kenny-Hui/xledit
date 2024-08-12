<script lang="ts">
    import Tooltip from "./Tooltip.svelte";

    export let link: string;
    export let target: string = "_self";
    export let tooltip: string = null;
</script>

<Tooltip {tooltip}>
    <a class="icon" href={link} {target}>
        <slot />
    </a>
</Tooltip>

<style>
    .icon {
        line-height: 1;
        display: inline-block;
        border: 1px solid transparent;
        padding: 0.25rem;
        transition: background-color 0.2s;
        border-radius: 0.3rem;
        aspect-ratio: 1 / 1;
        color: #444;
        background-color: transparent;
    }

    .icon:hover {
        background-color: rgba(0, 0, 0, 0.15);
    }
</style>
