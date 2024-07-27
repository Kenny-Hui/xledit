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
        spaceChar: 2
    }
}

const state = {
    selectedTab: 0
}

export const preferences = writable(JSON.parse(localStorage.getItem("preference")) ?? defaultSettings);
export const states = writable(JSON.parse(localStorage.getItem("state")) ?? state);

preferences.subscribe((val) => {
    localStorage.setItem("preference", JSON.stringify(val));
});

states.subscribe((val) => {
    localStorage.setItem("state", JSON.stringify(val));
});