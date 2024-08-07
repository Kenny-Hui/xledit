<script lang="ts">
    export let disabled = false;
</script>

<button {disabled} on:click on:dragover on:drop>
    <slot />
</button>

<style>
    button {
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
    }

    button:hover:not(:disabled) {
        box-shadow: inset 0px 0px 16px 16px var(--highlight-color);
        filter: brightness(80%) contrast(125%);
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
</style>