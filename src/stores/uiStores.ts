import { get, writable } from "svelte/store";
import { DialogProperty, Toast } from "../utils/types";
export const activeToasts = writable([]);
export const activeDialog = writable<DialogProperty[]>([]);
export const activeTooltip = writable(null);

export function openDialog(dialog: DialogProperty): void {
    get(activeDialog).push(dialog);
    activeDialog.set(get(activeDialog));
}

export function closeDialog(): void {
    get(activeDialog).pop();
    activeDialog.set(get(activeDialog));
}

export function addToast(content: string, type: string, duration: number): void {
    let toasts = get(activeToasts);
    toasts.push(new Toast(content, type, duration));
    activeToasts.set(toasts);
}