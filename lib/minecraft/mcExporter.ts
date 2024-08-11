import { Group, type TranslationFile } from '../types';

export function exportMinecraftTranslation(files: TranslationFile[]) {
    let obj = {};

    for(let file of files) {
        obj = Object.assign(exportGroup(file.rootGroup, file.targetLanguage == null), obj);
    }

    return obj;
}

export function exportGroup(data: Group, isSource: boolean, prefix: Array<string> = []) {
    let obj = {};

    for(let subgroup of data.groups) {
        obj = Object.assign(obj, exportGroup(subgroup, isSource, [...prefix, subgroup.id]));
    }
    
    for(let unit of data.units) {
        let prefixStr = prefix.length == 0 ? "" : prefix.join(".") + ".";

        if(isSource) {
            obj[prefixStr + unit.id] = unit.source;
        } else if(unit.target != "") {
            obj[prefixStr + unit.id] = unit.target;
        }
    }
    return obj;
}