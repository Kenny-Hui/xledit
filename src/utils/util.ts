import { addToast } from "../stores/uiStores";
import { get } from 'svelte/store';
import { projects, selectedFile } from "../stores/data";
import { parse } from "../../lib/xlfParser";

export function parseAndAddXliff(file: File) {
    let proj = get(projects);
    let reader = new FileReader(); 
    reader.readAsText(file, 'utf-8');

    reader.onload = function(event: ProgressEvent<FileReader>) {
        try {
            let xliffFiles = parse(file.name, event.target.result as string);
            for(let file of xliffFiles) {
                proj.files.push(file);

                if(get(selectedFile) == null) {
                    selectedFile.set(file);
                }
                projects.set(proj);
            }
        } catch (e) {
            console.error(e);
            addToast(`Unable to parse file ${file.name}`, 'warning', 4000);
            console.warn(`XLEdit: Unable to parse XML file ${file.name}!`)
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