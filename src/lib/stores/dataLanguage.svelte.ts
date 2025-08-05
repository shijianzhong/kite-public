import { browser } from "$app/environment";
import type { SupportedLanguage } from "./language.svelte";

interface DataLanguageState {
  current: SupportedLanguage;
}

// Initialize data language state
const dataLanguageState = $state<DataLanguageState>({
  current: "default",
});

// Helper functions
function saveDataLanguage(language: SupportedLanguage) {
  if (!browser) return;
  localStorage.setItem("dataLanguage", language);
}

function loadDataLanguage(): SupportedLanguage {
  if (!browser) return "default";

  const stored = localStorage.getItem("dataLanguage") as SupportedLanguage;
  return stored || "default";
}

// Data language store API
export const dataLanguage = {
  get current() {
    return dataLanguageState.current;
  },

  set(language: SupportedLanguage) {
    dataLanguageState.current = language;
    saveDataLanguage(language);

    // Dispatch data language change event
    if (browser) {
      window.dispatchEvent(
        new CustomEvent("data-language-changed", {
          detail: { language },
        }),
      );
    }
  },

  init() {
    if (!browser) return;

    const storedLanguage = loadDataLanguage();
    dataLanguageState.current = storedLanguage;
  },
};
