<script lang="ts">
    import { Github, Settings } from "lucide-svelte";
    import { openDialog } from "../stores/uiStores";
    import { DialogProperty } from "../utils/types";
    import PreferenceDialog from "./dialogs/preference/Dialog.svelte";
    import IconLink from "./shared/IconLink.svelte";
    import HeaderTab from "./shared/HeaderTab.svelte";
    import IconButton from "./shared/IconButton.svelte";
    import constants from "../stores/constants";
    import Logo from "./Logo.svelte";

    let { tabs }: { tabs: any[] } = $props();
</script>

<header>
    <div class="left">
        <div class="logo">
            <Logo darkMode={false} />
        </div>
        <span class="separator"></span>
        <div class="area">
            <HeaderTab items={tabs} />
        </div>
    </div>
    <div class="right">
        <div>
            <IconButton onclick={() => openDialog(new DialogProperty(PreferenceDialog))}>
                <Settings size={22} />
            </IconButton>
        </div>
        <div class="version-tag">
            <p>v{constants.VERSION}</p>
        </div>
        <div>
            <IconLink link="https://github.com/Kenny-Hui/xledit" target="_blank">
                <Github size={22} />
            </IconLink>
        </div>
    </div>
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
        font-size: 1.15rem;
        padding: 0.4rem 1.25rem;
        box-sizing: border-box;
        box-shadow: 0px 0px 6px black;
        border-radius: 0 0 .7rem .7rem;
        align-items: center;
        background: white;
        width: 100%;
    }

    .left, .right {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .separator {
        width: 1px;
        height: 50px;
        background-color: var(--border);
    }

    .version-tag {
        background-color: var(--highlight-secondary);
        padding: 0.5rem;
        border-radius: 0.3rem;
    }
</style>
