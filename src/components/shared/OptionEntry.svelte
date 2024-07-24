<style>
    .entry {
        display: flex;
        width: 100%;
        margin: .5em;
        flex-wrap: wrap;
        box-sizing: border-box;
        align-items: center;
    }

    .key {
        flex: 1;
    }

    .value {
        flex: 1;
    }
</style>

<div class="entry">
    <div class="key">
        <slot name="key" />
    </div>

    {#if $$slots.value}
        <div class="value">
            <slot name="value" />
        </div>
    {/if}
</div>