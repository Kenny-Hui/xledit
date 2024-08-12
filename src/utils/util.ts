import { addToast } from "../stores/uiStores";
import { get } from 'svelte/store';
import { projects, selectedFile } from "../stores/data";
import { TranslationFile, TranslationFormats } from "../../lib/types";

export function parseAndAddFile(rawFile: File) {
    let proj = get(projects);
    const reader = new FileReader(); 
    const strippedFileName = rawFile.name.split(".").slice(0, -1).join(".");
    reader.readAsText(rawFile, 'utf-8');

    reader.onload = function(event: ProgressEvent<FileReader>) {
        let success = false;
        let files: TranslationFile[] = [];

        for(let [name, format] of Object.entries(TranslationFormats)) {
            try {
                let imported = format.import(strippedFileName, event.target.result as string);
                files = [...imported];
                success = true;
                break;
            } catch (e) {
                console.groupCollapsed(`XLEdit: Unable to parse file ${rawFile.name} for format ${name}!`);
                console.error(e);
                console.groupEnd();
                continue;
            }
        }

        if(!success) {
            addToast(`Unable to parse file ${rawFile.name}`, 'warning', 4000);
        } else {
            for(let file of files) {
                proj.files.push(file);
    
                if(get(selectedFile) == null) {
                    selectedFile.set(file);
                }
                projects.set(proj);
            }
        }
    }
}

export function getISO639(langCode: string): string {
    return langCode.split("-")[0];
}

export function copyToClipboard(str) {
    if(str != null) {
        addToast(`Copied to clipboard.`, 'success', 3000);
        navigator.clipboard.writeText(str);
    } else {
        console.warn("XLEdit: Clipboard String is null whilst trying to copy")
    }
}

export function getSortPoint(langA: string, langB: string, targetLanguage: string): number {
    if(langA.split("-")[0] == langB.split("-")[0]) return 1; // Match primary subtag

    return 0;
}