import { parseXliff12 } from "./xliff12/xliff12Parser";
import { exportXliff12 } from "./xliff12/xliff12Exporter";
import { parseMinecraft } from "./minecraft/mcParser";
import { exportMinecraft } from "./minecraft/mcExporter";

interface ImportFunction {
  (filename: string, data: string): TranslationFile[];
}

interface ExportFunction {
  (files: TranslationFile[]): any;
}

export type TranslationFormat = {
  name: string;
  extension: string;
  import: ImportFunction;
  export: ExportFunction;
};

export const TranslationFormats = {
  XLIFF12: {
    name: "XLIFF 1.2 (.xlf)",
    extension: ".xlf",
    import: parseXliff12,
    export: exportXliff12,
  } as TranslationFormat,
  MINECRAFT: {
    name: "Minecraft (.json)",
    extension: ".json",
    import: parseMinecraft,
    export: exportMinecraft,
  } as TranslationFormat,
};

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
  isSource: boolean;
  sourceLanguage: string;
  targetLanguage: string | null;

  constructor(
    header: Header,
    filename: string,
    sourceLanguage: string,
    targetLanguage: string | null,
    metadata: NamedNodeMap = null,
  ) {
    super(metadata);
    this.header = header;
    this.filename = filename;
    this.sourceLanguage = sourceLanguage;
    this.targetLanguage = targetLanguage;
    this.isSource =
      this.targetLanguage == null || this.sourceLanguage == this.targetLanguage;
    this.rootGroup = new Group("Root", true, []);
  }
}

export class Group extends BaseElement {
  id: string;
  path: string[];
  groups: Group[];
  units: Unit[];
  isRoot: boolean;

  constructor(
    id: string,
    isRoot = false,
    path: string[] = [],
    groups: Group[] = [],
    units: Unit[] = [],
    metadata: NamedNodeMap = null,
  ) {
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
    return new Group(
      this.id,
      this.isRoot,
      [...this.path],
      this.groups.map((e) => e.clone()),
      this.units.map((e) => e.clone()),
      this.metadata,
    );
  }
}

export class Unit extends BaseElement {
  path: string[];
  id: string;
  source: Source;
  target: Target;
  notes: Note[];
  contextGroups: ContextGroup[];
  matches: TranslationMatch[];

  constructor(
    id: string,
    source: Source,
    target: Target,
    path: string[],
    notes: Note[],
    contextGroups: ContextGroup[] = [],
    matches: TranslationMatch[] = [],
    metadata: NamedNodeMap = null,
  ) {
    super(metadata);
    this.id = id;
    this.source = source;
    this.target = target;
    this.path = path;
    this.notes = notes;
    this.contextGroups = contextGroups;
    this.matches = matches;
  }

  getFullPath() {
    return this.path.concat([this.id]);
  }

  getFullPathStr() {
    return this.getFullPath().join("/");
  }

  clone() {
    return new Unit(
      this.id,
      this.source.clone(),
      this.target.clone(),
      [...this.path],
      [...this.notes],
      [...this.contextGroups],
      [...this.matches],
      this.metadata,
    );
  }

  getNotes() {
    return this.notes.sort((a, b) => a.priority - b.priority);
  }

  getTranslationStatus(): TranslationStatus {
    if (this.metadata["approved"]?.textContent == "no")
      return TranslationStatuses.NOT_APPROVED;
    if (this.metadata["approved"]?.textContent == "yes")
      return TranslationStatuses.TRANSLATED;
    return this.target.text == ""
      ? TranslationStatuses.UNTRANSLATED
      : TranslationStatuses.TRANSLATED;
  }
}

export class Source extends BaseElement {
  text: string;

  constructor(text: string, metadata: NamedNodeMap = null) {
    super(metadata);
    this.text = text;
  }

  clone() {
    return new Source(this.text, this.metadata);
  }
}

export class Target extends BaseElement {
  text: string;

  constructor(text: string, metadata: NamedNodeMap = null) {
    super(metadata);
    this.text = text;
  }

  clone() {
    return new Source(this.text, this.metadata);
  }
}

export class TranslationMatch extends BaseElement {
  source: string;
  target: string;
  notes: Note[];
  contextGroups: ContextGroup[];

  constructor(
    source: string,
    target: string,
    notes: Note[],
    contextGroups: ContextGroup[] = [],
    metadata: NamedNodeMap = null,
  ) {
    super(metadata);
    this.source = source;
    this.target = target;
    this.notes = notes;
    this.contextGroups = contextGroups;
  }
}

export type NoteAnnotateType = "source" | "target" | "general";

export class Note extends BaseElement {
  from: string;
  content: string;
  priority: number;
  annotates: NoteAnnotateType;
  constructor(
    from: string,
    content: string,
    priority = 0,
    annotates: NoteAnnotateType = "general",
    metadata: NamedNodeMap = null,
  ) {
    super(metadata);
    this.from = from;
    this.content = content;
    this.priority = priority;
    this.annotates = annotates;
  }

  clone() {
    return new Note(
      `${this.from}`,
      `${this.content}`,
      this.priority,
      this.annotates,
      this.metadata,
    );
  }
}

export const TranslationStatuses = {
  UNTRANSLATED: {
    text: "Not translated",
    color: "#999",
  } as TranslationStatus,
  NOT_APPROVED: {
    text: "Not approved",
    color: "#CC7700",
  } as TranslationStatus,
  TRANSLATED: {
    text: "Translated",
    color: "var(--highlight-color)",
  } as TranslationStatus,
};

export type TranslationStatus = {
  text: string;
  color: string;
};

export enum ContextType {
  database = "database",
  element = "element",
  elementtitle = "elementtitle",
  linenumber = "linenumber",
  numparams = "numparams",
  paramnotes = "paramnotes",
  record = "record",
  recordtitle = "recordtitle",
  sourcefile = "sourcefile",
}

export enum ContextGroupPurpose {
  information = "information",
  location = "location",
  match = "match",
}

export class Context extends BaseElement {
  type: ContextType;
  content: string;

  constructor(
    content: string,
    type: ContextType,
    metadata: NamedNodeMap = null,
  ) {
    super(metadata);
    this.content = content;
    this.type = type;
  }
}

export class ContextGroup extends BaseElement {
  purpose: ContextGroupPurpose;
  contexts: Context[];

  constructor(
    purpose: ContextGroupPurpose,
    contexts: Context[] = [],
    metadata: NamedNodeMap = null,
  ) {
    super(metadata);
    this.purpose = purpose;
    this.contexts = contexts;
  }

  clone() {
    let newContext = [];
    for (let context of this.contexts) {
      newContext.push(
        new Context(context.content, context.type, context.metadata),
      );
    }
    return new ContextGroup(this.purpose, newContext, this.metadata);
  }
}

export class InternalFile extends BaseElement {
  path: string;
  form: string;
  crc: string;

  constructor(
    path: string,
    form: string,
    crc: string,
    metadata: NamedNodeMap = null,
  ) {
    super(metadata);
    this.path = path;
    this.form = form;
    this.crc = crc;
  }
}

export class ExternalFile extends BaseElement {
  href: string;
  uid: string;
  crc: string;

  constructor(
    href: string,
    uid: string,
    crc: string,
    metadata: NamedNodeMap = null,
  ) {
    super(metadata);
    this.href = href;
    this.uid = uid;
    this.crc = crc;
  }
}

export abstract class InternalExternalFile extends BaseElement {
  internalFile: InternalFile;
  externalFile: ExternalFile;

  constructor(
    internalFile: InternalFile,
    externalFile: ExternalFile,
    metadata: NamedNodeMap = null,
  ) {
    super(metadata);
    this.internalFile = internalFile;
    this.externalFile = externalFile;
  }
}

export class Skl extends InternalExternalFile {
  constructor(
    internalFile: InternalFile,
    externalFile: ExternalFile,
    metadata: NamedNodeMap = null,
  ) {
    super(internalFile, externalFile, metadata);
  }
}

export class Glossary extends InternalExternalFile {
  constructor(
    internalFile: InternalFile,
    externalFile: ExternalFile,
    metadata: NamedNodeMap = null,
  ) {
    super(internalFile, externalFile, metadata);
  }
}

export class Reference extends InternalExternalFile {
  constructor(
    internalFile: InternalFile,
    externalFile: ExternalFile,
    metadata: NamedNodeMap = null,
  ) {
    super(internalFile, externalFile, metadata);
  }
}

export class Header extends BaseElement {
  skl: Skl;
  glossaries: Glossary[];
  references: Reference[];
  notes: Note[];
  constructor(
    skl: Skl,
    glossaries: Glossary[],
    references: Reference[],
    notes: Note[],
    metadata: NamedNodeMap = null,
  ) {
    super(metadata);
    this.skl = skl;
    this.glossaries = glossaries;
    this.references = references;
    this.notes = notes;
  }
}
