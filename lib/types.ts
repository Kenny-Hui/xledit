import { v4 as uuidv4 } from 'uuid';
import { parseXliff12 } from './xliff12/xliff12Parser';
import { exportXliff12 } from './xliff12/xliff12Exporter';
import { parseMinecraft } from './minecraft/mcParser';
import { exportMinecraft } from './minecraft/mcExporter';

interface ImportFunction {
    (filename: string, data: string): TranslationFile[];
}

interface ExportFunction {
    (files: TranslationFile[]): any;
}

export type TranslationFormat = {
    name: string,
    extension: string,
    import: ImportFunction,
    export: ExportFunction
}

export const TranslationFormats = {
    XLIFF12: {
        name: "XLIFF 1.2 (.xlf)",
        extension: ".xlf",
        import: parseXliff12,
        export: exportXliff12
    } as TranslationFormat,
    MINECRAFT: {
        name: "Minecraft (.json)",
        extension: ".json",
        import: parseMinecraft,
        export: exportMinecraft
    } as TranslationFormat
}

export class BaseElement {
    metadata: NamedNodeMap | null;

    constructor(metadata: NamedNodeMap | null) {
        this.metadata = metadata;
    }
}

export class TranslationFile extends BaseElement {
    header: Header;
    filename: string;
    rootGroup: Group;
    units: Map<String, Unit>;
    isSource: boolean;
    uuid: string;
    sourceLanguage: string;
    targetLanguage: string | null;
    original: string;

    constructor(header: Header, filename: string, sourceLanguage: string, targetLanguage: string | null, original: string, metadata: NamedNodeMap = null) {
        super(metadata);
        this.header = header;
        this.filename = filename;
        this.sourceLanguage = sourceLanguage;
        this.targetLanguage = targetLanguage;
        this.original = original;
        this.isSource = (this.targetLanguage == null || this.sourceLanguage == this.targetLanguage);
        this.units = new Map();
        this.uuid = uuidv4();
        this.rootGroup = new Group("Root", true, []); 
    }

    static import(elem: Element, filename: string) {
        let header = elem.querySelector("header") != null ? Header.import(elem.querySelector("header")) : null;
        let file = new TranslationFile(header,
            filename,
            elem.attributes.getNamedItem("source-language").textContent,
            elem.attributes.getNamedItem("target-language")?.textContent,
            elem.attributes.getNamedItem("original").textContent
        );
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
}

export class Group extends BaseElement {
    id: string;
    path: string[];
    groups: Group[];
    units: Unit[];
    isRoot: boolean;

    constructor(id: string, isRoot = false, path: string[] = [], groups: Group[] = [], units: Unit[] = [], metadata: NamedNodeMap = null) {
        super(metadata);
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
        return new Group(this.id, this.isRoot, [...this.path], this.groups.map(e => e.clone()), this.units.map(e => e.clone()), this.metadata);
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
}

export class Unit extends BaseElement {
    path: string[];
    id: string;
    source: string;
    target: string;
    notes: Note[];
    contextGroups: ContextGroup[];

    constructor(id: string, source: string, target: string, path: string[], notes: Note[], contextGroups: ContextGroup[] = [], metadata: NamedNodeMap = null) {
        super(metadata);
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
        return new Unit(this.id, this.source, this.target, [...this.path], [...this.notes], [...this.contextGroups], this.metadata);
    }

    getNotes() {
        return this.notes.sort((a, b) => a.priority - b.priority);
    }

    getTranslationStatus(): TranslationStatus {
        if(this.metadata["approved"]?.textContent == "no") return TranslationStatuses.NOT_APPROVED;
        if(this.metadata["approved"]?.textContent == "yes") return TranslationStatuses.TRANSLATED;
        return this.target == "" ? TranslationStatuses.UNTRANSLATED : TranslationStatuses.TRANSLATED;
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
}

export type NoteAnnotateType = "source" | "target" | "general";

export class Note extends BaseElement {
    from: string;
    content: string;
    priority: number;
    annotates: NoteAnnotateType;
    constructor(from: string, content: string, priority = 0, annotates: NoteAnnotateType = "general", metadata: NamedNodeMap = null) {
        super(metadata);
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

    clone() {
        return new Note(`${this.from}`, `${this.content}`, this.priority, this.annotates, this.metadata);
    }
}

export const TranslationStatuses = {
    UNTRANSLATED: {
        text: "Not translated",
        color: "#999"
    } as TranslationStatus,
    NOT_APPROVED: {
        text: "Not approved",
        color: "#CC7700"
    } as TranslationStatus,
    TRANSLATED: {
        text: "Translated",
        color: "var(--highlight-color)"
    } as TranslationStatus
}

export type TranslationStatus = {
    text: string,
    color: string
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

export class Context extends BaseElement {
    type: ContextType;
    content: string

    constructor(content: string, type: ContextType, metadata: NamedNodeMap = null) {
        super(metadata);
        this.content = content;
        this.type = type;
    }

    static import(elem: Element) {
        return new Context(elem.textContent, elem.getAttribute("context-type") as ContextType, elem.attributes);
    }
}

export class ContextGroup extends BaseElement {
    purpose: ContextGroupPurpose;
    contexts: Context[];

    constructor(purpose: ContextGroupPurpose, contexts: Context[] = [], metadata: NamedNodeMap = null) {
        super(metadata);
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

    clone() {
        let newContext = [];
        for(let context of this.contexts) {
            newContext.push(new Context(context.content, context.type, context.metadata))
        }
        return new ContextGroup(this.purpose, newContext, this.metadata);
    }
}

export class InternalFile extends BaseElement {
    path: string;
    form: string;
    crc: string;

    constructor(path: string, form: string, crc: string, metadata: NamedNodeMap = null) {
        super(metadata);
        this.path = path;
        this.form = form;
        this.crc = crc;
    }

    static import(elem: Element): InternalFile {
        return new InternalFile(elem.textContent, elem.getAttribute("form"), elem.getAttribute("crc"), elem.attributes);
    }
}

export class ExternalFile extends BaseElement {
    href: string;
    uid: string;
    crc: string;

    constructor(href: string, uid: string, crc: string, metadata: NamedNodeMap = null) {
        super(metadata);
        this.href = href;
        this.uid = uid;
        this.crc = crc;
    }

    static import(elem: Element): ExternalFile {
        return new ExternalFile(elem.getAttribute("href"), elem.getAttribute("uid"), elem.getAttribute("crc"), elem.attributes);
    }
}

export abstract class InternalExternalFile extends BaseElement {
    internalFile: InternalFile;
    externalFile: ExternalFile;

    constructor(internalFile: InternalFile, externalFile: ExternalFile, metadata: NamedNodeMap = null) {
        super(metadata);
        this.internalFile = internalFile;
        this.externalFile = externalFile;
    }
}

export class Skl extends InternalExternalFile {
    constructor(internalFile: InternalFile, externalFile: ExternalFile, metadata: NamedNodeMap = null) {
        super(internalFile, externalFile, metadata);
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
    constructor(internalFile: InternalFile, externalFile: ExternalFile, metadata: NamedNodeMap = null) {
        super(internalFile, externalFile, metadata);
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
    constructor(internalFile: InternalFile, externalFile: ExternalFile, metadata: NamedNodeMap = null) {
        super(internalFile, externalFile, metadata);
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

export class Header extends BaseElement {
    skl: Skl;
    glossaries: Glossary[];
    references: Reference[];
    notes: Note[];
    constructor(skl: Skl, glossaries: Glossary[], references: Reference[], notes: Note[], metadata: NamedNodeMap = null) {
        super(metadata);
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
}