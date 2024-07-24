<script lang="ts">
    import JSZip from 'jszip';
    import XmlBeautify from 'xml-beautify';
    import { Plus, FileDown, FolderDown, RefreshCw } from 'lucide-svelte';
    import { get } from 'svelte/store';
    import { getDerivedFiles, projects, selectedFile } from '../../stores/data';
    import { parseAndAddXliff } from '../../utils/util';
    import { exportXliff } from '../../../lib/xlfExporter';
    import Editor from './main/Editor.svelte';
    import Button from '../shared/Button.svelte';
    import FilePane from './FilePane.svelte';
    import { Group, Unit, type TranslationFile } from '../../../lib/types';
    import type { ExportOptions } from '../../utils/types';
    import { preferences } from '../../stores/preferenceStore';
    import { createGroup, createUnit, findGroup, forEachBlocking, getUnit } from '../../../lib/util';
    import { addToast } from '../../stores/uiStores';

    function addFiles() {
        let element = document.createElement("input");
        element.type = "file";
        element.multiple = true;
        element.onchange = (event) => {
            const target = event.target as HTMLInputElement;
            for(let file of target.files) {
                parseAndAddXliff(file);
            }
        }
        element.click();
    }

    function syncUnits() {
        let derivedFiles = getDerivedFiles($selectedFile);

        forEachBlocking($selectedFile.rootGroup, (data: Group | Unit) => {
            for(let file of derivedFiles) {
                if(file != $selectedFile) {
                    if(data instanceof Group) {
                        let gp = findGroup(file.rootGroup, data.path);
                        if(gp == null) {
                            let group = createGroup(data, file.rootGroup);
                            for(let units of group.units) {
                                units.target = null;
                            }
                        }
                    }

                    if(data instanceof Unit) {
                        let un = getUnit(file.rootGroup, data.getFullPath());
                        if(un == null) {
                            let newUnit = createUnit(data, file.rootGroup);
                            newUnit.target = null;
                        }
                    }
                }
            }
            $projects.files = $projects.files;
        });

        addToast(`Added missing group/unit to ${derivedFiles.length - 1} derived files`, "success", 4000);
    }

    function exportFile(targetFile: TranslationFile) {
        let xmlDoc = exportXliff([targetFile]);
        let blob = new Blob([xmlToString(xmlDoc, $preferences.export as ExportOptions)], {type: "text/plain;charset=utf-8"});
        saveAs(blob, targetFile.filename);
    }

    function exportAllFiles() {
        let files = get(projects).files;
        let zip = new JSZip();
        for(let file of files) {
            let xmlDoc = exportXliff([file]);
            zip.file(file.filename, xmlToString(xmlDoc, $preferences.export as ExportOptions));
        }
        
        zip.generateAsync({type:"blob"})
        .then(content => {
            saveAs(content, "xledit.zip");
        });
    }

    function saveAs(data: Blob, filename: string) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(data);
        a.download = filename;
        a.click();
    }

    function xmlToString(xmlDoc: XMLDocument, option: ExportOptions): string {
        return new XmlBeautify().beautify(new XMLSerializer().serializeToString(xmlDoc), {indent: (option.useTab ? "\t" : " ".repeat(option.spaceChar))})
    }
</script>
    
<main>
    <div>
        <div class="add-button">
            <Button on:click={addFiles}>
                <Plus size={18} /> Add Files
            </Button>
        </div>
    </div>

    <div class="btn-row">
        <Button disabled={$projects.files.length == 0} on:click={() => exportFile($selectedFile)}>
            <FileDown /> Export...
        </Button>
        <Button disabled={$projects.files.length <= 1} on:click={exportAllFiles}>
            <FolderDown /> Export All
        </Button>
        <Button disabled={$projects.files.length <= 1 || getDerivedFiles($selectedFile).length <= 1 } on:click={syncUnits}>
            <RefreshCw size={18} /> Sync derived file
        </Button>
    </div>

    <div>
        <FilePane languages={$projects.files}/>
    </div>

    <div>
        <Editor selectedFile={$selectedFile}/>
    </div>
</main>

<style>
    main {
        min-width: 900px;
        height: calc(100vh - 65px - 15px);
        position: relative;
        display: grid;
        grid-template:
        "add-file btn-row" 50px
        "file-pane d" auto;
        grid-template-columns: auto 1fr;
    }

    main > div {
        position: relative;
        overflow: auto;
        height: 100%;
    }

    .add-button {
        margin: 0 16px;
    }

    .btn-row {
        display: flex;
        flex-direction: row;
        gap: 16px;
        height: 40px;
    }
</style>