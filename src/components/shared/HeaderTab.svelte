<script lang="ts">
    import { location } from "svelte-spa-router";

    let { items }: { items: any[] } = $props();
</script>

<ul class="header-tab">
    {#each items as item, i}
        {#if item != null}
            <li>
                <a href={`/#${items[i].link}`} class:selected={$location == item.link}>
                    {item.name}
                </a>
            </li>
        {/if}
    {/each}
</ul>

<style>
    .header-tab {
        display: flex;
        gap: 0.75rem;
    }

    a[href] {
        font-weight: 400;
        padding: 0.5em;
        cursor: pointer;
        display: inline-block;
        text-decoration: none;
        color: inherit;
        text-align: center;
        transition: background-color 0.1s;
        border-radius: 0.35rem;
    }

    a[href]:hover:not(.selected) {
        background-color: var(--highlight);
    }

    a[href].selected {
        background: var(--highlight-color);
        color: white;
    }
</style>
