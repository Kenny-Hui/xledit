<script>
    import { Github, Settings } from 'lucide-svelte';
    import { openDialog } from '../stores/uiStores';
    import { DialogProperty } from '../utils/types';
    import PreferenceDialog from './overlay/dialogs/preference/Dialog.svelte';
    import IconLink from './shared/IconLink.svelte';
    import HeaderTab from './shared/HeaderTab.svelte';
    import IconButton from './shared/IconButton.svelte';
    import constants from '../stores/constants';

    export let selectedTab;

    const tabs = [
        {
            name: "About"
        },
        {
            name: "Editor"
        },
        {
            name: "Batch Operation"
        }
    ];
</script>

<header>
    <div class="left">
        <div class="logo">
            <img alt="XLEdit" src="xledit.svg">
        </div>
        <span class="separator" />
        <div class="area">
            <HeaderTab items={tabs} bind:selectedIndex={selectedTab}>
            </HeaderTab>
        </div>
    </div>
    <div class="right">
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

    .separator {
        width: 1px;
        margin: 0 4px;
        height: 50px;
        background-color: var(--border);
    }

    .version-tag {
        background-color: var(--light-blue);
        padding: .5rem;
        border-radius: .3rem;
    }
</style>