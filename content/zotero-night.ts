/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { css } from './css'
import { debug } from './debug'

declare const Zotero: any
declare const ZoteroContextPane: any
declare const Zotero_Tabs: any
// declare const Components: any

const monkey_patch_marker = 'NightMonkeyPatched'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-inner-declarations, prefer-arrow/prefer-arrow-functions
function patch(object, method, patcher) {
  if (object[method][monkey_patch_marker]) return
  object[method] = patcher(object[method])
  object[method][monkey_patch_marker] = true
}

export type NightEvent = Record<string, any>
export type NightEventType = string
export type NightEventListener = (event: NightEvent) => void
export type NightEventListenerObject = {
  priority: number
  listener: NightEventListener
  type: string
}
class Night {
  // tslint:disable-line:variable-name
  private initialized = false
  private globals: Record<string, any>
  private strings: any
  private _tabsAdded: boolean
  private _editorStyled: boolean
  public _nordFilter: string
  public _darkFilter: string
  public _sepiaFilter: string
  public _eventListeners: NightEventListenerObject[]

  constructor() {
    this._nordFilter =
      'invert(81%) sepia(23%) saturate(459%) hue-rotate(181deg) brightness(90%) contrast(93%)'

    this._darkFilter =
      'brightness(0.91) grayscale(0.15) invert(0.95) sepia(0.65) hue-rotate(180deg)'
  }

  public addEventListener(
    type: NightEventType,
    listener: NightEventListener,
    priority?: number
  ): void {
    this._eventListeners.push({ priority: priority ?? 10, listener, type })
    this._eventListeners.sort((obj1, obj2) => obj1.priority - obj2.priority)
  }
  /**
   * Open the preference window for Night
   */
  public openPreferenceWindow(paneID: any, action: any) {
    const io = {
      pane: paneID,
      action,
    }
    // @ts-expect-error
    window.openDialog(
      'chrome://zotero-night/content/options.xul',
      'night-options',
      `chrome,titlebar,toolbar,centerscreen${Zotero.Prefs.get(
        'browser.preferences.instantApply',
        true
      )}`
        ? 'dialog=no'
        : 'modal',
      io
    )
  }

  public getPref(pref: string) {
    return Zotero.Prefs.get(`extensions.night.${pref}`, true) as string
  }

  public setPref(pref: string, value: any) {
    return Zotero.Prefs.set(`extensions.night.${pref}`, value, true) as string
  }

  private hasToggle(readerWindow: Window): boolean {
    return !!readerWindow.document.querySelector('#night-toggle')
  }
  private hasFilter(readerWindow: Window): boolean {
    return !!readerWindow.document.querySelector('#filter-style')
  }

  private createFilterStyle(readerWindow: Window, nextStyle: string) {
    const filterStyle = readerWindow.document.createElement('style')
    const filter = nextStyle === 'match' ? this._nordFilter : this._darkFilter
    filterStyle.setAttribute('id', 'filter-style')
    filterStyle.textContent = `[theme='dark'] #viewer .page .canvasWrapper { filter:  ${filter} }`
    return filterStyle
  }

  // TODO: Just change the textcontents of the style, don't remove and append it constantly
  public toggleOnClick(readerWindow: Window, nextStyle: string) {
    if (this.hasFilter(readerWindow)) {
      readerWindow.document.querySelector('#filter-style').remove()
    }
    if (nextStyle === 'none') return

    const filterStyle = this.createFilterStyle(readerWindow, nextStyle)
    readerWindow.document.head.appendChild(filterStyle)
    return
  }

  // TODO: Figure out some way to remember per window setting
  private addToggleButton(readerWindow: Window) {
    if (this.hasToggle(readerWindow)) {
      debug('addToggleButton: window already has toggle')
      return
    }

    const toggle: HTMLButtonElement =
      readerWindow.document.createElement('button')

    toggle.setAttribute('id', 'night-toggle')
    const defaultFilter = this.getPref('default_pdf')

    toggle.setAttribute('data:filter', defaultFilter)

    const icon =
      defaultFilter === 'match' ? '✨' : defaultFilter === 'dark' ? '🌙' : '☀️'
    toggle.textContent = icon
    toggle.setAttribute(
      'style',
      'filter:none !important; height: 20px; width: 20px'
    )
    toggle.onclick = () => {
      const filter = toggle.getAttribute('data:filter')
      const nextStyle =
        filter === 'none' ? 'match' : filter === 'match' ? 'dark' : 'none'

      const icon = filter === 'none' ? '✨' : filter === 'match' ? '🌙' : '☀️'

      toggle.textContent = icon
      this.toggleOnClick(readerWindow, nextStyle)
      toggle.setAttribute('data:filter', nextStyle)
    }

    const middleToolbar = readerWindow.document.querySelector(
      '#toolbarViewerMiddle'
    )
    middleToolbar.appendChild(toggle)

    const st = this.createFilterStyle(readerWindow, defaultFilter)
    readerWindow.document.head.appendChild(st)
  }

  public addAllStyles() {
    let counter = 0
    let win: Window | undefined = window[counter]
    while (win) {
      if (win.document.URL.includes('editor.html')) {
        this.addStyleToEditor(win)
      }

      if (win.document.URL.includes('viewer.html')) {
        this.addEverythingForTab(win)
      }
      counter++
      win = window[counter]
    }
  }

  public setHTMLThemeAttributeForWindow(win: Window, on: boolean) {
    const html = win.document.querySelector('html')
    debug(
      on ? 'removing html theme attribute' : 'removing html theme attribute'
    )
    debug(`Current html theme attribute${html.getAttribute('theme')}`)
    debug(html)
    if (!on) {
      html.removeAttribute('theme')
      debug(
        `Removed html theme attribute. It is now${html.getAttribute('theme')}`
      )
      return
    }
    html.setAttribute('theme', 'dark')
    debug(`Added html theme attribute. It is now${html.getAttribute('theme')}`)
  }

  public setHTMLThemeAttribute(on: boolean) {
    let counter = 0
    let win: Window | undefined = window[counter]
    while (win) {
      this.setHTMLThemeAttributeForWindow(win, on)
      counter++
      debug(counter)
      win = window[counter]
    }
  }

  public removeStyleFromEditorWindow(win: Window) {
    win.document.querySelector('#noteStyle').remove()
  }

  public removeStyleFromViewerTab(win: Window) {
    win.document.querySelector('#pageStyle').remove()
  }

  /**
   * Run after disabling the theme
   * Removes all styles
   */
  public removeAllStyle() {
    let counter = 0
    let win: Window | undefined = window[counter]
    while (win) {
      if (win.document.URL.includes('editor.html')) {
        this.removeStyleFromEditorWindow(win)
      }

      if (win.document.URL.includes('viewer.html')) {
        this.removeStyleFromViewerTab(win)
      }
      counter++
      win = window[counter]
    }
  }

  public addStyleToEditor(editorWindow: Window) {
    const editorDoc = editorWindow.document
    const style = editorDoc.createElement('style')
    style.setAttribute('id', 'noteStyle')
    style.textContent = css
    editorDoc.head.append(style)
  }

  public hasStyle(editorWindow: any): boolean {
    return !!editorWindow.document.querySelector('#pageStyle')
  }
  public editorNeedsStyle(): boolean {
    const editorWin3 = window[(Zotero_Tabs._tabs?.length ?? 0) + 1]
    if (!editorWin3) return false
    return !this.hasStyle(editorWin3)
  }

  private tryToAddStyleToEditor() {
    const editorWin3 = window[(Zotero_Tabs._tabs?.length ?? 0) + 1]
    const needsStyle = !this.hasStyle(editorWin3)

    if (needsStyle) {
      debug('should have added things to the editor')
      debug(Zotero_Tabs._tabs?.length)
      this.addStyleToEditor(editorWin3)
      this._tabsAdded = true
    }
  }

  public getTabWindowById(id: string): Window | null {
    const tabIndex = Zotero_Tabs._tabs.findIndex((tab) => tab.id === id)

    debug(`Select tab event tabindex: ${tabIndex}`)

    if (tabIndex === -1) return null

    const activeTabWindow = window[1 + tabIndex]
    return activeTabWindow
  }

  public getTabNameById(id: string): string {
    const name =
      (Zotero_Tabs._tabs.find((tab) => tab.id === id)?.title as string) ??
      'Not found'
    return name
  }

  private addEverythingForTab(tabWindow: Window) {
    const doc = tabWindow.document
    // if (doc.querySelector('#pageStyle')) return

    debug('adding style for added window tab')
    const style = doc.createElement('style')
    style.setAttribute('id', 'pageStyle')
    style.textContent = css
    const header = doc.querySelector('head')
    header.appendChild(style)
    doc.querySelector('html[dir]').setAttribute('theme', 'dark')
    this.addToggleButton(tabWindow)

    //  this.editorNeedsStyle() && this.tryToAddStyleToEditor()
  }

  public toggleDarkTheme(on?: boolean) {
    const main = window.document.querySelector('#main-window')
    if (on) {
      main.setAttribute('theme', 'dark')
      this.setHTMLThemeAttribute(true)
      !this.getPref('enabled') && this.setPref('enabled', true)
      return
    }

    if (main.getAttribute('theme') === 'dark' || on === false) {
      main.removeAttribute('theme')
      this.setHTMLThemeAttribute(false)
      this.getPref('enabled') && this.setPref('enabled', false)
      return
    }
    main.setAttribute('theme', 'dark')
    this.setHTMLThemeAttribute(true)
    !this.getPref('enabled') && this.setPref('enabled', true)
  }

  public addGlobalToggleButton() {
    const toolbar = window.document.querySelector('#zotero-item-toolbar')
    const button = window.document.createElement('div')
    button.setAttribute('id', 'night-global-toggle')
    button.setAttribute('tab-index', '0')
    // TODO: Make actual icons instead of emoji

    const image = window.document.createElement('span')
    image.textContent = this.getPref('enabled') ? '🌚' : '🌞'
    button.appendChild(image)
    button.onclick = () => {
      this.toggleDarkTheme()
      image.textContent = this.getPref('enabled') ? '🌚' : '🌞'
    }

    toolbar.appendChild(button)
  }
  // eslint-disable-next-line @typescript-eslint/require-await
  public async load(globals: Record<string, any>) {
    this.globals = globals

    if (this.initialized) return
    this.initialized = true

    this._tabsAdded = false
    const mainWindow = window.document.querySelector('#main-window')

    mainWindow.setAttribute('theme', 'dark')

    const editorWin1 = window[0]
    this.addStyleToEditor(editorWin1)
    const editorWin2 = window[1]
    this.addStyleToEditor(editorWin2)

    this.addGlobalToggleButton()
    // const toggle = window.document.querySelector('#zotero-tb-toggle-notes-pane')
    // toggle.addEventListener('click', async () => {
    //   debug('clickyyy')
    //   const editor = ZoteroContextPane.getActiveEditor()
    //   if (editor) {
    //     const currentEditor = editor.getCurrentInstance()

    //     await currentEditor._initPromise

    //     const noteWindow = currentEditor._iframeWindow
    //     noteWindow.addEventListener('DOMContentLoaded', (ev: any) => {
    //       debug('note loaded')
    //       const noteDoc = noteWindow.document

    //       if (noteDoc.querySelector('pageStyle')) return

    //       const noteStyle = noteDoc.createElement('style')

    //       noteStyle.setAttribute('id', 'pageStyle')
    //       noteStyle.textContent = css

    //       const noteHeader = noteDoc.querySelector('header')
    //       noteHeader?.appendChild(noteStyle)
    //     })
    //   }
    // })

    const notifierCallback = {
      notify: async (event: string, type, ids: string[], extraData) => {
        // if (!this.getPref('enabled')) return
        if (event === 'add') {
          debug(`Tab with id ${ids[0]} added`)

          debug('finding browser tab')
          debug('Trying to find window')
          // const tabWindow = this.getTabWindowById(ids[0])
          const reader = Zotero.Reader.getByTabID(ids[0])
          await reader._initPromise
          const tabWindow = reader._iframeWindow as Window
          debug(tabWindow)
          debug(`Added tab "${this.getTabNameById(ids[0])}"`)
          debug(
            `Added tab window readystate is ${tabWindow.document.readyState}`
          )
          switch (tabWindow.document.readyState) {
            // @ts-expect-error
            case 'uninitialized': {
              setTimeout(() => {
                tabWindow.document.onreadystatechange = () =>
                  debug('in readystatechange eventlistener:')

                debug(
                  `Added tab windw readystate is ${tabWindow.document.readyState}`
                )

                this.addEverythingForTab(tabWindow)
                return
              }, 300)
            }
            case 'complete': {
              this.addEverythingForTab(tabWindow)
            }
          }
        }
        if (event === 'select') {
          if (this._editorStyled) {
            debug('Editor already has style, skipping...')
            return
          }
          let editorWindow: Window | undefined
          let counter = 2
          while (counter <= 100 && editorWindow === undefined) {
            const wind = window[counter]
            if (wind.document.URL.includes('editor.html')) {
              editorWindow = wind
              break
            }
            counter++
          }
          if (!editorWindow) {
            debug('well shit')
            return
          }

          if (Zotero.Notes._editorInstances.length > 0) {
            this.addStyleToEditor(editorWindow)
            this._editorStyled = true
          }
          // listen for init message
          editorWindow.onmessage = (message: any) => {
            if (message?.data?.action !== 'init') return
            this.addStyleToEditor(editorWindow)

            this._editorStyled = true
          }
        }
        //     debug('head of the window (select)')
        //     debug(
        //       `selected tab ${this.getTabNameById(ids[0])} readystate is ${
        //         window.document.readyState
        //       }`
        //     )
        //     this.editorNeedsStyle() && this.tryToAddStyleToEditor()
        //     try {
        //       // add stylesheet to the editor window
        //       const id = ids[0] // 'tab-WJgG9Ojg'
        //       // const allTabs = Array.from(
        //       //   //  there are some "context" vboxes, no clue what they do but i hate m
        //       //   document.querySelectorAll('vbox[id^=tab]:not([class])')
        //       // )
        //       const tabIndex = Zotero_Tabs._tabs.findIndex((tab) => tab.id === id)

        //       debug(`Select tab event tabindex: ${tabIndex}`)

        //       if (tabIndex === -1) return

        //       const activeTabWindow = window[1 + tabIndex]
        //       this.addToggleButton(activeTabWindow)

        //       debug(`Select tab event activeTabWindow: ${activeTabWindow}`)

        //       // const reader = Zotero.Reader.getByTabID(ids[0])
        //       // const doc = reader?._iframeWindow?.document
        //       const doc = activeTabWindow?.document
        //       if (!doc) {
        //         debug('select tab: no doc')
        //         return
        //       }
        //       if (doc.querySelector('#pageStyle')) {
        //         debug('select tab: theres already pagestyle')
        //         return
        //       }

        //       const style = doc.createElement('style')
        //       style.setAttribute('id', 'pageStyle')
        //       style.textContent = css
        //       const header = doc.querySelector('head')
        //       header?.appendChild(style)
        //       doc.querySelector('html[dir]').setAttribute('theme', 'dark')
        //       debug('select tab added style')
        //     } catch (e) {
        //       debug('Error in Select tab notifierCallback')
        //       debug(e)
        //     }
        //   }
        //   // debug(`Added tab ${ids[0]}`)
        //   // debug(extraData)
        //   // // const magicNumber = 10000
        //   // const id = ids[0] // 'tab-WJgG9Ojg'
        //   // const allTabs = Array.from(
        //   //   //  there are some "context" vboxes, no clue what they do but i hate m
        //   //   document.querySelectorAll('vbox[id^=tab]:not([class])')
        //   // )
        //   // const tabIndex = allTabs.findIndex((tab) => tab.id === id)
        //   // const activeTabWindow = window[1 + tabIndex]
        //   // debug(activeTabWindow)
        //   // debug(tabIndex)
        //   // // const activeTabWindow = Zotero.Reader.getByTabID(id)._iframeWindow
        //   // if (activeTabWindow.document.readyState === 'complete') {
        //   //   try {
        //   //     debug(activeTabWindow.document.readyState)
        //   //     // const reader = Zotero.Reader.getByTabID(id)
        //   //     // debug({ reader: JSON.stringify(reader, null, 2) })
        //   //     const style = activeTabWindow.document.createElement('style')
        //   //     style.setAttribute('id', 'pageStyle')
        //   //     style.textContent = css
        //   //     debug(style)
        //   //     activeTabWindow.document.head.appendChild(style)
        //   //     activeTabWindow.document
        //   //       .querySelector('html[dir]')
        //   //       .setAttribute('theme', 'dark')
        //   //     debug('delayyyy')
        //   //   } catch (e) {
        //   //     debug('Error in readystate check tab add notifierCallback')
        //   //     debug(e)
        //   //   }
        //   //   return
        //   // }
        //   // activeTabWindow.addEventListener('DOMContentLoaded', (e) => {
        //   //   try {
        //   //     debug(e)
        //   //     // const reader = Zotero.Reader.getByTabID(id)
        //   //     // debug({ reader: JSON.stringify(reader, null, 2) })
        //   //     const style = activeTabWindow.document.createElement('style')
        //   //     style.setAttribute('id', 'pageStyle')
        //   //     style.textContent = css
        //   //     debug(style)
        //   //     activeTabWindow.document.head.appendChild(style)
        //   //     activeTabWindow.document
        //   //       .querySelector('html[dir]')
        //   //       .setAttribute('theme', 'dark')
        //   //   } catch (e) {
        //   //     debug('Error in readystate check tab add notifierCallback')
        //   //     debug(e)
        //   //   }
        //   // })
        //   // window.document[2].appendChild(style);
      },
    }
    Zotero.Notifier.registerObserver(notifierCallback, ['tab'])

    this.strings = globals.document.getElementById('zotero-night-strings')
  }
}

Zotero.Night = new Night()
