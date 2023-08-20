import { getSecondaryReaderDocument } from '../../utils/getSplitWindow'
import { prefsSchema, setPref } from '../../utils/prefs'
import { config } from '../../../package.json'
import { z } from 'zod'
import { sleep } from '../../utils/wait'

const TRANSITION_ID = '_temp-transition-styles' as const
function addTransitionCSS(element: HTMLElement) {
  ztoolkit.UI.appendElement(
    {
      tag: 'style',
      attributes: {
        id: TRANSITION_ID,
      },
      properties: {
        textContent: `* { transition: all 0.5s ease-in-out !important; }`,
      },
    },
    element,
  )
}

function removeTransitionCSS(doc: Document) {
  const transition = doc.querySelector(`#${TRANSITION_ID}`)
  if (transition) {
    transition.remove()
  }
}

function switchButtonIcon(theme: z.infer<typeof prefsSchema.current_theme>) {
  const button = window.document.querySelector(`#${config.buttonId}`)
  if (button) {
    button.textContent = config.themes[theme].icon
  }
}

export function switchTheme(theme: z.infer<typeof prefsSchema.current_theme>) {
  addTransitionCSS(window.document.querySelector('#main-window')!)
  window.document.querySelector('#main-window')?.setAttribute('theme', theme)
  sleep(1000).then(() => {
    removeTransitionCSS(window.document)
  })

  switchButtonIcon(theme)

  const readers = Zotero.Reader._readers
  for (const reader of readers) {
    const secondDoc = getSecondaryReaderDocument(reader)
    for (const doc of [reader?._iframeWindow?.document, secondDoc]) {
      if (!doc) {
        continue
      }
      addTransitionCSS(doc.head)
      doc.querySelector('html')?.setAttribute('theme', theme)
      sleep(1000).then(() => {
        removeTransitionCSS(doc)
      })
    }
  }

  setPref('current_theme', theme)

  new ztoolkit.ProgressWindow(config.addonName, {
    closeOtherProgressWindows: true,
  })
    .createLine({
      text: `Theme switched to ${theme}!`,
      type: 'default',
      icon: config.themes[theme].icon,
    })
    .show()
}
