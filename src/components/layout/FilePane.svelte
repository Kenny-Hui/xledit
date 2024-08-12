<script lang="ts">
    import { type TranslationFile } from '../../../lib/types';
    import { shortHandedLang } from '../../utils/types';
    import { preferences } from '../../stores/preferenceStore';
    import FileEntry from './FileEntry.svelte';
    import { parseAndAddFile } from '../../utils/util';
    import { Import } from 'lucide-svelte';
    import { fade } from 'svelte/transition';
    export let languages: TranslationFile[];
    $: displayFileName = $preferences.langSelect.displayName;

    function getLangName(nameType: string, langCode: string) {
        if(nameType == 'filename') {
            let targetFile = languages.filter(l => (l.targetLanguage ?? l.sourceLanguage) == langCode);
            if(targetFile.length > 0) {
                return targetFile[0].filename;
            }
        } else {
            if(shortHandedLang[langCode.toLowerCase()] != null) {
                return shortHandedLang[langCode.toLowerCase()];
            }

            const languageNames = new Intl.DisplayNames([langCode], {
                type: 'language',
                fallback: "code",
                languageDisplay: "standard"
            });
            let res = languageNames.of(langCode);
            return shortHandedLang[res] ?? res;
        }
    }

    function onFileDrop(event: DragEvent) {
        event.preventDefault();
        if(event.dataTransfer.items) {
            for(let item of event.dataTransfer.items) {
                if(item.kind == 'file') {
                    parseAndAddFile(item.getAsFile());
                }
            }
        }
        dragged = false;
    }

    function sort(languages: TranslationFile[]): TranslationFile[] {
        return languages.sort((a, b) => {
            return getLangName(displayFileName, a.targetLanguage ?? a.sourceLanguage).localeCompare(getLangName(displayFileName, b.targetLanguage ?? b.sourceLanguage))
        });
    }

    let dragged = false;
</script>
    
<div class="file-pane" on:dragenter={() => dragged = true}>
    {#if dragged}
        <div class="overlay" on:dragenter={() => dragged = true} on:dragover|preventDefault on:drop={onFileDrop} on:dragleave={() => dragged = false} transition:fade={{ duration: 100 }}>
            <div class="overlay-content">
                <Import size={64} />
                <br>    
                Import files
            </div>
        </div>
    {/if}

    {#if languages.length == 0}
        <div class="message">
            <p>Import files by drag and dropping here</p>
        </div>
    {:else}
        <ul>
            {#each sort(languages) as lang}
                <li>
                    <FileEntry file={lang} />
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .file-pane {
        margin-left: 10px;
        min-width: 240px;
    }

    ul {
        margin: 10px 0;
    }

    .overlay {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: white;
        background: rgba(0, 0, 0, 0.75);
        z-index: 1;
    }

    .overlay-content {  
        pointer-events: none;   
        text-align: center;
    }

    .message {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        color: gray;
    }

    .message > * {
        pointer-events: none;
    }

    .message > * {
        margin: 0 20px;
        text-align: center;
    }
</style>