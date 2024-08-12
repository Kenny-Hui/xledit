<script lang="ts">
    import type { Note } from "../../../../../../lib/types";
    import { Trash } from "lucide-svelte";
    import { createEventDispatcher } from "svelte";
    import IconButton from "../../../../shared/IconButton.svelte";
    export let note: Note;
    export let embedded = false;

    const dispatch = createEventDispatcher();
    function remove() {
        dispatch("remove", note);
    }
</script>

<div class="container" class:embedded>
    <div class="bar">
        <div>
            <p>
                Note
                {#if note.from != null}
                    <span class="small-text">
                        from
                        <input
                            class="small-text"
                            size="8"
                            bind:value={note.from}
                        />
                    </span>
                {/if}
            </p>
        </div>
        <div>
            <span class="small-text"
                >Priority: {note.priority == 0 ? " (None)" : ""}</span
            >
            <input
                class="small-text"
                type="number"
                min="0"
                max="9"
                size="1"
                bind:value={note.priority}
            />
        </div>
    </div>

    <p class="content" contenteditable bind:textContent={note.content}></p>

    <div class="bar">
        <div class="annotates">
            <span class="small-text">For</span>
            <select class="small-text" bind:value={note.annotates}>
                <option value="general">General</option>
                <option value="source">Source String</option>
                <option value="target">Target String</option>
            </select>
        </div>

        {#if !embedded}
            <div class="action-buttons">
                <IconButton on:click={remove} tooltip="Delete note">
                    <Trash size={16} color="red" />
                </IconButton>
            </div>
        {/if}
    </div>
</div>

<style>
    @keyframes expand {
        from {
            max-height: 0;
        }
        to {
            max-height: 400px;
        }
    }

    .container {
        position: relative;
        background-color: var(--highlight-secondary);
        border: 1px solid var(--border);
        border-radius: 4px;
        padding: 0.5em 0.75em;
        font-size: 18px;
        line-height: 2;
        margin-bottom: 5px;
        /* animation: expand 1s linear; */
        overflow: hidden;
        color: #222;
    }

    .embedded {
        animation: none;
    }

    .bar {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    [contenteditable],
    input,
    select {
        background: none;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        padding: 0.1rem;
    }

    [contenteditable]:hover,
    input:hover {
        border: 1px solid gray;
        border-radius: 3px;
    }

    .small-text {
        color: #666;
        font-size: 0.8rem;
        margin: 4px;
    }

    .content {
        font-size: 14px;
    }

    .action-buttons {
        float: right;
    }
</style>
