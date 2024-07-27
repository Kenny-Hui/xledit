import { Context, ContextGroup, Group, Unit, TranslationFile as TranslationFile, Note, type NoteAnnotateType, ContextGroupPurpose, ContextType } from './types';

export function parse(filename: string, xml: string): TranslationFile[] {
    let parser = new DOMParser();
    let xmlDoc: Document;
    xmlDoc = parser.parseFromString(xml, "text/xml");
    if(xmlDoc.querySelector('parsererror')) { //Error while parsing XML
        throw Error(xmlDoc.querySelector('parsererror').textContent);
    } else if(xmlDoc.getElementsByTagName("xliff").length == 0) {
        throw Error("No XLIFF tag");
    } else {
        let xliffElement = xmlDoc.getElementsByTagName("xliff")[0];
        let xliffVersion = xliffElement.getAttribute("version");

        if(parseFloat(xliffVersion) > 1.2) {
            console.warn(`XLEdit: XLEdit currently only supports XLIFF 1.2 and below`);
            throw Error(`XLIFF Version ${xliffVersion} is not supported yet.`);
        }
        return parseInternal(filename, xliffElement, xliffVersion);
    }
}

function parseInternal(filename: string, xlfElement: Element, xlfVersion: string): TranslationFile[] {
    let xliffFiles: TranslationFile[] = [];
    
    if(parseFloat(xlfVersion) <= 1.2) {
        for(let fileElement of xlfElement.getElementsByTagName("file")) {
            let file = new TranslationFile(filename, xlfVersion, fileElement.attributes)
            let body = fileElement.getElementsByTagName("body")[0];

            for(let el of body.children) {
                if(el.nodeName == "group") {
                    file.rootGroup.groups.push(groupParser(el));
                }

                if(el.nodeName == "trans-unit") {
                    let unit = parseUnit(el, []);
                    file.rootGroup.units.push(unit);
                }
            }
            xliffFiles.push(file);
        }
    }

    console.log(xliffFiles);
    return xliffFiles;
}

function groupParser(el, prefix: string[] = null): Group {
    let thisGroupId = el.getAttribute("id");
    if(thisGroupId == null) return null;
    let thisGroup = new Group(thisGroupId);
    
    if(prefix == null) prefix = [thisGroup.id];
    thisGroup.path = prefix;

    let p = prefix;

    // Handle Duplication
    let seenUnitId = [];

    for(let element of el.childNodes) {
        if(element.nodeName == "group") {
            prefix.push(element.getAttribute("id"));
            let subGroup = groupParser(element, prefix);
            thisGroup.addGroup(subGroup);
        }

        if(element.nodeName == "trans-unit") {
            let unit = parseUnit(element, prefix);
            if(seenUnitId.includes(unit.id)) {
                console.warn(unit.getFullPathStr() + " already exists!");
                unit.id += "-XL-DUPLICATED"
            } else {
                seenUnitId.push(unit.id);
            }
            thisGroup.addUnit(unit);
        }
        prefix = [...p];
    }
    return thisGroup;
}

function parseUnit(element: Element, path: string[]): Unit {
    /* Parse attribute */
    let unitId = element.getAttribute("id");
    
    let source = element.getElementsByTagName("source")[0]?.textContent;
    let target = element.getElementsByTagName("target")[0]?.textContent;
    let notesElem = element.getElementsByTagName("note");
    let contextGrpsElem = element.getElementsByTagName("context-group");
    let notes = [];
    for(let note of notesElem) {
        let from = note.getAttribute("from");
        let content = note.textContent;
        let priority = note.getAttribute("priority") ?? "0";
        let annotates = (note.getAttribute("annotates") ?? "general") as NoteAnnotateType;
        notes.push(new Note(from, content, parseInt(priority), annotates));
    }

    let contexts = [];

    for(let contextGrp of contextGrpsElem) {
        let contextGroup = new ContextGroup(contextGrp.getAttribute("purpose") as ContextGroupPurpose);
        for(let contextElem of contextGrp.getElementsByTagName("context")) {
            let context = new Context(contextElem.textContent, contextElem.getAttribute("context-type") as ContextType);
            contextGroup.contexts.push(context);
        }
        contexts.push(contextGroup);
    }

    return new Unit(unitId, source, target, path, notes, contexts, element.attributes);
}