import {
  Context,
  ContextGroup,
  ContextGroupPurpose,
  ContextType,
  ExternalFile,
  Glossary,
  Group,
  Header,
  InternalFile,
  Note,
  Reference,
  Skl,
  Source,
  Target,
  TranslationFile as TranslationFile,
  TranslationMatch,
  Unit,
  type NoteAnnotateType,
} from "../types";

export function parseXliff12(
  filename: string,
  data: string,
): TranslationFile[] {
  let parser = new DOMParser();
  let xml: Document;
  xml = parser.parseFromString(data, "text/xml");
  if (xml.querySelector("parsererror")) {
    //Error while parsing XML
    throw Error(xml.querySelector("parsererror").textContent);
  }

  let xliffElement = xml.querySelector("xliff");
  if (xliffElement == null) {
    throw Error("No XLIFF tag");
  }

  let xliffVersion = xliffElement.getAttribute("version");

  if (parseFloat(xliffVersion) > 1.2) {
    console.warn(`XLEdit: XLIFF version is newer than 1.2`);
    throw Error(`XLIFF Version ${xliffVersion} is not as anticipated.`);
  }

  let xliffFiles: TranslationFile[] = [];

  for (let fileElement of xliffElement.getElementsByTagName("file")) {
    xliffFiles.push(parseFile(fileElement, filename));
  }

  return xliffFiles;
}

function parseFile(elem: Element, filename: string) {
  let header =
    elem.querySelector("header") != null
      ? parseHeader(elem.querySelector("header"))
      : null;
  let file = new TranslationFile(
    header,
    filename,
    elem.attributes.getNamedItem("source-language").textContent,
    elem.attributes.getNamedItem("target-language")?.textContent,
    elem.attributes,
  );
  let body = elem.getElementsByTagName("body")[0];

  for (let el of body.children) {
    if (el.nodeName === "group") {
      file.rootGroup.groups.push(parseGroup(el));
    }

    if (el.nodeName === "trans-unit") {
      let unit = parseUnit([], el);
      file.rootGroup.units.push(unit);
    }
  }
  return file;
}

function parseGroup(elem: Element, path: string[] = null) {
  let thisGroupId = elem.getAttribute("id");
  let thisGroup = new Group(thisGroupId);

  if (path == null) path = [thisGroup.id];
  thisGroup.path = path;

  let p = path;
  for (let element of elem.childNodes) {
    let e = element as Element;
    if (e.nodeName === "group") {
      path.push(e.getAttribute("id"));
      let subGroup = parseGroup(e, path);
      thisGroup.addGroup(subGroup);
    }

    if (e.nodeName === "trans-unit") {
      let unit = parseUnit(path, e);
      thisGroup.addUnit(unit);
    }
    path = [...p];
  }
  return thisGroup;
}

function parseUnit(path: string[], elem: Element) {
  /* Parse attribute */
  let unitId = elem.getAttribute("id");

  let source = parseSource(elem.getElementsByTagName("source")[0]);
  let target =
    parseTarget(elem.querySelector("target")) ?? new Target("", null);
  let notesElem = elem.getElementsByTagName("note");
  let contextGrpsElem = elem.getElementsByTagName("context-group");
  let notes = [];
  for (let note of notesElem) {
    notes.push(parseNote(note));
  }

  let contextGrps = [];

  for (let contextGrp of contextGrpsElem) {
    let contextGroup = parseContextGroup(contextGrp);
    contextGrps.push(contextGroup);
  }

  let matches = [];

  for (let match of elem.getElementsByTagName("alt-trans")) {
    matches.push(parseAltTrans(match));
  }

  return new Unit(
    unitId,
    source,
    target,
    path,
    notes,
    contextGrps,
    matches,
    elem.attributes,
  );
}

function parseSource(elem: Element) {
  return new Source(elem.textContent, elem.attributes);
}

function parseTarget(elem: Element) {
  if (elem == null) return null;
  return new Target(elem.textContent, elem.attributes);
}

function parseAltTrans(elem: Element) {
  let source = elem.getElementsByTagName("source")[0].textContent;
  let target = elem.getElementsByTagName("target")[0]?.textContent ?? "";
  let notesElem = elem.getElementsByTagName("note");
  let contextGrpsElem = elem.getElementsByTagName("context-group");
  let notes = [];
  for (let note of notesElem) {
    notes.push(parseNote(note));
  }

  let contextGrps = [];

  for (let contextGrp of contextGrpsElem) {
    let contextGroup = parseContextGroup(contextGrp);
    contextGrps.push(contextGroup);
  }

  return new TranslationMatch(
    source,
    target,
    notes,
    contextGrps,
    elem.attributes,
  );
}

function parseNote(elem: Element): Note {
  let from = elem.getAttribute("from");
  let content = elem.textContent;
  let priority = elem.getAttribute("priority") ?? "0";
  let annotates = (elem.getAttribute("annotates") ??
    "general") as NoteAnnotateType;
  return new Note(from, content, parseInt(priority), annotates);
}

function parseContextGroup(elem: Element) {
  let contexts = [];
  for (let contextElem of elem.getElementsByTagName("context")) {
    contexts.push(
      new Context(
        contextElem.textContent,
        contextElem.getAttribute("context-type") as ContextType,
        contextElem.attributes,
      ),
    );
  }

  return new ContextGroup(
    elem.getAttribute("purpose") as ContextGroupPurpose,
    contexts,
    elem.attributes,
  );
}

function parseHeader(elem: Element): Header {
  let skl;
  let glossaries = [];
  let references = [];
  let notes = [];

  if (elem.querySelector("skl") != null) {
    skl = parseSkl(elem.querySelector("skl"));
  }

  for (let glossary of elem.querySelectorAll("glossary")) {
    glossaries.push(parseGlossary(glossary));
  }

  for (let reference of elem.querySelectorAll("reference")) {
    references.push(parseReference(reference));
  }

  for (let note of elem.querySelectorAll("note")) {
    notes.push(parseNote(note));
  }

  return new Header(skl, glossaries, references, notes, elem.attributes);
}

function parseSkl(elem: Element) {
  let internalFile = null;
  let externalFile = null;
  if (elem.querySelector("internal-file") != null) {
    internalFile = parseInternalFile(elem.querySelector("internal-file"));
  }
  if (elem.querySelector("external-file") != null) {
    externalFile = parseExternalFile(elem.querySelector("external-file"));
  }
  return new Skl(internalFile, externalFile, elem.attributes);
}

function parseReference(elem: Element) {
  let internalFile = null;
  let externalFile = null;
  if (elem.querySelector("internal-file") != null) {
    internalFile = parseInternalFile(elem.querySelector("internal-file"));
  }
  if (elem.querySelector("external-file") != null) {
    externalFile = parseExternalFile(elem.querySelector("external-file"));
  }
  return new Reference(internalFile, externalFile, elem.attributes);
}

function parseGlossary(elem: Element) {
  let internalFile = null;
  let externalFile = null;
  if (elem.querySelector("internal-file") != null) {
    internalFile = parseInternalFile(elem.querySelector("internal-file"));
  }
  if (elem.querySelector("external-file") != null) {
    externalFile = parseExternalFile(elem.querySelector("external-file"));
  }
  return new Glossary(internalFile, externalFile, elem.attributes);
}

function parseInternalFile(elem: Element) {
  return new InternalFile(
    elem.textContent,
    elem.getAttribute("form"),
    elem.getAttribute("crc"),
    elem.attributes,
  );
}

function parseExternalFile(elem: Element) {
  return new ExternalFile(
    elem.getAttribute("href"),
    elem.getAttribute("uid"),
    elem.getAttribute("crc"),
    elem.attributes,
  );
}
