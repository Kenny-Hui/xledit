<script lang="ts">
    import { activeToasts, activeDialog, activeTooltip, closeDialog } from '../../stores/uiStores';
    import Toast from '../shared/Toast.svelte';
    import { circOut } from 'svelte/easing';
    import BaseDialog from './dialogs/BaseDialog.svelte';
    let modalElement: HTMLDialogElement;

    function popAnim(A) {
        return {
            duration: 200,
            easing: circOut,
            css: (t) => `transform: scale(${0.85 + (t * 0.15)}); opacity:${t}`
        }
    }

    function showModal(e: Event) {
        (e.target as HTMLDialogElement).showModal();
    }
</script>

<div class="overlay">
    <div class="toasts">
        {#each $activeToasts as toast}
          <Toast {toast} />
        {/each}
    </div>
    {#each $activeDialog as dialog}
        <dialog bind:this={modalElement} on:introstart|once={showModal} on:close={closeDialog} transition:popAnim>
            <BaseDialog dialogProperty={dialog} />
        </dialog>
    {/each}
    {#if $activeTooltip != null}
        <div class="tooltips" style="top: {$activeTooltip.rect.top - 5}px; left: {($activeTooltip.rect.right) - ($activeTooltip.rect.width / 2)}px">
            <div class="tooltip">
                {$activeTooltip.content}
            </div>
        </div>
    {/if}
</div>

<style>
    .overlay {
        z-index: 10;
        position: fixed;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    
    .tooltips {
        position: absolute;
    }

    .tooltip {
        font-size: 14px;
        padding: .45rem;
        transform: translateX(-50%) translateY(-2em);
        border-radius: 5px;
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

    dialog {
        z-index: 5;
        pointer-events: all;
        box-shadow: 0 0 16px 0px #333;
        border-radius: 10px;
        overflow: auto;
        padding: 20px;
        outline: 2px transparent;
        border: none;
        background: #FFF;
    }
</style>