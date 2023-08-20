import { TagElementProps } from 'zotero-plugin-toolkit/dist/tools/ui'
import editor from '../../styles/editor.scss'
import { getPref } from '../../utils/prefs'
import { sleep, waitUtilAsync } from '../../utils/wait'

export const EDITOR_WRAPPER_CLASS = 'zotero-context-pane-tab-notes-deck'
export const ATTACHMENT_NOTE_EDITOR_ID = 'attachment-note-editor'
export const MAIN_VIEW_EDITOR_ID = 'note-editor'
export const CONTEXT_PANE_PINNED_NOTE_CLASS = 'zotero-context-pane-pinned-note'

const EDITOR_STYLE_ID = 'editorStyle'
export function getEditorWrappers() {}

export function attachInitialEditorStyles() {
  const readerIframeDoc = document.querySelector<HTMLIFrameElement>(
    `.${EDITOR_WRAPPER_CLASS} iframe`,
  )?.contentDocument

  const regularViewIframeDoc = document.querySelector<HTMLIFrameElement>(
    `#${MAIN_VIEW_EDITOR_ID} iframe`,
  )?.contentDocument

  const attachmentNoteIframeDoc = document.querySelector<HTMLIFrameElement>(
    `#${ATTACHMENT_NOTE_EDITOR_ID} iframe`,
  )?.contentDocument

  const pinnedNoteIframeDoc = document.querySelector<HTMLIFrameElement>(
    `.${CONTEXT_PANE_PINNED_NOTE_CLASS} iframe`,
  )?.contentDocument

  ;[
    readerIframeDoc,
    regularViewIframeDoc,
    attachmentNoteIframeDoc,
    pinnedNoteIframeDoc,
  ].forEach(async (doc, idx) => {
    if (doc) {
      registerEditorStylesheet(doc)
      return
    }

    if (idx === 3) {
      await waitUtilAsync(
        () =>
          !!document.querySelector<HTMLIFrameElement>(
            `.${CONTEXT_PANE_PINNED_NOTE_CLASS} iframe`,
          )?.contentDocument,
      )
      const doc = document.querySelector<HTMLIFrameElement>(
        `.${CONTEXT_PANE_PINNED_NOTE_CLASS} iframe`,
      )?.contentDocument

      if (doc) {
        registerEditorStylesheet(doc)
      }
    }
  })
}

export async function registerEditorObserver() {
  const prevMutationObserver = cache.mutationObservers['editor']

  if (prevMutationObserver) {
    prevMutationObserver.disconnect()
  }

  const editorObserver = new window.MutationObserver((mutations) => {
    ztoolkit.log('editor observer', mutations)
    mutations.forEach(async (mutation) => {
      if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) {
        ztoolkit.log('editor observer', 'no mutation')
        return
      }

      const vbox = mutation.addedNodes[0] as HTMLElement

      if (!vbox.getAttribute('data-tab-id')) {
        ztoolkit.log('editor observer', 'no tab id on vbox')
        return
      }

      const iframe = vbox.querySelector('iframe')

      if (!iframe) {
        ztoolkit.log('editor observer', 'no iframe')
        return
      }

      await sleep(1000)
      const iframeDoc = iframe.contentDocument!

      registerEditorStylesheet(iframeDoc)
    })
  })

  const editorWrapper = document.querySelector(`.${EDITOR_WRAPPER_CLASS}`)
  ztoolkit.log('editor wrapper', editorWrapper)

  if (editorWrapper) {
    editorObserver.observe(editorWrapper, { childList: true })

    cache.mutationObservers['editor'] = editorObserver
  }
}

export function registerEditorStylesheet(doc: Document) {
  const alreadyExistingStyle = doc?.querySelector(EDITOR_STYLE_ID)

  const props: TagElementProps = {
    tag: 'style',
    attributes: {
      id: EDITOR_STYLE_ID,
    },
    properties: {
      textContent: editor,
    },
  }

  /**
   * Set the theme to dark
   */
  doc.querySelector('html')?.setAttribute('theme', getPref('current_theme'))

  if (alreadyExistingStyle) {
    ztoolkit.UI.replaceElement(props, alreadyExistingStyle)
    return
  }

  ztoolkit.UI.appendElement(props, doc.body)
}
