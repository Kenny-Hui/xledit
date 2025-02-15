<script lang="ts">
    import { type ContextGroup, ContextType, Context, ContextGroupPurpose } from "../../../../../../lib/types";
    import { Plus, Trash, X } from "lucide-svelte";
    import { createEventDispatcher } from "svelte";
    import IconButton from "../../../../shared/IconButton.svelte";
    export let contextGrp: ContextGroup;
    export let embedded = false;

    const dispatch = createEventDispatcher();
    function remove() {
        dispatch("remove", contextGrp);
    }

    function addContext() {
        contextGrp.contexts.push(
            new Context("Your Context Here", ContextType.database),
        );
        contextGrp.contexts = contextGrp.contexts;
    }

    function removeContext(context: Context) {
        contextGrp.contexts.splice(contextGrp.contexts.indexOf(context), 1);
        contextGrp.contexts = contextGrp.contexts;
    }
</script>

<div class="container" class:embedded>
    <div class="bar">
        <div>
            <p>
                Contexts
                <span class="small-text subtext">
                    for
                    <select class="subtext" bind:value={contextGrp.purpose}>
                        {#each Object.keys(ContextGroupPurpose) as val}
                            <option value={val}>{val}</option>
                        {/each}
                    </select>
                </span>
            </p>
        </div>
    </div>

    {#each contextGrp.contexts as context}
        <div class="context">
            <select class="content subtext" bind:value={context.type}>
                {#each Object.keys(ContextType) as val}
                    <option value={val}>{val}</option>
                {/each}
            </select>
            <div class="content" contenteditable bind:textContent={context.content} style="flex:1"></div>
            <IconButton onclick={() => removeContext(context)} tooltip="Delete Context">
                <X size={16} />
            </IconButton>
        </div>
    {/each}

    <div class="bar">
        <div>
            <IconButton onclick={addContext} tooltip="Add Context">
                <Plus size={18} />
            </IconButton>
        </div>
        {#if !embedded}
            <div class="action-buttons">
                <IconButton onclick={remove} tooltip="Delete Context Group">
                    <Trash size={16} color="red" />
                </IconButton>
            </div>
        {/if}
    </div>
</div>

<style>
    .container {
        position: relative;
        background-color: var(--highlight-secondary);
        border: 1px solid var(--border);
        border-radius: .25rem;
        padding: 0.5em 0.75em;
        font-size: 1.1rem;
        line-height: 2;
        /* animation: expand 1s linear; */
        overflow: hidden;
        color: #222;
    }

    .embedded {
        animation: none;
    }

    .context {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        align-items: center;
    }

    .bar {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    [contenteditable],
    select {
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        line-height: 1.5;
    }

    [contenteditable]:hover {
        border: 1px solid gray;
        border-radius: 3px;
    }

    .small-text {
        font-size: 0.7em;
        margin: 4px;
    }

    .subtext {
        color: #666;
    }

    .content {
        font-size: .9rem;
    }

    .action-buttons {
        float: right;
    }
</style>
