import { getSecondaryReaderDocument } from '../../utils/getSplitWindow'
import { setPref } from '../../utils/prefs'

export function switchTheme(
  // eslint-disable-next-line @typescript-eslint/ban-types
  theme: Exclude<string & {}, 'dark' | 'light'> | 'dark' | 'light',
) {
  const main = window.document.querySelector('#main-window')

  if (main) {
    main.setAttribute('theme', theme)
  }

  const readers = Zotero.Reader._readers
  for (const reader of readers) {
    const secondDoc = getSecondaryReaderDocument(reader)
    for (const doc of [reader?._iframeWindow?.document, secondDoc]) {
      const html = doc?.querySelector('html')

      ztoolkit.log(html)
      html?.setAttribute('theme', theme)
    }
  }

  setPref('current_theme', theme)
}
