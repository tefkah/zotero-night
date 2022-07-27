/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
function patch(object: any, method: any, patcher: any) {
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
interface Filters {
  filter: string
  icon: string
}
class Night {
  // tslint:disable-line:variable-name
  private initialized = false
  // @ts-expect-error shush
  private globals: Record<string, any>
  private strings: any
  // @ts-expect-error shush
  private _tabsAdded: boolean
  // @ts-expect-error shush
  private _editorStyled: boolean
  public _currentFilter: string
  //  public _nordFilter: string
  //  public _darkFilter: string
  //  public _sepiaFilter: string
  // @ts-expect-error shush
  public _eventListeners: NightEventListenerObject[]

  public _filters: {
    [filter: string]: Filters
  }

  constructor() {
    this._filters = {
      none: { filter: 'none', icon: '☀️' },
      nord: {
        filter:
          'invert(81%) sepia(23%) saturate(459%) hue-rotate(181deg) brightness(90%) contrast(93%)',
        icon: '✨',
      },
      dark: {
        filter:
          'brightness(0.91) grayscale(0.15) invert(0.95) sepia(0.65) hue-rotate(180deg)',
        icon: '🌙',
      },
    }

    this._currentFilter = this.getPref('default_pdf') || 'nord'
  }

  public addEventListener(
    type: NightEventType,
    listener: NightEventListener,
    priority?: number,
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
    // @ts-expect-error shush
    window.openDialog(
      'chrome://zotero-night/content/options.xul',
      'night-options',
      `chrome,titlebar,toolbar,centerscreen${Zotero.Prefs.get(
        'browser.preferences.instantApply',
        true,
      )}`
        ? 'dialog=no'
        : 'modal',
      io,
    )
  }

  public getEnabled() {
    return Zotero.Prefs.get('night.enabled') as boolean
  }
  public toggleEnabled(on?: boolean) {
    if (on === true || on === false) {
      return Zotero.Prefs.set('night.enabled', on) as boolean
    }
    const enable = this.getEnabled()
    return Zotero.Prefs.set('night.enabled', !enable) as boolean
  }

  public getPref(pref: string): string {
    return Zotero.Prefs.get(`night.${pref}`) as string
  }

  public setPref(pref: string, value: any) {
    return Zotero.Prefs.set(`night.${pref}`, value) as string
  }

  private hasToggle(readerWindow: Window): boolean {
    return !!readerWindow.document.querySelector('#night-toggle')
  }

  private createFilterStyle(readerWindow: Window) {
    const filterStyle = readerWindow.document.createElement('style')
    filterStyle.setAttribute('id', 'filterStyle')
    const preferredFilter = this.getPref('default_pdf')
    const setFilter = this.setFilterStyle(filterStyle, preferredFilter)
    return setFilter
  }

  // TODO: Just change the textcontents of the style, don't remove and append it constantly
  public toggleFilterOnClick(readerWindow: Window) {
    const filter: HTMLStyleElement | null =
      readerWindow.document.querySelector('#filterStyle')

    if (filter === null) {
      debug('No suitable filter found')
      return
    }

    const nextStyle = this.cycleFilterStyle()

    this.setFilterStyle(filter)
    return
  }

  private cycleFilterStyle() {
    const filters = Object.entries(this._filters)
    const nextFilterName =
      filters[
        (filters.findIndex((filter) => filter[0] === this._currentFilter) + 1) %
          filters.length
      ][0]
    this._currentFilter = nextFilterName
    return nextFilterName
  }

  private getCurrentFilterString() {
    return this.getFilterString(this._currentFilter)
  }
  private getFilterString(filter: string) {
    return this._filters[filter].filter
  }

  private getCurrentFilterIcon() {
    return this.getFilterIcon(this._currentFilter)
  }

  private getFilterIcon(filter: string) {
    return this._filters[filter].icon
  }

  private setFilterStyle(styleTag: HTMLStyleElement, style?: string) {
    styleTag.textContent = `[theme='dark'] #viewer .page .canvasWrapper canvas:not(.selectionCanvas) { filter:  ${
      style || this.getCurrentFilterString()
    } }
    `
    return styleTag
  }

  // TODO: Figure out some way to remember per window setting
  private addFilterToggleButton(readerWindow: Window) {
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
      'filter:none !important; height: 20px; width: 20px; margin-right: 20px',
    )
    toggle.onclick = () => {
      this.toggleFilterOnClick(readerWindow)
      toggle.setAttribute('data:filter', this._currentFilter)
      const icon = this.getCurrentFilterIcon()

      toggle.textContent = icon
    }

    const middleToolbar = readerWindow.document.querySelector(
      '#toolbarViewerMiddle',
    )

    if (!middleToolbar) {
      debug('addToggleButton: no middle toolbar')
      return
    }

    middleToolbar.prepend(toggle)

    const st = this.createFilterStyle(readerWindow)
    readerWindow.document.head.appendChild(st)
  }

  private addAllStyles() {
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
    if (!html) {
      debug('setHTMLThemeAttributeForWindow: no html')
      return
    }
    debug(
      on ? 'removing html theme attribute' : 'removing html theme attribute',
    )
    debug(`Current html theme attribute: ${html.getAttribute('theme')}`)
    debug(html)
    if (!on) {
      html.removeAttribute('theme')
      debug(
        `Removed html theme attribute. It is now: ${html.getAttribute(
          'theme',
        )}`,
      )
      return
    }
    html.setAttribute('theme', 'dark')
    debug(
      `Added html theme attribute. It is now: ${html.getAttribute('theme')}`,
    )
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
    win.document.querySelector('#noteStyle')?.remove()
  }

  public removeStyleFromViewerTab(win: Window) {
    win.document.querySelector('#pageStyle')?.remove()
  }

  /**
   * Run after disabling the theme
   * Removes all styles
   */
  private removeAllStyle() {
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

  /**
   * Add the noteStyle to the editor window and set its theme to "dark"
   */
  private addStyleToEditor(editorWindow: Window) {
    const editorDoc = editorWindow.document
    const style = editorDoc.createElement('style')
    style.setAttribute('id', 'noteStyle')
    style.textContent = css
    editorDoc.head.append(style)

    const editorHTML = editorDoc.querySelector('html')
    editorHTML?.setAttribute('theme', this.getEnabled() ? 'dark' : 'light')
  }

  /**
   * Check whether a certain window has a "*Style" id
   */
  public hasStyle(editorWindow: any): boolean {
    return !!editorWindow.document.querySelector('[id*=Style]')
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      debug(Zotero_Tabs._tabs?.length)
      this.addStyleToEditor(editorWin3)
      this._tabsAdded = true
    }
  }

  public getTabWindowById(id: string): Window | null {
    const tabIndex = Zotero_Tabs._tabs.findIndex((tab: any) => tab.id === id)

    debug(`Select tab event tabindex: ${tabIndex}`)

    if (tabIndex === -1) return null

    const activeTabWindow = window[1 + tabIndex]
    return activeTabWindow
  }

  public getTabNameById(id: string): string {
    const name =
      (Zotero_Tabs._tabs.find((tab: any) => tab.id === id)?.title as string) ??
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
    header?.appendChild(style)

    doc
      .querySelector('html[dir]')
      ?.setAttribute('theme', this.getEnabled() ? 'dark' : 'light')
    this.addFilterToggleButton(tabWindow)

    //  this.editorNeedsStyle() && this.tryToAddStyleToEditor()
  }

  public toggleDarkTheme(on?: boolean, setPreference = true) {
    const main = window.document.querySelector('#main-window')
    const enable = on ?? !this.getEnabled()
    if (!main) {
      debug('toggleDarkTheme: no main window')
      return
    }

    // /**
    //  * Force turn on theme
    //  **/
    // if (on) {
    //   main.setAttribute('theme', 'dark')
    //   this.setHTMLThemeAttribute(true)
    //   setPreference && !this.getEnabled() && this.setPref('enabled', true)
    //   return
    // }

    debug(
      '🔜 before toggling theme. current theme is: ',
      `${main.getAttribute('theme')}`,
      'and enabled is: ',
      `${!enable}`,
    )

    enable ? main.setAttribute('theme', 'dark') : main.removeAttribute('theme')
    if (setPreference) {
      const enabled = this.toggleEnabled(!!enable)
      debug(`after toggling: ${enabled}`)
    }

    debug(
      '🔚 after toggling toggling theme. current theme is: ',
      `${main.getAttribute('theme')}`,
      'and enabled is: ',
      `${this.getEnabled()}`,
    )

    this.setHTMLThemeAttribute(enable)
    return
  }

  public addGlobalToggleButton() {
    const toolbar = window.document.querySelector('#zotero-item-toolbar')
    const button = window.document.createElement('div')
    button.setAttribute('id', 'night-global-toggle')
    button.setAttribute('tab-index', '0')
    // TODO: Make actual icons instead of emoji

    const image = window.document.createElement('span')

    image.textContent = this.getEnabled() ? '🌚' : '🌞'
    button.appendChild(image)
    button.onclick = () => {
      this.toggleDarkTheme()
      image.textContent = this.getEnabled() ? '🌚' : '🌞'
    }

    if (!toolbar) {
      debug('no toolbar')
      return
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

    this.getEnabled() && mainWindow?.setAttribute('theme', 'dark')

    const editorWin1 = window[0]
    this.addStyleToEditor(editorWin1)
    const editorWin2 = window[1]
    this.addStyleToEditor(editorWin2)

    this.addGlobalToggleButton()

    const notifierCallback = {
      notify: async (
        event: string,
        type: string,
        ids: string[],
        extraData: any,
      ) => {
        // if (!this.getEnabled()) return
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
            `Added tab window readystate is ${tabWindow.document.readyState}`,
          )
          switch (tabWindow.document.readyState) {
            // @ts-expect-error uninitialized does exist actually
            case 'uninitialized': {
              setTimeout(() => {
                tabWindow.document.onreadystatechange = () =>
                  debug('in readystatechange eventlistener:')

                debug(
                  `Added tab windw readystate is ${tabWindow.document.readyState}`,
                )

                if (this.getEnabled()) {
                  this.addEverythingForTab(tabWindow)

                  return
                }
              }, 300)
              return
            }
            case 'complete': {
              if (this.getEnabled()) {
                this.addEverythingForTab(tabWindow)
              }
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
            if (!editorWindow) {
              debug('no editor window')
              return
            }
            this.addStyleToEditor(editorWindow)

            this._editorStyled = true
          }
        }
      },
    }
    Zotero.Notifier.registerObserver(notifierCallback, ['tab'])

    // Zotero.Prefs.registerObserver('extensions.night.enabled', )
    this.strings = globals.document.getElementById('zotero-night-strings')
  }
}

Zotero.Night = new Night()
