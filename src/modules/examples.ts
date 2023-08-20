import { config } from '../../package.json'
import { getSecondaryReaderDocument } from '../utils/getSplitWindow'
import { getString } from '../utils/locale'
import { getPref } from '../utils/prefs'
import { cycleFilter } from './ui/filterSchema'
import { switchTheme } from './ui/switchTheme'

export function getDarkEnabled() {
  return getPref('current_theme') === 'dark'
}

function example(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
) {
  const original = descriptor.value
  descriptor.value = function (...args: any) {
    try {
      ztoolkit.log(`Calling example ${target.name}.${String(propertyKey)}`)
      return original.apply(this, args)
    } catch (e) {
      ztoolkit.log(`Error in example ${target.name}.${String(propertyKey)}`, e)
      throw e
    }
  }
  return descriptor
}

export class BasicExampleFactory {
  @example
  private static unregisterNotifier(notifierID: string) {
    Zotero.Notifier.unregisterObserver(notifierID)
  }

  @example
  static registerPrefs() {
    const prefOptions = {
      pluginID: config.addonID,
      src: rootURI + 'chrome/content/preferences.xhtml',
      label: getString('prefs-title'),
      image: `chrome://${config.addonRef}/content/icons/favicon.png`,
      defaultXUL: true,
    }
    ztoolkit.PreferencePane.register(prefOptions)
  }
}

export class KeyExampleFactory {
  @example
  static registerShortcuts() {
    const keysetId = `${config.addonRef}-keyset`
    const cmdsetId = `${config.addonRef}-cmdset`
    const cmdSmallerId = `${config.addonRef}-cmd-smaller`
    const cmdToggleId = `${config.addonRef}-cmd-toggle`
    const cmdCycleId = `${config.addonRef}-cmd-cycle`
    ztoolkit.Shortcut.register('element', {
      id: `${config.addonRef}-key-toggle`,
      key: 'Z',
      modifiers: 'alt shift',
      xulData: {
        document,
        command: cmdToggleId,
        _parentId: keysetId,
        _commandOptions: {
          id: cmdToggleId,
          document,
          _parentId: cmdsetId,
          oncommand: `Zotero.${config.addonInstance}.hooks.onShortcuts('toggle')`,
        },
      },
      // callback: (keyOptions) => {
      //   const main = window.document.querySelector('#main-window')
      //   ztoolkit.log('Shortcut triggered!', keyOptions)

      //   main?.setAttribute(
      //     'theme',
      //     main.getAttribute('theme') == 'dark' ? 'light' : 'dark'
      //   )
      // },
    })

    ztoolkit.Shortcut.register('element', {
      id: `${config.addonRef}-key-cycle-filter`,
      key: 'C',
      modifiers: 'alt shift',
      xulData: {
        document,
        command: cmdCycleId,
        _parentId: keysetId,
        _commandOptions: {
          id: cmdCycleId,
          document,
          _parentId: cmdsetId,
          oncommand: `Zotero.${config.addonInstance}.hooks.onShortcuts('cycleFilter')`,
        },
      },
      // callback: (keyOptions) => {
      //   const main = window.document.querySelector('#main-window')
      //   ztoolkit.log('Shortcut triggered!', keyOptions)

      //   main?.setAttribute(
      //     'theme',
      //     main.getAttribute('theme') == 'dark' ? 'light' : 'dark'
      //   )
      // },
    })
  }

  @example
  static shortcutToggleCallback() {
    const currentTheme = getPref('current_theme')
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light'
    switchTheme(nextTheme)
  }

  static shortcutCycleFilterCallback() {
    const currentTabID = Zotero_Tabs.selectedID
    if (currentTabID === 'zotero-pane' || !currentTabID) {
      return
    }
    const currentReader = Zotero.Reader.getByTabID(currentTabID)
    cycleFilter(currentReader)
    // const currentTheme = getPref('current_theme')
    // const nextTheme = currentTheme === 'light' ? 'dark' : 'light'
    // switchTheme(nextTheme)
  }
}

export class UIExampleFactory {
  @example
  static registerStyleSheet() {
    const styles = ztoolkit.UI.createElement(document, 'link', {
      properties: {
        type: 'text/css',
        rel: 'stylesheet',
        href: `chrome://${config.addonRef}/content/night.css`,
      },
    })
    document.documentElement.appendChild(styles)

    document
      .querySelector('#main-window')
      ?.setAttribute('theme', getPref('current_theme'))
  }

  @example
  static registerToggleButton() {
    const button = ztoolkit.UI.createElement(document, 'button', {
      properties: {
        textContent: config.themes[getPref('current_theme')].icon,
        onclick: () => {
          const currentTheme = getPref('current_theme')
          const nextTheme = currentTheme === 'light' ? 'dark' : 'light'
          switchTheme(nextTheme)
          button.textContent = config.themes[nextTheme].icon
        },
      },
      attributes: {
        id: config.buttonId,
        style:
          'font-size: 1.5em; background: transparent; border-left: none; border-right: none;border-top: none; border-bottom: .5px solid #a9a9a9;',
      },
    })
    document.querySelector('#tab-bar-container')?.prepend(button)

    document
      .querySelector('#main-window')
      ?.setAttribute('theme', getPref('current_theme'))
  }
}
