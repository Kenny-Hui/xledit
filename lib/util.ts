import { type Group, type Unit } from "./types";

export function forEach(group: Group, callback: (data: Unit | Group) => void) {
    for(let unit of group.units) {
        callback(unit);
    }
    
    for(let nestedGroup of group.groups) {
        callback(nestedGroup);
        setTimeout(() => {
            forEach(nestedGroup, callback)
        }, 0);
    }
}

export function forEachBlocking(group: Group, callback: (data: Unit | Group) => void) {
    for(let unit of group.units) {
        callback(unit);
    }
    
    for(let nestedGroup of group.groups) {
        callback(nestedGroup);
        forEachBlocking(nestedGroup, callback)
    }
}

export function haveUnit(group: Group, matchFunction: Function) {
    for(let unit of group.units) {
        if(matchFunction(unit)) {
            return true;
        }
    }

    for(let grp of group.groups) {
        if(haveUnit(grp, matchFunction)) return true;
    }

    return false;
}

export function createUnit(unit: Unit, parent: Group, remainingPath: string[] | null = null): Unit {
    let str = remainingPath ?? [...unit.path];
    let nextGroup = str[0];

    if(str.length == 0) {
        let newUnit = unit.clone();
        parent.addUnit(newUnit);
        return newUnit;
    }

    for(let innerGroup of parent.groups) {
        if(innerGroup.id == nextGroup) {
            str.shift();
            return createUnit(unit, innerGroup, str);
        }
    }
}

export function createGroup(group: Group, parent: Group, remainingPath: string[] | null = null): Group {
    let str = remainingPath ?? [...group.path];
    let nextGroup = str[0];

    if(str.length <= 1) { // HACK: Inconsistent behaviour with unit (Where unit's path does not include the ID, and group does)
        let newGroup = group.clone();
        parent.addGroup(newGroup);
        return newGroup;
    }

    for(let innerGroup of parent.groups) {
        if(innerGroup.id == nextGroup) {
            str.shift();
            return createGroup(group, innerGroup, str);
        }
    }
}

export function removeGroup(parent: Group, path: string[], remainingPath: string[] | null = null) {
    let newPath = remainingPath ?? Array.from(path);

    for(let grp of parent.groups) {
        if(grp.id == newPath[0]) {
            if(newPath.length == 1) {
                parent.groups.splice(parent.groups.indexOf(grp), 1);
                return;
            }
            newPath.shift();
            return removeGroup(grp, path, newPath);
        }
    }
}

export function getUnit(parent: Group, path: string[], remainingPath: string[] | null = null): Unit | null {
    let newPath = remainingPath ?? Array.from(path);

    for(let unit of parent.units) {
        if(newPath.length <= 1 && unit.id == newPath[0]) {
            return unit;
        }
    }

    for(let grp of parent.groups) {
        if(grp.id == newPath[0]) {
            newPath.shift();
            return getUnit(grp, path, newPath);
        }
    }
    return null;
}

export function findGroup(parent: Group, path: string[], remainingPath: string[] | null = null): Group | null {
    let newPath = remainingPath ?? Array.from(path);
    if(newPath.length == 0) return parent;

    for(let grp of parent.groups) {
        if(newPath.length <= 1) {
            if(grp.id == newPath[0]) {
                return grp;
            }
        } else {
            if(grp.id == newPath[0]) {
                newPath.shift();
                return findGroup(grp, path, newPath);
            }
        }
    }
    return null;
}

export function getISO639(langCode: string): string {
    return langCode.split("-")[0];
}

export function tryParseInt(str: string): number {
    let i = parseInt(str);
    if(isNaN(i)) {
        return 0;
    }
    return i;
}