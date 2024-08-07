import { v4 as uuidv4 } from 'uuid';
import { escapeXml } from "./xlfExporter";

export class XliffElement {
    nodeName: string;
    attributes: NamedNodeMap | null;

    constructor(nodeName: string, attributes: NamedNodeMap | null) {
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
    targetLanguage: string | null;
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

    static import(elem: Element, filename: string, version: string) {
        let header = elem.querySelector("header") != null ? Header.import(elem.querySelector("header")) : null;
        let file = new TranslationFile(header, filename, version, elem.attributes);
        let body = elem.getElementsByTagName("body")[0];

        for(let el of body.children) {
            if(el.nodeName == "group") {
                file.rootGroup.groups.push(Group.import(el));
            }

            if(el.nodeName == "trans-unit") {
                let unit = Unit.import([], el);
                file.rootGroup.units.push(unit);
            }
        }
        return file;
    }

    export(xml: XMLDocument, xliffElement: Element) {
        let elem = super.export(xml, xliffElement);
        elem.setAttribute("original", this.original);
        elem.setAttribute("source-language", this.sourceLanguage);
        if(this.targetLanguage != null) elem.setAttribute("target-language", this.targetLanguage);

        if(this.header != null) {
            elem.appendChild(this.header.export(xml, xliffElement));
        }

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

    static import(elem: Element, path: string[] = null) {
        let thisGroupId = elem.getAttribute("id");
        if(thisGroupId == null) return null;
        let thisGroup = new Group(thisGroupId);
        
        if(path == null) path = [thisGroup.id];
        thisGroup.path = path;

        let p = path;
        
        for(let element of elem.childNodes) {
            let e = element as Element;
            if(e.nodeName == "group") {
                path.push(e.getAttribute("id"));
                let subGroup = Group.import(e, path);
                thisGroup.addGroup(subGroup);
            }

            if(e.nodeName == "trans-unit") {
                let unit = Unit.import(path, e);
                thisGroup.addUnit(unit);
            }
            path = [...p];
        }
        return thisGroup;
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
        this.target = target;
        this.path = path;
        this.notes = notes;
        this.contextGroups = contextGroups;
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

    static import(path: string[], elem: Element) {
        /* Parse attribute */
        let unitId = elem.getAttribute("id");
        
        let source = elem.getElementsByTagName("source")[0].textContent;
        let target = elem.getElementsByTagName("target")[0]?.textContent ?? "";
        let notesElem = elem.getElementsByTagName("note");
        let contextGrpsElem = elem.getElementsByTagName("context-group");
        let notes = [];
        for(let note of notesElem) {
            notes.push(Note.import(note));
        }
    
        let contextGrps = [];
    
        for(let contextGrp of contextGrpsElem) {
            let contextGroup = ContextGroup.import(contextGrp);
            contextGrps.push(contextGroup);
        }
    
        return new Unit(unitId, source, target, path, notes, contextGrps, elem.attributes);
    }

    export(xml: XMLDocument, xliffElement: Element): Element {
        let elem = super.export(xml, xliffElement);

        // Export our version of attribute
        elem.setAttribute("id", this.id);

        let srcElement = xml.createElementNS(xliffElement.namespaceURI, "source");
        srcElement.textContent = escapeXml(this.source);
        elem.appendChild(srcElement);

        let targetElement = xml.createElementNS(xliffElement.namespaceURI, "target");
        targetElement.textContent = escapeXml(this.target);
        elem.appendChild(targetElement);

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

    static import(elem: Element): Note {
        let from = elem.getAttribute("from");
        let content = elem.textContent;
        let priority = elem.getAttribute("priority") ?? "0";
        let annotates = (elem.getAttribute("annotates") ?? "general") as NoteAnnotateType;
        return new Note(from, content, parseInt(priority), annotates);
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

    static import(elem: Element) {
        return new Context(elem.textContent, elem.getAttribute("context-type") as ContextType, elem.attributes);
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

    static import(elem: Element) {
        let contexts = [];
        for(let contextElem of elem.getElementsByTagName("context")) {
            contexts.push(Context.import(contextElem));
        }

        return new ContextGroup(elem.getAttribute("purpose") as ContextGroupPurpose, contexts, elem.attributes);
    }

    export(xml: XMLDocument, xliffElement: Element): Element {
        let elem = super.export(xml, xliffElement);
        elem.setAttribute("purpose", this.purpose);

        for(let context of this.contexts) {
            elem.appendChild(context.export(xml, xliffElement));
        }

        return elem;
    }

    clone() {
        let newContext = [];
        for(let context of this.contexts) {
            newContext.push(new Context(context.content, context.type, context.attributes))
        }
        return new ContextGroup(this.purpose, newContext, this.attributes);
    }
}

export class InternalFile extends XliffElement {
    path: string;
    form: string;
    crc: string;

    constructor(path: string, form: string, crc: string, attributes: NamedNodeMap = null) {
        super("internal-file", attributes);
        this.path = path;
        this.form = form;
        this.crc = crc;
    }

    static import(elem: Element): InternalFile {
        return new InternalFile(elem.textContent, elem.getAttribute("form"), elem.getAttribute("crc"), elem.attributes);
    }

    export(xml: XMLDocument, xliffElement: Element): Element {
        let elem = super.export(xml, xliffElement);
        elem.textContent = this.path;
        if(this.form != null) {
            elem.setAttribute("form", this.form);
        }
        if(this.crc != null) {
            elem.setAttribute("crc", this.crc);
        }

        return elem;
    }
}

export class ExternalFile extends XliffElement {
    href: string;
    uid: string;
    crc: string;

    constructor(href: string, uid: string, crc: string, attributes: NamedNodeMap = null) {
        super("external-file", attributes);
        this.href = href;
        this.uid = uid;
        this.crc = crc;
    }

    static import(elem: Element): ExternalFile {
        return new ExternalFile(elem.getAttribute("href"), elem.getAttribute("uid"), elem.getAttribute("crc"), elem.attributes);
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

    static import(elem: Element) {
        let internalFile = null;
        let externalFile = null;
        if(elem.querySelector("internal-file") != null) {
            internalFile = InternalFile.import(elem.querySelector("internal-file"));
        }
        if(elem.querySelector("external-file") != null) {
            externalFile = ExternalFile.import(elem.querySelector("external-file"));
        }

        return new Skl(internalFile, externalFile, elem.attributes);
    }
}

export class Glossary extends InternalExternalFile {
    constructor(internalFile: InternalFile, externalFile: ExternalFile, attributes: NamedNodeMap = null) {
        super(internalFile, externalFile, "glossary", attributes);
    }

    static import(elem: Element) {
        let internalFile = null;
        let externalFile = null;
        if(elem.querySelector("internal-file") != null) {
            internalFile = InternalFile.import(elem.querySelector("internal-file"));
        }
        if(elem.querySelector("external-file") != null) {
            externalFile = ExternalFile.import(elem.querySelector("external-file"));
        }
        return new Glossary(internalFile, externalFile, elem.attributes);
    }
}

export class Reference extends InternalExternalFile {
    constructor(internalFile: InternalFile, externalFile: ExternalFile, attributes: NamedNodeMap = null) {
        super(internalFile, externalFile, "reference", attributes);
    }

    static import(elem: Element) {
        let internalFile = null;
        let externalFile = null;
        if(elem.querySelector("internal-file") != null) {
            internalFile = InternalFile.import(elem.querySelector("internal-file"));
        }
        if(elem.querySelector("external-file") != null) {
            externalFile = ExternalFile.import(elem.querySelector("external-file"));
        }
        return new Reference(internalFile, externalFile, elem.attributes);
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

    static import(elem: Element): Header {
        let skl;
        let glossaries = [];
        let references = [];
        let notes = [];

        if(elem.querySelector("skl") != null) {
            skl = Skl.import(elem.querySelector("skl"));
        }

        for(let glossary of elem.querySelectorAll("glossary")) {
            glossaries.push(Glossary.import(glossary));
        }

        for(let reference of elem.querySelectorAll("reference")) {
            references.push(Reference.import(reference));
        }

        for(let note of elem.querySelectorAll("note")) {
            notes.push(Note.import(note));
        }

        return new Header(skl, glossaries, references, notes, elem.attributes);
    }

    export(xml: XMLDocument, xliffElement: Element): Element {
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