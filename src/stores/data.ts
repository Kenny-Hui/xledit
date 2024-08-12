import { get, writable, type Writable } from "svelte/store";
import { Project } from "../utils/types";
import { TranslationFile, Unit } from "../../lib/types";

export const projects = writable(new Project("Untitled"));
export const selectedUnit: Writable<Unit> = writable();
export const selectedFile: Writable<TranslationFile> = writable(null);

export function getDerivedFiles(file: TranslationFile) {
  return get(projects).files.filter(
    (e) =>
      e == file ||
      (file.targetLanguage ?? file.sourceLanguage) === e.sourceLanguage,
  );
}
