<script lang="ts">
  import { s } from "$lib/client/localization.svelte";
  import Select from "$lib/components/Select.svelte";
  import { theme, type ThemeOption } from "$lib/stores/theme.svelte.js";

  // Theme options
  const themeOptions = $derived([
    { value: "system", label: s("settings.theme.system") || "System" },
    { value: "light", label: s("settings.theme.light") || "Light" },
    { value: "dark", label: s("settings.theme.dark") || "Dark" },
  ]);
</script>

<Select
  value={theme.current as string}
  options={themeOptions}
  label={s("settings.theme.label") || "Theme"}
  onChange={(value: string) => theme.set(value as ThemeOption)}
/>
