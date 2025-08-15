import { browser } from "$app/environment";

export type SupportedLanguage =
  | "default"
  | "en"
  | "pt"
  | "it"
  | "fr"
  | "es"
  | "de"
  | "nl"
  | "ja"
  | "hi"
  | "uk"
  | "pt-BR"
  | "ca"
  | "fi"
  | "ko"
  | "lb"
  | "nb"
  | "pl"
  | "ru"
  | "zh-Hans"
  | "zh-Hant"
  | "sv"
  | "th"
  | "tr";

interface LanguageState {
  current: SupportedLanguage;
  currentStrings: Record<string, any>;
  currentLocale: string;
}

// Initialize language state
const languageState = $state<LanguageState>({
  current: "zh-Hans",
  currentStrings: {},
  currentLocale: "zh-Hans",
});

// Helper functions
function saveLanguage(language: SupportedLanguage) {
  if (!browser) return;
  localStorage.setItem("language", language);
}

function loadLanguage(): SupportedLanguage {
  if (!browser) return "zh-Hans";

  const stored = localStorage.getItem("language") as SupportedLanguage;

  // Migrate "default" to "zh-Hans" for UI language
  if (stored === "default") {
    localStorage.setItem("language", "zh-Hans");
    return "zh-Hans";
  }

  return stored || "zh-Hans";
}

// Load locale data from API
async function loadLocaleData(lang: string) {
  if (!browser) return;

  try {
    const response = await fetch(`/api/locale/${lang}`);
    if (response.ok) {
      const data = await response.json();
      languageState.currentStrings = data.strings;
      languageState.currentLocale = data.locale;
    }
  } catch (error) {
    console.warn("Failed to load locale data:", error);
  }
}

function applyLanguage(language: SupportedLanguage) {
  if (!browser) return;

  // Set document language
  if (language !== "default") {
    document.documentElement.lang = language;
  } else {
    // Use simplified Chinese as default instead of browser default
    document.documentElement.lang = "zh-Hans";
  }

  // Dispatch language change event
  window.dispatchEvent(
    new CustomEvent("language-changed", {
      detail: { language },
    }),
  );
}

// Language store API
export const language = {
  get current() {
    return languageState.current;
  },

  get currentStrings() {
    return languageState.currentStrings;
  },

  set(language: SupportedLanguage) {
    languageState.current = language;
    applyLanguage(language);
    saveLanguage(language);
  },

  init() {
    if (!browser) return;

    const storedLanguage = loadLanguage();
    languageState.current = storedLanguage;
    applyLanguage(storedLanguage);
  },

  initStrings(initialStrings: Record<string, any>) {
    if (!browser) return;

    // Initialize with page data
    languageState.currentStrings = initialStrings;
    languageState.currentLocale = "en";

    // Watch for language changes
    $effect(() => {
      const lang = languageState.current;
      const targetLang =
        lang === "default" ? navigator.language.split("-")[0] : lang;

      if (targetLang !== languageState.currentLocale) {
        loadLocaleData(targetLang);
      }
    });
  },
};
