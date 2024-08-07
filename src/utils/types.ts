import { SvelteComponent, type ComponentType } from "svelte";
import { getISO639 } from "./util";
import { TranslationFile } from "../../lib/types";

export const FieldIndentStep = 15;
export const cjkRegex = /[\u4E00-\u9FFF]|[一-龯]/;

export class Project {
    name: string;
    files: TranslationFile[];

    constructor(name: string) {
        this.name = name;
        this.files = [];
    }
}

export type SearchQuery = {
    searchTerm: string,
    showTranslated: boolean,
    showUntranslated: boolean,
    showNumericOnly: boolean;
}

class Translator {
    name: string;
    url: string;
    mappings: string[][] = [];
    constructor(name: string, url: string, ...mappings: string[][]) {
        this.url = url;
        this.name = name;
        for(let mp of mappings) {
            this.mappings.push(mp);
        }
    }

    getURL(srcLang: string, targetLang: string, text: string) {
        let srclang = getISO639(srcLang);
        let targetlang = getISO639(targetLang);
        for(let mp of this.mappings) {
            if(mp[0] == srcLang) {
                srclang = mp[1];
            }
            if(mp[0] == targetLang) {
                targetlang = mp[1];
            }
        }

        return this.url.replace("{srcLang}", srcLang).replace("{targetLang}", targetlang).replace("{text}", text)
    }
}

export const Translators = {
    GOOGLE_TRANSLATE: new Translator("Google Translate", "https://translate.google.com/?sl=auto&tl={targetLang}&q={text}", ["zh-CN", "zh-CN"], ["zh-TW", "zh-TW"], ["zh-HK", "zh-TW"]),
    DEEPL_TRANSLATE: new Translator("DeepL Translate", "https://www.deepl.com/translator?#{srcLang}/{targetLang}/{text}"),
    YANDEX_TRANSLATE: new Translator("Yandex Translate", "https://translate.yandex.com/?source_lang={srcLang}&target_lang={targetLang}&text={text}")
} as const;

export class DialogProperty {
    component: typeof SvelteComponent;
    data: any;
    callback: Function;

    constructor(component: ComponentType, data: any = null, callback: Function = null) {
        this.component = component;
        this.data = data;
        this.callback = callback;
    }
}

export class Toast {
    duration: number;
    type: string;
    content: string;

    constructor(content: string, type: string, duration: number) {
        this.content = content;
        this.type = type;
        this.duration = duration;
    }
}

export type ExportOptions = {
    useTab: boolean,
    stripEmptyTarget: true,
    spaceChar: number,
    filename: 'xledit'
}

export const shortHandedLang = {
    'English (United States)': 'English (US)',
    'English (United Kingdom)': 'English (UK)',
    '中文（中國香港特別行政區）': '中文（香港）'
}