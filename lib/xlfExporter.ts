import type { TranslationFile } from './types';

export function exportXliff(files: TranslationFile[]) {
    let xliffVersion = files[0].version;  // TODO: We should be able to configure what format to be exported
    const namespace = `urn:oasis:names:tc:xliff:document:${xliffVersion}`;

    let xml = document.implementation.createDocument(null, null);   
    xml.appendChild(xml.createProcessingInstruction("xml", 'version="1.0" encoding="UTF-8"'));
    let xliffElement = xml.createElementNS(namespace, "xliff");
    xliffElement.setAttribute("version", xliffVersion);

    if(xliffVersion == "1.2") {
        xliffElement.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
        xliffElement.setAttribute("xsi:schemaLocation", "urn:oasis:names:tc:xliff:document:1.2 xliff-core-1.2.xsd");
    }

    for(let file of files) {
        xliffElement.appendChild(file.export(xml, xliffElement));    
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