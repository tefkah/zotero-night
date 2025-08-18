/* eslint-disable @typescript-eslint/ban-types */
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
// @ts-expect-error its fine
import css from '../css/tab.scss'
import { debug } from './debug'

const mutationObservers: Record<string, MutationObserver> = {}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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

type FilterNames = 'nord' | 'dark' | 'none'

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
  //  public _nordFilter: string
  //  public _darkFilter: string
  //  public _sepiaFilter: string
  // @ts-expect-error shush
  public _eventListeners: NightEventListenerObject[]

  public _filters: {
    //    [filter: 'none' | 'nord' | 'dark']: Filters
    none: Filters
    nord: Filters
    dark: Filters
  }

  public _currentFilter: FilterNames
  constructor() {
    this._filters = {
      none: { filter: 'none', icon: '☀️' },
      nord: {
        filter:
          // 'invert(81%) sepia(23%) saturate(459%) hue-rotate(181deg) brightness(90%) contrast(93%)',
          'invert(84%) sepia(59%) saturate(210%) hue-rotate(185deg) brightness(93%) contrast(88%)',
        icon: '✨',
      },
      dark: {
        filter:
          'brightness(0.91) grayscale(0.15) invert(0.95) sepia(0.65) hue-rotate(180deg)',
        icon: '🌙',
      },
    }

    this._currentFilter = this.getPref('default_pdf') || 'nord'
    // if (this._currentFilter === 'match') {
    //   this._currentFilter = 'nord'
    // }
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

  public getPref(pref: 'default_pdf'): FilterNames
  public getPref(pref: Exclude<string & {}, 'default_pdf'>): string
  public getPref(
    pref: 'default_pdf' | Exclude<string & {}, 'default_pdf'>,
  ): string | FilterNames {
    return Zotero.Prefs.get(`night.${pref}`) as string
  }

  public setPref(pref: string, value: string) {
    return Zotero.Prefs.set(`night.${pref}`, value) as string
  }

  private getFilterForItemID(itemID: string) {
    const idsString = this.getPref(`fitlerByItems`)
    if (!idsString) {
      this.setPref(`fitlerByItems`, JSON.stringify({}))
    }
    const ids = idsString ? JSON.parse(idsString) : {}
    const filter = ids?.[itemID]

    return filter as FilterNames
  }

  private setFilterForItemID(itemID: string, filter: FilterNames) {
    const idsString = this.getPref(`fitlerByItems`)
    let ids = JSON.parse(idsString)

    if (!ids) {
      this.setPref(`fitlerByItems`, JSON.stringify({}))
      ids = {}
    }

    ids[itemID] = filter

    const newIdsString = JSON.stringify(ids)
    this.setPref(`fitlerByItems`, newIdsString)
  }

  private hasToggle(readerWindow: Window): boolean {
    return !!readerWindow.document.querySelector('#night-toggle')
  }

  private createFilterStyle(readerWindow: Window, style?: string) {
    const filterStyle = readerWindow.document.createElement('style')
    filterStyle.setAttribute('id', 'filterStyle')
    const preferredFilter = style ?? this.getCurrentFilterString()
    const setFilter = this.setFilterStyle(filterStyle, preferredFilter)
    return setFilter
  }

  // TODO: Just change the textcontents of the style, don't remove and append it constantly
  public toggleFilterOnClick(readerWindow: Window, itemID?: number) {
    const secondViewIframe = readerWindow.document.querySelector(
      'iframe',
    ) as HTMLIFrameElement
    const secondViewWindow = secondViewIframe?.contentWindow

    const nextStyle = this.cycleFilterStyle()

    this.setFilterForItemID(itemID?.toString() ?? '', nextStyle)
    ;[readerWindow, secondViewWindow].forEach((win) => {
      if (!win) {
        return
      }

      const filter: HTMLStyleElement | null =
        win.document.querySelector('#filterStyle')

      if (filter === null) {
        debug('No suitable filter found')
        return
      }

      this.setFilterStyle(filter, this.getFilterString(nextStyle))
    })
    return
  }

  private cycleFilterStyle() {
    const filters = Object.entries(this._filters)
    const nextFilterName = filters[
      (filters.findIndex((filter) => filter[0] === this._currentFilter) + 1) %
        filters.length
    ][0] as FilterNames
    this._currentFilter = nextFilterName
    return nextFilterName
  }

  private getCurrentFilterString() {
    return this.getFilterString(this._currentFilter)
  }
  private getFilterString(filter: FilterNames) {
    return this._filters[filter].filter
  }

  private getCurrentFilterIcon() {
    return this.getFilterIcon(this._currentFilter)
  }

  private getFilterIcon(filter: FilterNames) {
    return this._filters[filter].icon
  }

  private setFilterStyle(styleTag: HTMLStyleElement, style?: string) {
    const styleString = style !== undefined ? this.getFilterString(style) : undefined
    styleTag.textContent = `[theme='dark'] .page .canvasWrapper canvas:not(.selectionCanvas) { filter:  ${
      styleString || this.getCurrentFilterString()
    } }
    `
    return styleTag
  }

  // TODO: Figure out some way to remember per window setting
  private addFilterToggleButton(readerWindow: Window, itemID?: number) {
    if (this.hasToggle(readerWindow)) {
      debug('addToggleButton: window already has toggle')
      return
    }

    const toggle: HTMLButtonElement =
      readerWindow.document.createElement('button')

    toggle.setAttribute('id', 'night-toggle')
    const defaultFilter =
      // this.getPref('default_pdf') === 'match'
      //   ? 'nord'
      this.getFilterForItemID(itemID?.toString() ?? '')

    toggle.setAttribute('data:filter', defaultFilter)

    const icon =
      defaultFilter === 'nord' ? '✨' : defaultFilter === 'dark' ? '🌙' : '☀️'
    toggle.textContent = icon
    toggle.setAttribute(
      'style',
      'filter:none !important; height: 20px; width: 20px; margin-right: 20px',
    )
    toggle.onclick = () => {
      this.toggleFilterOnClick(readerWindow, itemID)

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
    // ;[readerWindow].forEach((win) => {
    //   if (!win) {
    //     return
    //   }

    //   const st = this.createFilterStyle(win)
    //   win.document.head.appendChild(st)
    // })
  }

  private addAllStyles() {
    let counter = 0
    let win: Window | undefined = window[counter]
    while (win) {
      if (win.document.URL.includes('editor.html')) {
        this.addStyleToEditor(win)
      }

      // if (win.document.URL.includes('viewer.html')) {
      //   this.addEverythingForTab(win)
      // }
      counter++
      win = window[counter]
    }

    Zotero.Reader._readers.forEach((reader) => {
      const win = reader._iframeWindow
      if (!win) {
        return
      }
      this.addEverythingForTab(win, false, reader.itemID)
    })
  }

  public setHTMLThemeAttributeForWindow(win: Window, on: boolean) {
    const html = win.document.querySelector('html')
    if (!html) {
      debug('setHTMLThemeAttributeForWindow: no html')
      return
    }
    debug(on ? 'setting theme=dark' : 'removing [theme]')
    debug(`Current html theme attribute: ${html.getAttribute('theme')}`)
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
    win.document.querySelector('#filterStyle')?.remove()
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
        const secondView = win.document.querySelector('iframe')?.contentWindow
        if (secondView) {
          this.removeStyleFromViewerTab(secondView)
        }
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
    editorHTML?.setAttribute('theme', 'dark')
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
    const tabIndex = Zotero_Tabs._tabs.findIndex((tab) => tab.id === id)

    debug(`Select tab event tabindex: ${tabIndex}`)

    if (tabIndex === -1) return null

    const activeTabWindow = window[1 + tabIndex]
    return activeTabWindow
  }

  public getTabNameById(id: string): string {
    const name =
      Zotero_Tabs._tabs.find((tab) => tab.id === id)?.title ?? 'Not found'
    return name
  }

  private addSplitMutationObserver(tabWindow: Window, itemID?: number) {
    const doc = tabWindow.document

    const splitWrapper = doc?.querySelector('#splitWrapper')

    const prevMutationObserver = mutationObservers[itemID?.toString() ?? '']

    if (prevMutationObserver) {
      prevMutationObserver.disconnect()
    }

    const observer = new window.MutationObserver(async (mutationsList) => {
      for (const mutation of mutationsList) {
        // Check if the class attribute was modified
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          // TODO: do something smarter like 'onload' event
          // await waitUtilAsync(true)
          await sleep(1000)

          // Get the new class value
          // @ts-expect-error it do
          const newClassValue = mutation.target.className

          // Handle the classname change
          if (!newClassValue.includes('split')) {
            return
          }

          const secondViewIframe = doc.querySelector(
            '#secondViewIframe',
          ) as HTMLIFrameElement

          const secondViewWindow = secondViewIframe?.contentWindow
          const secondViewDoc = secondViewIframe?.contentDocument
          if (!secondViewWindow || !secondViewDoc) {
            return
          }

          this.addEverythingForTab(secondViewWindow, true, itemID)
          // const st = this.createFilterStyle(secondViewWindow)
          // secondViewDoc.head.appendChild(st)

          // Add your custom logic here
          // ...
        }
      }
    })

    if (splitWrapper) {
      // Start observing the target element for attribute changes
      observer.observe(splitWrapper, { attributes: true })
    }
  }

  public addEverythingForTab(
    tabWindow: Window,
    secondWindow = false,
    itemID?: number,
  ) {
    // don't do anything if the theme is disabled
    if (!this.getEnabled()) {
      return
    }

    if (tabWindow.document.querySelector('#pageStyle')) {
      debug('tab already has style')
      return
    }
    const doc = tabWindow.document

    debug('adding style for added window tab')
    const style = doc.createElement('style')
    style.setAttribute('id', 'pageStyle')
    style.textContent = css
    const header = doc.querySelector('head')
    header?.appendChild(style)

    doc.querySelector('html[dir]')?.setAttribute('theme', 'dark')

    const filter =
      this.getFilterForItemID(itemID?.toString() ?? '') ??
      this.getPref('default_pdf')

    const st = this.createFilterStyle(tabWindow, this.getFilterString(filter))

    this.setFilterForItemID(itemID?.toString() ?? '', filter)

    tabWindow.document.head.appendChild(st)

    if (secondWindow) {
      return
    }

    this.addFilterToggleButton(tabWindow, itemID)

    this.addSplitMutationObserver(tabWindow, itemID)

    sleep(1000)
      .then(() => {
        const secondTabWindow = doc.querySelector('iframe')?.contentWindow

        if (!secondTabWindow) {
          return
        }

        this.addEverythingForTab(secondTabWindow, true, itemID)
      })
      .catch((e) => debug(e as string))

    //  this.editorNeedsStyle() && this.tryToAddStyleToEditor()
  }

  public toggleDarkTheme(current: boolean, setPreference = true) {
    const main = window.document.querySelector('#main-window')
    // const enable = on //?? !this.getEnabled()
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

    if (setPreference) {
      const enabled = this.toggleEnabled(!current)
      debug(`after toggling: ${enabled}`)
    }

    if (current) {
      main.removeAttribute('theme')
      this.removeAllStyle()
    } else {
      main.setAttribute('theme', 'dark')
      this.addAllStyles()
    }

    // this.setHTMLThemeAttribute(current)
    return
  }

  public addGlobalToggleButton() {
    const toolbar = window.document.querySelector('#zotero-item-toolbar')
    const button = window.document.createElement('div')
    button.setAttribute('id', 'night-global-toggle')
    button.setAttribute('tab-index', '0')
    // TODO: Make actual icons instead of emoji

    const image = window.document.createElement('span')
    image.setAttribute('id', 'night-global-toggle-image')

    // image.textContent = this.getEnabled() ? '🌚' : '🌞'
    button.appendChild(image)
    button.onclick = () => {
      this.toggleDarkTheme(this.getEnabled())
      // image.textContent = this.getEnabled() ? '🌚' : '🌞'
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
        ids: (string | number)[],
        extraData: any,
      ) => {
        // if (!this.getEnabled()) return
        if (event === 'add') {
          debug(`Tab with id ${ids[0]} added`)

          debug('finding browser tab')
          debug('Trying to find window')
          // const tabWindow = this.getTabWindowById(ids[0])
          await sleep(50)
          // const rea Zotero.Reader.getByTabID
          // const reader = Zotero.Reader.getByTabID(ids[0])
          const reader =
            Zotero.Reader._readers.find((reader) => reader.tabID === ids[0]) ??
            Zotero.Reader.getByTabID(ids[0]?.toString())

          if (!reader) {
            debug('no reader found')
            return
          }
          await reader._initPromise
          const tabWindow = reader._iframeWindow

          if (!tabWindow) {
            debug('no tab window')
            return
          }

          debug(tabWindow)
          debug(`Added tab "${this.getTabNameById(ids[0]?.toString())}"`)
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
                  this.addEverythingForTab(tabWindow, false, reader.itemID)
                  return
                }
              }, 300)
              return
            }
            case 'complete': {
              if (this.getEnabled()) {
                this.addEverythingForTab(tabWindow, false, reader.itemID)
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
            if (wind && wind.document.URL.includes('editor.html')) {
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
          editorWindow.onmessage = (message) => {
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
