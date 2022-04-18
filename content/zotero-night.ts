/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { css } from './css'
import { debug } from './debug'

declare const Zotero: any
// declare const Components: any

const monkey_patch_marker = 'NightMonkeyPatched'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-inner-declarations, prefer-arrow/prefer-arrow-functions
function patch(object, method, patcher) {
  if (object[method][monkey_patch_marker]) return
  object[method] = patcher(object[method])
  object[method][monkey_patch_marker] = true
}

class Night {
  // tslint:disable-line:variable-name
  private initialized = false
  private globals: Record<string, any>
  private strings: any

  // eslint-disable-next-line @typescript-eslint/require-await
  public async load(globals: Record<string, any>) {
    this.globals = globals

    if (this.initialized) return
    this.initialized = true

    const mainWindow = window.document.querySelector('#main-window')
    mainWindow.setAttribute('theme', 'dark')

    const notifierCallback = {
      notify: (event: string, type, ids: string[], extraData) => {
        debug({ event })
        debug({ type })
        if (event === 'select') {
          const noteWindow = Zotero.Notes._editorInstances?.[0]?._iframeWindow

          const noteDoc = noteWindow.document
          const reader = Zotero.Reader.getByTabID(ids[0])
          const doc = reader._iframeWindow.document
          if (doc.querySelector('#pageStyle')) return

          const style = doc.createElement('style')
          style.setAttribute('id', 'pageStyle')
          style.textContent = css
          const header = doc.querySelector('header')
          const noteHeader = noteDoc.querySelector('header')
          header?.appendChild(style)
          noteHeader?.appendChild(style)
          doc.querySelector('html[dir]').setAttribute('theme', 'dark')
        }
        if (event === 'add') {
          debug(`Added tab ${ids[0]}`)
          debug(extraData)
          // const magicNumber = 10000
          const id = ids[0] // 'tab-WJgG9Ojg'
          const allTabs = Array.from(
            //  there are some "context" vboxes, no clue what they do but i hate m
            document.querySelectorAll('vbox[id^=tab]:not([class])')
          )
          const tabIndex = allTabs.findIndex((tab) => tab.id === id)
          const activeTabWindow = window[1 + tabIndex]
          debug(activeTabWindow)
          debug(tabIndex)
          // const activeTabWindow = Zotero.Reader.getByTabID(id)._iframeWindow

          if (activeTabWindow.document.readyState === 'complete') {
            debug(activeTabWindow.document.readyState)
            // const reader = Zotero.Reader.getByTabID(id)
            // debug({ reader: JSON.stringify(reader, null, 2) })
            const style = activeTabWindow.document.createElement('style')
            style.setAttribute('id', 'pageStyle')
            style.textContent = css
            debug(style)
            activeTabWindow.document.head.appendChild(style)
            activeTabWindow.document
              .querySelector('html[dir]')
              .setAttribute('theme', 'dark')
            debug('delayyyy')
            return
          }
          activeTabWindow.document.addEventListener(
            'readystatechange',
            async (e) => {
              debug(e)
              // const reader = Zotero.Reader.getByTabID(id)
              // debug({ reader: JSON.stringify(reader, null, 2) })
              const style = activeTabWindow.document.createElement('style')
              style.setAttribute('id', 'pageStyle')
              style.textContent = css
              debug(style)
              activeTabWindow.document.head.appendChild(style)
              activeTabWindow.document
                .querySelector('html[dir]')
                .setAttribute('theme', 'dark')
            }
          )
          // window.document[2].appendChild(style);
        }
      },
    }

    Zotero.Notifier.registerObserver(notifierCallback, ['tab'])

    this.strings = globals.document.getElementById('zotero-night-strings')
  }
}

if (!Zotero.Night) Zotero.Night = new Night()
