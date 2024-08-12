<script lang="ts">
    import JSZip from 'jszip';
    import XmlBeautify from 'xml-beautify';
    import { Plus, FileDown, FolderDown, RefreshCw } from 'lucide-svelte';
    import { get } from 'svelte/store';
    import { getDerivedFiles, projects, selectedFile } from '../../stores/data';
    import { parseAndAddFile } from '../../utils/util';
    import Editor from './editor/Editor.svelte';
    import Button from '../shared/Button.svelte';
    import DropdownButton from '../shared/DropdownButton.svelte';
    import FilePane from './FilePane.svelte';
    import { Group, TranslationFormats, Unit, type TranslationFile, type TranslationFormat } from '../../../lib/types';
    import type { ExportOptions } from '../../utils/types';
    import { preferences } from '../../stores/preferenceStore';
    import { createGroup, createUnit, findGroup, forEachBlocking, getUnit } from '../../../lib/util';
    import { addToast } from '../../stores/uiStores';
    import { fly } from 'svelte/transition';

    function addFiles() {
        let element = document.createElement("input");
        element.type = "file";
        element.multiple = true;
        element.onchange = (event) => {
            const target = event.target as HTMLInputElement;
            for(let file of target.files) {
                parseAndAddFile(file);
            }
        }
        element.click();
    }

    function syncUnits() {
        let derivedFiles = getDerivedFiles($selectedFile);

        forEachBlocking($selectedFile.rootGroup, (data: Group | Unit) => {
            for(let file of derivedFiles) {
                if(file == $selectedFile) continue;

                if(data instanceof Group) {
                    let grp = findGroup(file.rootGroup, data.path);
                    if(grp == null) { // Add missing groups
                        let newGrp = createGroup(data, file.rootGroup);
                        for(let units of newGrp.units) {
                            units.target = "";
                        }
                    }
                }

                if(data instanceof Unit) {
                    let unit = getUnit(file.rootGroup, data.getFullPath());
                    if(unit == null) { // Add missing units
                        let newUnit = createUnit(data, file.rootGroup);
                        newUnit.target = "";
                    } else {
                        unit.source = data.source; // Sync source text
                    }
                }
            }
            $projects.files = $projects.files;
        });

        addToast(`Synchronized ${derivedFiles.length - 1} files`, "success", 4000);
    }

    function exportFileContent(files: TranslationFile[], format: TranslationFormat): string {
        let exportOptions = $preferences.export as ExportOptions;

        if(format === TranslationFormats.XLIFF12) {
            let xmlDoc = format.export(files);

            if(exportOptions.stripEmptyTarget) {
                for(let targetElem of [...xmlDoc.getElementsByTagName("target")]) {
                    if(targetElem.textContent.length == 0) targetElem.remove();
                }
            }
            return xmlToString(xmlDoc, exportOptions);
        }

        if(format === TranslationFormats.MINECRAFT) {
            return JSON.stringify(format.export(files), null, (exportOptions.useTab ? "\t" : " ".repeat(exportOptions.spaceChar)));
        }
        return null;
    }

    function exportFile(targetFile: TranslationFile, format: TranslationFormat) {
        let blob = new Blob([exportFileContent([targetFile], format)], {type: "text/plain;charset=utf-8"});
        saveAs(blob, targetFile.filename + format.extension);
    }

    function exportAllFiles(format: TranslationFormat) {
        let files = get(projects).files;
        let zip = new JSZip();
        for(let file of files) {
            zip.file(file.filename + format.extension, exportFileContent([file], format));
        }
        zip.generateAsync({type:"blob", compression: 'DEFLATE'})
        .then(content => {
            saveAs(content, `${$preferences.export.filename}.zip`);
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

    function onExport(i: number) {
        let format = Object.values(TranslationFormats)[i];
        exportFile($selectedFile, format);
    }

    function onExportAll(i: number) {
        let format = Object.values(TranslationFormats)[i];
        exportAllFiles(format);
    }
</script>
    
<main in:fly="{{duration: 400,y:-20}}">
    <div class="add-button">
        <Button on:click={addFiles}>
            <Plus size={18} /> Add Files
        </Button>
    </div>

    <div class="btn-row">
        <DropdownButton disabled={$projects.files.length == 0} datas={Object.values(TranslationFormats)} on:select={(val) => onExport(val.detail)}>
            <FileDown /> Export...
        </DropdownButton>
        <DropdownButton disabled={$projects.files.length <= 1} datas={Object.values(TranslationFormats)} on:select={(val) => onExportAll(val.detail)}>
            <FolderDown /> Export All
        </DropdownButton>
        <Button disabled={$projects.files.length <= 1 || getDerivedFiles($selectedFile).length <= 1 } on:click={syncUnits}>
            <RefreshCw size={18} /> Sync derived file
        </Button>
    </div>

    <div>
        <FilePane languages={$projects.files}/>
    </div>

    <div>
        <Editor />
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
        overflow: visible;
    }
</style>