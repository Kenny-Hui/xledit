import { v4 as uuidv4 } from 'uuid';
import { escapeXml } from "./xlfExporter";

export class XliffElement {
    nodeName: string;
    attributes: NamedNodeMap;

    constructor(nodeName: string, attributes: NamedNodeMap) {
        this.nodeName = nodeName;
        this.attributes = attributes;
    }

    export(xml: XMLDocument, xliffElement: Element): Element {
        let elem = xml.createElementNS(xliffElement.namespaceURI, this.nodeName);
        
        if(this.attributes != null) {
            for(let i = 0; i < this.attributes.length; i++) {
                let itm = this.attributes.item(i);
                elem.setAttribute(itm.name, itm.value);
            }
        }
        
        return elem;
    }
}

export class TranslationFile extends XliffElement {
    header: Header;
    version: string;
    filename: string;
    rootGroup: Group;
    units: Map<String, Unit>;
    isSource: boolean;
    uuid: string;
    sourceLanguage: string;
    targetLanguage: string;
    original: string;

    constructor(header: Header, filename: string, version: string, attributes: NamedNodeMap = null) {
        super("file", attributes);
        this.header = header;
        this.attributes = attributes;
        this.filename = filename;
        this.version = version;
        this.sourceLanguage = attributes.getNamedItem("source-language").textContent;
        this.targetLanguage = attributes.getNamedItem("target-language")?.textContent;
        this.original = attributes.getNamedItem("original").textContent;
        this.isSource = (this.targetLanguage == null || this.sourceLanguage == this.targetLanguage);
        this.units = new Map();
        this.uuid = uuidv4();
        this.rootGroup = new Group("Root", true, []); 
    }

    export(xml: XMLDocument, xliffElement: Element) {
        let elem = super.export(xml, xliffElement);
        elem.setAttribute("original", this.original);
        elem.setAttribute("source-language", this.sourceLanguage);
        if(this.targetLanguage != null) elem.setAttribute("target-language", this.targetLanguage);

        let header = this.header.export(xml, xliffElement);
        if(header != null) elem.appendChild(header);

        let body = xml.createElementNS(xliffElement.namespaceURI, "body");

        for(let group of this.rootGroup.groups) {
            body.appendChild(group.export(xml, xliffElement));
        }

        for(let unit of this.rootGroup.units) {
            body.appendChild(unit.export(xml, xliffElement))
        }

        elem.appendChild(body);
        return elem;
    }
}

export class Group extends XliffElement {
    id: string;
    path: string[];
    groups: Group[];
    units: Unit[];
    isRoot: boolean;

    constructor(id: string, isRoot = false, path: string[] = [], groups: Group[] = [], units: Unit[] = [], attributes: NamedNodeMap = null) {
        super("group", attributes);
        this.id = id;
        this.isRoot = isRoot;
        this.path = path;
        this.groups = groups;
        this.units = units;
    }

    addUnit(unit: Unit) {
        this.units.push(unit);
    }

    addGroup(group: Group) {
        this.groups.push(group);
    }

    clone(): Group {
        return new Group(this.id, this.isRoot, [...this.path], this.groups.map(e => e.clone()), this.units.map(e => e.clone()), this.attributes);
    }

    export(xml: XMLDocument, xliffElement: Element): Element {
        let elem = super.export(xml, xliffElement);
        elem.setAttribute("id", this.id);

        for(let subgroup of this.groups) {
            elem.appendChild(subgroup.export(xml, xliffElement));
        }
        
        for(let unit of this.units) {
            elem.appendChild(unit.export(xml, xliffElement));
        }
        return elem;
    }
}

export class Unit extends XliffElement {
    path: string[];
    id: string;
    source: string;
    target: string;
    notes: Note[];
    contextGroups: ContextGroup[];

    constructor(id: string, source: string, target: string, path: string[], notes: Note[], contextGroups: ContextGroup[] = [], attributes: NamedNodeMap = null) {
        super("trans-unit", attributes);
        this.id = id;
        this.source = source;
        this.target = target ? target : null;
        this.path = path;
        this.notes = notes;
        this.contextGroups = contextGroups;
    }

    relocate(path: string[]) {
        this.path = path;
    }   

    translated() {
        return this.target != null || this.target == "";
    }

    sameAsTarget() {
        return this.source == this.target;
    }

    getFullPath() {
        return this.path.concat([this.id]);
    }

    getFullPathStr() {
        return this.getFullPath().join("/");
    }

    clone() {
        return new Unit(this.id, this.source, this.target, [...this.path], [...this.notes], [...this.contextGroups], this.attributes);
    }

    getNotes() {
        return this.notes.sort((a, b) => a.priority - b.priority);
    }

    export(xml: XMLDocument, xliffElement: Element): Element {
        let elem = super.export(xml, xliffElement);

        // Export our version of attribute
        elem.setAttribute("id", this.id);

        let srcElement = xml.createElementNS(xliffElement.namespaceURI, "source");
        srcElement.textContent = escapeXml(this.source);
        elem.appendChild(srcElement);

        if(this.target) {
            let targetElement = xml.createElementNS(xliffElement.namespaceURI, "target");
            targetElement.textContent = escapeXml(this.target);
            elem.appendChild(targetElement);
        }
    
        for(let note of this.notes) {
            elem.appendChild(note.export(xml, xliffElement));
        }
    
        for(let contextGrp of this.contextGroups) {
            elem.appendChild(contextGrp.export(xml, xliffElement));
        }

        return elem;
    }
}

export type NoteAnnotateType = "source" | "target" | "general";

export class Note extends XliffElement {
    from: string;
    content: string;
    priority: number;
    annotates: NoteAnnotateType;
    constructor(from: string, content: string, priority = 0, annotates: NoteAnnotateType = "general", attributes: NamedNodeMap = null) {
        super("note", attributes);
        this.from = from;
        this.content = content;
        this.priority = priority;
        this.annotates = annotates;
    }

    export(xml: XMLDocument, xliffElement: Element): Element {
        let noteElement = super.export(xml, xliffElement);
        if(this.from) noteElement.setAttribute("from", escapeXml(this.from));
        if(this.priority != 0) noteElement.setAttribute("priority", this.priority.toString());
        if(this.annotates != "general") noteElement.setAttribute("annotates", this.annotates);
        noteElement.textContent = escapeXml(this.content);

        return noteElement;
    }

    clone() {
        return new Note(`${this.from}`, `${this.content}`, this.priority, this.annotates, this.attributes);
    }
}

export enum ContextType {
    database = "database",
    element = "element",
    elementtitle = "elementtitle",
    linenumber = "linenumber",
    numparams = "numparams",
    paramnotes = "paramnotes",
    record = "record",
    recordtitle = "recordtitle",
    sourcefile = "sourcefile"
}

export enum ContextGroupPurpose {
    information = "information",
    location = "location",
    match = "match"
};

export class Context extends XliffElement {
    type: ContextType;
    content: string

    constructor(content: string, type: ContextType, attributes: NamedNodeMap = null) {
        super("context", attributes);
        this.content = content;
        this.type = type;
    }

    export(xml: XMLDocument, xliffElement: Element): Element {
        let elem = super.export(xml, xliffElement);
        elem.setAttribute("context-type", this.type);
        elem.textContent = escapeXml(this.content);

        return elem;
    }
}

export class ContextGroup extends XliffElement {
    purpose: ContextGroupPurpose;
    contexts: Context[];

    constructor(purpose: ContextGroupPurpose, contexts: Context[] = [], attributes: NamedNodeMap = null) {
        super("context-group", attributes);
        this.purpose = purpose;
        this.contexts = contexts;
    }

    clone() {
        let newContext = [];
        for(let context of this.contexts) {
            newContext.push(new Context(context.content, context.type, context.attributes))
        }
        return new ContextGroup(this.purpose, newContext, this.attributes);
    }

    export(xml: XMLDocument, xliffElement: Element): Element {
        let elem = super.export(xml, xliffElement);
        elem.setAttribute("purpose", this.purpose);

        for(let context of this.contexts) {
            elem.appendChild(context.export(xml, xliffElement));
        }

        return elem;
    }
}

export abstract class InternalFile extends XliffElement {
    path: string;
    form: string;
    crc: string;

    constructor(path: string, form: string, crc: string, attributes: NamedNodeMap = null) {
        super("internal-file", attributes);
        this.path = path;
        this.form = form;
        this.crc = crc;
    }

    export(xml: XMLDocument, xliffElement: Element): Element {
        let elem = super.export(xml, xliffElement);
        elem.nodeValue = this.path;
        if(this.form != null) {
            elem.setAttribute("form", this.form);
        }
        if(this.crc != null) {
            elem.setAttribute("crc", this.crc);
        }

        return elem;
    }
}

export abstract class ExternalFile extends XliffElement {
    href: string;
    uid: string;
    crc: string;

    constructor(href: string, uid: string, crc: string, attributes: NamedNodeMap = null) {
        super("external-file", attributes);
        this.href = href;
        this.uid = uid;
        this.crc = crc;
    }

    export(xml: XMLDocument, xliffElement: Element): Element {
        let elem = super.export(xml, xliffElement);
        elem.setAttribute("href", this.href);
        if(this.uid != null) {
            elem.setAttribute("uid", this.uid);
        }
        if(this.crc != null) {
            elem.setAttribute("crc", this.crc);
        }

        return elem;
    }
}

export abstract class InternalExternalFile extends XliffElement {
    internalFile: InternalFile;
    externalFile: ExternalFile;

    constructor(internalFile: InternalFile, externalFile: ExternalFile, nodeName: string, attributes: NamedNodeMap = null) {
        super(nodeName, attributes);
        this.internalFile = internalFile;
        this.externalFile = externalFile;
    }

    export(xml: XMLDocument, xliffElement: Element): Element {
        let elem = super.export(xml, xliffElement);
        if(this.internalFile != null) {
            elem.appendChild(this.internalFile.export(xml, xliffElement));
        }
        
        if(this.externalFile != null) {
            elem.appendChild(this.externalFile.export(xml, xliffElement));
        }

        return elem;
    }
}

export class Skl extends InternalExternalFile {
    constructor(internalFile: InternalFile, externalFile: ExternalFile, attributes: NamedNodeMap = null) {
        super(internalFile, externalFile, "skl", attributes);
    }
}

export class Glossary extends InternalExternalFile {
    constructor(internalFile: InternalFile, externalFile: ExternalFile, attributes: NamedNodeMap = null) {
        super(internalFile, externalFile, "glossary", attributes);
    }
}

export class Reference extends InternalExternalFile {
    constructor(internalFile: InternalFile, externalFile: ExternalFile, attributes: NamedNodeMap = null) {
        super(internalFile, externalFile, "reference", attributes);
    }
}

export class Header extends XliffElement {
    skl: Skl;
    glossaries: Glossary[];
    references: Reference[];
    notes: Note[];
    constructor(skl: Skl, glossaries: Glossary[], references: Reference[], notes: Note[], attributes: NamedNodeMap = null) {
        super("header", attributes);
        this.skl = skl;
        this.glossaries = glossaries;
        this.references = references;
        this.notes = notes;
    }

    export(xml: XMLDocument, xliffElement: Element): Element {
        if(this.skl == null && this.glossaries.length == 0 && this.references.length == 0 && this.notes.length == 0) return null;

        let elem = super.export(xml, xliffElement);
        if(this.skl != null) {
            elem.appendChild(this.skl.export(xml, xliffElement));
        }

        for(let glossary of this.glossaries) {
            elem.appendChild(glossary.export(xml, xliffElement));
        }
        
        for(let reference of this.references) {
            elem.appendChild(reference.export(xml, xliffElement));
        }

        for(let note of this.notes) {
            elem.appendChild(note.export(xml, xliffElement));
        }

        return elem;
    }
}