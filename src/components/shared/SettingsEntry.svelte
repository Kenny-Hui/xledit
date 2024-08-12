<div class="entry">
    <div class="key">
        <slot name="key" />
    </div>

    <div class="description">
        <slot name="description" />
    </div>

    {#if $$slots.value}
        <div class="value">
            <slot name="value" />
        </div>
    {/if}
</div>

<style>
    .entry {
        margin: 0.75rem;
        border-bottom: 1px solid var(--border);
    }

    .key {
        font-size: 1.25rem;
        margin: 0.5rem 0;
    }

    .description {
        color: #666;
        font-size: 0.9rem;
    }

    .value {
        margin: 0.75rem 0;
    }
</style>
