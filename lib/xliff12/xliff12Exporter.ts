import { Context, ContextGroup, ExternalFile, Group, Header, InternalExternalFile, InternalFile, Note, TranslationMatch, Unit, type TranslationFile } from '../types';

export function exportXliff12(files: TranslationFile[]) {
    let xliffVersion = "1.2";
    const namespace = `urn:oasis:names:tc:xliff:document:${xliffVersion}`;

    let xml = document.implementation.createDocument(null, null);   
    xml.appendChild(xml.createProcessingInstruction("xml", 'version="1.0" encoding="UTF-8"'));
    let xliffElement = xml.createElementNS(namespace, "xliff");
    xliffElement.setAttribute("version", xliffVersion);
    xliffElement.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
    xliffElement.setAttribute("xsi:schemaLocation", "urn:oasis:names:tc:xliff:document:1.2 xliff-core-1.2.xsd");

    for(let file of files) {
        xliffElement.appendChild(exportTranslationFile(file, xml, xliffElement));    
    }

    xml.appendChild(xliffElement);
    return xml;
}

export function escapeXml(unsafe: string) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

function createXmlElement(name: string, xml: XMLDocument, xliffElement: Element, attributes: NamedNodeMap) {
    let elem = xml.createElementNS(xliffElement.namespaceURI, name);
    insertAttribute(elem, attributes as NamedNodeMap);
    return elem;
}

function insertAttribute(element: Element, attributes: NamedNodeMap) {
    if(attributes != null) {
        for(let i = 0; i < attributes.length; i++) {
            let itm = attributes.item(i);
            element.setAttribute(itm.name, itm.value);
        }
    }
}

function exportTranslationFile(data: TranslationFile, xml: XMLDocument, xliffElement: Element) {
    let elem = createXmlElement("file", xml, xliffElement, data.metadata);

    elem.setAttribute("source-language", data.sourceLanguage);
    if(data.targetLanguage != null) elem.setAttribute("target-language", data.targetLanguage);
    if(!elem.hasAttribute("original")) elem.setAttribute("original", data.filename);

    if(data.header != null) {
        elem.appendChild(exportHeader(data.header, xml, xliffElement));
    }

    let body = xml.createElementNS(xliffElement.namespaceURI, "body");

    for(let group of data.rootGroup.groups) {
        body.appendChild(exportGroup(group, xml, xliffElement));
    }

    for(let unit of data.rootGroup.units) {
        body.appendChild(exportUnit(unit, xml, xliffElement))
    }

    elem.appendChild(body);
    return elem;
}

function exportUnit(data: Unit, xml: XMLDocument, xliffElement: Element): Element {
    let elem = createXmlElement("trans-unit", xml, xliffElement, data.metadata);

    // Export our version of attribute
    elem.setAttribute("id", data.id);

    let srcElement = xml.createElementNS(xliffElement.namespaceURI, "source");
    srcElement.textContent = escapeXml(data.source);
    elem.appendChild(srcElement);

    let targetElement = xml.createElementNS(xliffElement.namespaceURI, "target");
    targetElement.textContent = escapeXml(data.target);
    elem.appendChild(targetElement);

    for(let note of data.notes) {
        elem.appendChild(exportNote(note, xml, xliffElement));
    }

    for(let contextGrp of data.contextGroups) {
        elem.appendChild(exportContextGroup(contextGrp, xml, xliffElement));
    }

    for(let match of data.matches) {
        elem.appendChild(exportMatch(match, xml, xliffElement));
    }

    return elem;
}

function exportMatch(data: TranslationMatch, xml: XMLDocument, xliffElement: Element): Element {
    let elem = createXmlElement("alt-trans", xml, xliffElement, data.metadata);

    let srcElement = xml.createElementNS(xliffElement.namespaceURI, "source");
    srcElement.textContent = escapeXml(data.source);
    elem.appendChild(srcElement);

    let targetElement = xml.createElementNS(xliffElement.namespaceURI, "target");
    targetElement.textContent = escapeXml(data.target);
    elem.appendChild(targetElement);

    for(let note of data.notes) {
        elem.appendChild(exportNote(note, xml, xliffElement));
    }

    for(let contextGrp of data.contextGroups) {
        elem.appendChild(exportContextGroup(contextGrp, xml, xliffElement));
    }

    return elem;
}

function exportGroup(data: Group, xml: XMLDocument, xliffElement: Element): Element {
    let elem = createXmlElement("group", xml, xliffElement, data.metadata);

    elem.setAttribute("id", data.id);

    for(let subgroup of data.groups) {
        elem.appendChild(exportGroup(subgroup, xml, xliffElement));
    }
    
    for(let unit of data.units) {
        elem.appendChild(exportUnit(unit, xml, xliffElement));
    }
    return elem;
}

function exportNote(data: Note, xml: XMLDocument, xliffElement: Element): Element {
    let elem = createXmlElement("note", xml, xliffElement, data.metadata);

    if(data.from) elem.setAttribute("from", escapeXml(data.from));
    if(data.priority != 0) elem.setAttribute("priority", data.priority.toString());
    if(data.annotates != "general") elem.setAttribute("annotates", data.annotates);
    elem.textContent = escapeXml(data.content);

    return elem;
}

function exportContextGroup(data: ContextGroup, xml: XMLDocument, xliffElement: Element): Element {
    let elem = createXmlElement("context-group", xml, xliffElement, data.metadata);
    elem.setAttribute("purpose", data.purpose);

    for(let context of data.contexts) {
        elem.appendChild(exportContext(context, xml, xliffElement));
    }

    return elem;
}

function exportContext(data: Context, xml: XMLDocument, xliffElement: Element): Element {
    let elem = createXmlElement("context", xml, xliffElement, data.metadata);

    elem.setAttribute("context-type", data.type);
    elem.textContent = escapeXml(data.content);

    return elem;
}

function exportHeader(data: Header, xml: XMLDocument, xliffElement: Element): Element {
    let elem = createXmlElement("header", xml, xliffElement, data.metadata);

    if(data.skl != null) {
        elem.appendChild(exportInternalExternalFile("skl", data.skl, xml, xliffElement));
    }

    for(let glossary of data.glossaries) {
        elem.appendChild(exportInternalExternalFile("glossary", glossary, xml, xliffElement));
    }
    
    for(let reference of data.references) {
        elem.appendChild(exportInternalExternalFile("reference", reference, xml, xliffElement));
    }

    for(let note of data.notes) {
        elem.appendChild(exportNote(note, xml, xliffElement));
    }

    return elem;
}

function exportInternalExternalFile(name: string, data: InternalExternalFile, xml: XMLDocument, xliffElement: Element): Element {
    let elem = createXmlElement(name, xml, xliffElement, data.metadata);

    if(data.internalFile != null) {
        elem.appendChild(exportInternalFile(data.internalFile, xml, xliffElement));
    }
    
    if(data.externalFile != null) {
        elem.appendChild(exportExternalFile(data.externalFile, xml, xliffElement));
    }

    return elem;
}

function exportInternalFile(data: InternalFile, xml: XMLDocument, xliffElement: Element): Element {
    let elem = createXmlElement("internal-file", xml, xliffElement, data.metadata);

    elem.textContent = data.path;
    if(data.form != null) {
        elem.setAttribute("form", data.form);
    }
    if(data.crc != null) {
        elem.setAttribute("crc", data.crc);
    }

    return elem;
}

function exportExternalFile(data: ExternalFile, xml: XMLDocument, xliffElement: Element): Element {
    let elem = createXmlElement("external-file", xml, xliffElement, data.metadata);

    elem.setAttribute("href", data.href);
    if(data.uid != null) {
        elem.setAttribute("uid", data.uid);
    }
    if(data.crc != null) {
        elem.setAttribute("crc", data.crc);
    }

    return elem;
}