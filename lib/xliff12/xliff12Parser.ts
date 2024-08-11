import { TranslationFile as TranslationFile } from '../types';

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
        return parseInternal(filename.split(".").slice(0, -1).join("."), xliffElement, xliffVersion);
    }
}

function parseInternal(filename: string, xlfElement: Element, xlfVersion: string): TranslationFile[] {
    let xliffFiles: TranslationFile[] = [];
    
    if(parseFloat(xlfVersion) <= 1.2) {
        for(let fileElement of xlfElement.getElementsByTagName("file")) {
            xliffFiles.push(TranslationFile.import(fileElement, filename));
        }
    }

    console.log(xliffFiles);
    return xliffFiles;
}