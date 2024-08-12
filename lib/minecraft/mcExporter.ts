import { Group, type TranslationFile } from '../types';

export function exportMinecraft(files: TranslationFile[]) {
    let obj = {};

    for(let file of files) {
        obj = Object.assign(exportGroup(file.rootGroup, file.isSource), obj);
    }

    return obj;
}

function exportGroup(data: Group, isSource: boolean, prefix: Array<string> = []) {
    let obj = {};

    for(let subgroup of data.groups) {
        obj = Object.assign(obj, exportGroup(subgroup, isSource, [...prefix, subgroup.id]));
    }
    
    for(let unit of data.units) {
        let prefixStr = prefix.length == 0 ? "" : prefix.join(".") + ".";

        if(isSource) {
            obj[prefixStr + unit.id] = unit.source.text;
        } else if(unit.target.text != "") {
            obj[prefixStr + unit.id] = unit.target.text;
        }
    }
    return obj;
}