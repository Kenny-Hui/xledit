<script lang="ts">
    import {
        activeToasts,
        activeDialog,
        activeTooltip,
        closeDialog,
    } from "../stores/uiStores";
    import Toast from "./shared/Toast.svelte";
    import { circOut } from "svelte/easing";
    import BaseDialog from "./dialogs/BaseDialog.svelte";

    function popAnim(A) {
        return {
            duration: 200,
            easing: circOut,
            css: (t) => `transform: scale(${0.85 + t * 0.15}); opacity:${t}`,
        };
    }
</script>

<div class="overlay">
    <div class="toasts">
        {#each $activeToasts as toast}
            <Toast {toast} />
        {/each}
    </div>
    {#each $activeDialog as dialog}
        <div class="dialog-wrapper">
            <div class="dialog" on:close={closeDialog} transition:popAnim>
                <BaseDialog dialogProperty={dialog} />
            </div>
        </div>
    {/each}
    {#if $activeTooltip != null}
        <div
            class="tooltips"
            style="top: {$activeTooltip.rect.top - 5}px; left: {$activeTooltip
                .rect.right -
                $activeTooltip.rect.width / 2}px"
        >
            <div class="tooltip">
                {$activeTooltip.content}
            </div>
        </div>
    {/if}
</div>

<style>
    .overlay {
        z-index: 5;
        position: fixed;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .tooltips {
        z-index: 6;
        position: absolute;
    }

    .tooltip {
        font-size: 14px;
        padding: 0.45rem;
        transform: translateX(-50%) translateY(-2em);
        border-radius: 0.25rem;
        background-color: rgba(60, 60, 60, 0.75);
        color: white;
    }

    .toasts {
        position: fixed;
        left: 50%;
        bottom: 0px;
        transform: translate(-50%, 0%);
        margin-bottom: 1rem;
    }

    .dialog-wrapper {
        z-index: 1;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.25);
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: all;
    }
</style>
