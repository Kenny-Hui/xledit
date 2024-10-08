import { writable } from "svelte/store";

const defaultSettings = {
    langSelect: {
        displayName: 'name',
        displayMode: 'both'
    },
    editPane: {
        translator: "GOOGLE_TRANSLATE",
        noteAuthor: "author"
    },
    export: {
        useTab: true,
        stripEmptyTarget: true,
        spaceChar: 2,
        filename: 'xledit'
    },
    appearance: {
        color: 'blue'
    }
}

export const preferences = writable(Object.assign(defaultSettings, JSON.parse(localStorage.getItem("preference")) ?? {}));

preferences.subscribe((val) => {
    localStorage.setItem("preference", JSON.stringify(val));
});