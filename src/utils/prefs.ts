import { config } from '../../package.json'
import { filtersByIDSchema, filtersSchema } from '../modules/ui/types.js'
import { z } from 'zod'
// import { themesSchema } from '../modules/ThemeRepository/themeSchema'
import { defaultFilters } from '../modules/ui/defaultFilters.js'

export const prefsSchema = {
  current_theme: z.enum(['light', 'dark']),
  // themes: themesSchema,
  default_pdf_filter: z.string(),
  filters: filtersSchema,
  filters_by_id: filtersByIDSchema,
} as const

export type Prefs = {
  [key in keyof typeof prefsSchema]: z.infer<(typeof prefsSchema)[key]>
}

export const defaultPrefs: Prefs = {
  current_theme: 'dark',
  // themes: {},
  default_pdf_filter: 'none',
  filters: defaultFilters,
  filters_by_id: {},
}

/**
 * Get preference value.
 * Wrapper of `Zotero.Prefs.get`.
 * @param key
 */
export function getPref<K extends keyof typeof prefsSchema>(key: K): Prefs[K] {
  const pref = Zotero.Prefs.get(`${config.prefsPrefix}.${key}`, true)

  if (pref == null) {
    setPref(key, defaultPrefs[key])
    return defaultPrefs[key]
  }

  if (typeof pref !== 'string') {
    throw new Error(`Invalid pref type: ${typeof pref}`)
  }

  ztoolkit.log(`Getting pref ${key} with value ${pref}`, prefsSchema)
  if (pref.at(0) !== '{' && pref.at(0) !== '[') {
    return pref as Prefs[K]
  }
  try {
    const parsedPref = JSON.parse(pref)

    return parsedPref
  } catch (e) {
    ztoolkit.log(e)
    return pref as Prefs[K]
  }
}

/**
 * Set preference value.
 * Wrapper of `Zotero.Prefs.set`.
 * @param key
 * @param value
 */
export function setPref<K extends keyof Prefs>(key: K, value: Prefs[K]) {
  try {
    ztoolkit.log(`Setting pref ${key} to ${JSON.stringify(value)}`, prefsSchema)
    const parsedPref = prefsSchema[key].parse(value)

    const pref =
      typeof parsedPref === 'string' ? parsedPref : JSON.stringify(parsedPref)

    return Zotero.Prefs.set(
      `${config.prefsPrefix}.${key}`,
      pref,
      true,
    ) as Prefs[K]
  } catch (e) {
    ztoolkit.log(e)
    return value
  }
}

/**
 * Clear preference value.
 * Wrapper of `Zotero.Prefs.clear`.
 * @param key
 */
export function clearPref<K extends keyof Prefs>(key: K) {
  return Zotero.Prefs.clear(`${config.prefsPrefix}.${key}`, true)
}
