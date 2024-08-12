import { get } from 'svelte/store';
import { projects } from '../../src/stores/data';
import { TranslationFile as TranslationFile, Unit } from '../types';
import { addToast } from '../../src/stores/uiStores';
import { getUnit } from '../util';

export function parseMinecraft(filename: string, data: string): TranslationFile[] {
    const obj = JSON.parse(data);
    const strippedFileName = filename.split(".json")[0];
    const firstHalf = strippedFileName.split("_")[0];
    const secondHalf = strippedFileName.split("_")[1];
    const targetLang = `${firstHalf}-${secondHalf.toUpperCase()}`;
    
    let file = new TranslationFile(null, strippedFileName, "en-US", targetLang, document.createElement("span").attributes);
    if(targetLang != "en-US" && get(projects).getOriginatingFile(file) == null) {
        addToast("Please add en_us.json translation first.", "warning", 5000);
    }

    for(const [id, translation] of Object.entries(obj)) {
        let sourceText = targetLang == "en-US" ? translation as string : getUnit(get(projects).getOriginatingFile(file).rootGroup, [id])?.source ?? id;
        let targetText = targetLang == "en-US" ? "" : translation as string;
        let unit = new Unit(id, sourceText, targetText, [], [], [], [], document.createElement("span").attributes);
        file.rootGroup.units.push(unit);
    }

    return [file];
}