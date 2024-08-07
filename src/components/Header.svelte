<script lang="ts">
    import { Github, Settings } from 'lucide-svelte';
    import { openDialog } from '../stores/uiStores';
    import { DialogProperty } from '../utils/types';
    import PreferenceDialog from './overlay/dialogs/preference/Dialog.svelte';
    import IconLink from './shared/IconLink.svelte';
    import HeaderTab from './shared/HeaderTab.svelte';
    import IconButton from './shared/IconButton.svelte';
    import constants from '../stores/constants';
    import { preferences } from '../stores/preferenceStore';

    export let tabs;
    export let themes: Object;
</script>

<header>
    <div class="left">
        <div class="logo">
            <img alt="XLEdit" src="xledit.svg">
        </div>
        <span class="separator" />
        <div class="area">
            <HeaderTab items={tabs} />
        </div>
    </div>
    <div class="right">
        {#each Object.entries(themes) as [key, value]}
            <button class="color-pick" class:color-picked={$preferences.appearance.color == key} title="Accent color {key}" on:click={() => $preferences.appearance.color = key} style="background-color: rgb({value});outline-color: rgb({value})"></button>
        {/each}
        <div>
            <IconButton on:click={() => openDialog(new DialogProperty(PreferenceDialog))}>
                <Settings size={22}/>
            </IconButton>
        </div>
        <div class="version-tag">
            <p>v{constants.VERSION}</p>
        </div>
        <div>
            <IconLink link="https://github.com/Kenny-Hui/xledit" target="_blank">
                <Github size={22}/>
            </IconLink>
        </div>
    </div>
</header>

<style>
    header {
        position: sticky;
        top: 0;
        display: flex;
        justify-content: space-between;
        font-size: 18px;
        padding: 5px 20px;
        box-sizing: border-box;
        height: 65px;
        box-shadow: 0px 0px 6px black;
        border-radius: 0 0 10px 10px;
        margin-bottom: 15px;
        align-items: center;
        background: white;
        width: 100%;
    }

    .left, .right {
        display: flex;
        gap: 12px;
        align-items: center;
    }

    .logo > img {
        height: 52px;
    }

    .color-pick {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid var(--background);
    }

    .color-picked {
        outline: 2px solid;
    }

    .separator {
        width: 1px;
        margin: 0 4px;
        height: 50px;
        background-color: var(--border);
    }

    .version-tag {
        background-color: var(--highlight-secondary);
        padding: .5rem;
        border-radius: .3rem;
    }
</style>