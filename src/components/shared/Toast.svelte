<script lang="ts">
    import { CheckCircle, AlertCircle, XCircle } from "lucide-svelte";
    import type { Toast } from '../../utils/types';
    import { activeToasts } from "../../stores/uiStores";
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";

    export let toast: Toast;

    onMount(() => {
        const timeout = setTimeout(() => {
            // Remove self
            let index = $activeToasts.indexOf(toast);
            if(index != -1) {
                $activeToasts.splice(index, 1);
                // $activeToasts[index] = null;
                $activeToasts = $activeToasts;
            }
        }, toast.duration)
    })
</script>

{#if toast != null}
    <div class="main {toast.type}" transition:fly={{'duration': 200, 'y': 10}}>
        <p>
            <span class="icons">
                {#if toast.type == 'success'}
                    <CheckCircle />
                {:else if toast.type == 'warning'}
                    <AlertCircle />
                {:else if toast.type == 'warning'}
                    <XCircle />
                {/if}
            </span>
            {toast.content}
        </p>
        <span class="timeline" style="animation-duration:{toast.duration / 1000}s"></span>
    </div>
{/if}

<style>
    p {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @keyframes timeline {
        from {
            width: 0%;
        }
        to {
            width: 100%;
        }
    }

    .main {
        font-family: var(--secondary-font-set);
        position: relative;
        width: max-content;
        min-width: 25px;
        max-width: 400px;
        padding: 10px;
        margin: 20px auto 0px auto;
        color: white;
        border-radius: .5rem;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        overflow: hidden;
    }

    .timeline {
        content: '';
        position: absolute;
        display: inline;
        z-index: 0;
        bottom: 0;
        left: 0;
        height: 5px;
        background-color: rgba(0, 0, 0, 0.2);
        animation: timeline linear;
    }

    .icons {
        margin: 0 4px;
        display: inline;
    }

    .error {
        background-color: #FF2222;
    }

    .warning {
        background-color: #DD8800;
    }

    .success {
        background-color: #00AA00;
    }
</style>