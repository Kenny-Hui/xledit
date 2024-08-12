<script lang="ts">
    import { ChevronDown } from "lucide-svelte";
import { createEventDispatcher } from "svelte";
    import { fly } from "svelte/transition";

    export let disabled = false;
    export let datas: Array<any>;
    let toggled = false;

    const dispatcher = createEventDispatcher();

    function onSelect(i: number) {
        dispatcher("select", i);
    }
</script>

<button {disabled} on:click={() => toggled = !toggled} class:toggled>
    <slot /><ChevronDown size={18}/>
    {#if toggled}
        <ul class="dropdown" transition:fly={{duration: 150, y: -10}}>
            {#each datas as data, i}
                <li><button on:click={() => onSelect(i)} class="dropdown-btn">{data.name}</button></li>
            {/each}
        </ul>
    {/if}
</button>

<style>
    button {
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;
        gap: .25rem;
        font-family: var(--secondary-font-set);
        background-color: var(--highlight-color);
        color: white;
        padding: .75em;
        border-radius: .45em;
        font-size: 15px;
        z-index: 4;
    }

    button:hover:not(:disabled) {
        box-shadow: inset 0px 0px 16px 16px var(--highlight-color);
    }

    button:disabled {
        background-color: var(--color-gray);
        box-shadow: none;
        color: var(--disabled);
        cursor: not-allowed;
    }

    button:not(:active) {
        /* Sorry not sorry */
        /* https://stackoverflow.com/questions/18376815/trigger-animation-on-element-click-in-pure-css */
        transition: transform .2s, box-shadow .2s, filter .2s;
    }

    button:active:not(:disabled) {
        transform: scale(0.97);
    }

    button.toggled {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    .dropdown {
        position: absolute;
        left: 0;
        top: 100%;
        width: 100%;
        box-sizing: border-box;
        border: 3px solid var(--highlight-color);
        border-top: none;
        border-bottom-left-radius: .45rem;
        border-bottom-right-radius: .45rem;
        overflow: hidden;
    }

    .dropdown-btn {
        display: block;
        width: 100%;
        border-radius: 0;
        color: initial;
        background-color: var(--background);
        box-shadow: none !important;
        transition: background-color .1s !important;
    }

    .dropdown-btn:hover {
        background-color: var(--color-gray);
    }
</style>