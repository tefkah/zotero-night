import {
  BasicExampleFactory,
  KeyExampleFactory,
  UIExampleFactory,
} from './modules/examples'
import { config } from '../package.json'
import { getString, initLocale } from './utils/locale'
import { registerPrefsScripts } from './modules/preferenceScript'
import { createZToolkit } from './utils/ztoolkit'
import { registerReader } from './modules/ui/registerReader'
import { switchTheme } from './modules/ui/switchTheme'
import { getPref, setPref } from './utils/prefs'
import {
  attachInitialEditorStyles,
  registerEditorObserver,
} from './modules/ui/registerEditor'

async function onStartup() {
  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,
  ])
  initLocale()

  BasicExampleFactory.registerPrefs()

  await onMainWindowLoad(window)
}

async function onMainWindowLoad(win: Window): Promise<void> {
  // Create ztoolkit for every window
  addon.data.ztoolkit = createZToolkit()

  KeyExampleFactory.registerShortcuts()
  UIExampleFactory.registerStyleSheet()
  UIExampleFactory.registerToggleButton()
  await registerReader()
  await registerEditorObserver()
  attachInitialEditorStyles()
}

async function onMainWindowUnload(win: Window): Promise<void> {
  ztoolkit.unregisterAll()
  addon.data.dialog?.window?.close()
}

function onShutdown(): void {
  ztoolkit.unregisterAll()
  // clear cache
  Object.entries(cache.mutationObservers).forEach(([id, mo]) => {
    mo.disconnect()
    delete cache.mutationObservers[id]
  })

  cache.mutationObservers = {}

  addon.data.dialog?.window?.close()
  // Remove addon object
  addon.data.alive = false
  delete Zotero[config.addonInstance]
}

/**
 * This function is just an example of dispatcher for Notify events.
 * Any operations should be placed in a function to keep this funcion clear.
 */
async function onNotify(
  event: string,
  type: string,
  ids: Array<string | number>,
  extraData: { [key: string]: any },
) {
  // You can add your code to the corresponding notify type
  ztoolkit.log('notify', event, type, ids, extraData)
  if (
    event == 'select' &&
    type == 'tab' &&
    extraData[ids[0]].type == 'reader'
  ) {
    //  BasicExampleFactory.exampleNotifierCallback()
  } else {
    return
  }
}

/**
 * This function is just an example of dispatcher for Preference UI events.
 * Any operations should be placed in a function to keep this funcion clear.
 * @param type event type
 * @param data event data
 */
async function onPrefsEvent(type: string, data: { [key: string]: any }) {
  switch (type) {
    case 'load':
      registerPrefsScripts(data.window)
      break
    case 'switch':
      switchTheme(data.value)
      ztoolkit.log(data)
      break
    case 'default_filter':
      setPref('default_pdf_filter', data.value)
      ztoolkit.log(data)
      break
    default:
      return
  }
}

function onShortcuts(type: string) {
  switch (type) {
    case 'toggle':
      KeyExampleFactory.shortcutToggleCallback()
      break
    case 'cycleFilter':
      KeyExampleFactory.shortcutCycleFilterCallback()
      break
    default:
      break
  }
}

// Add your hooks here. For element click, etc.
// Keep in mind hooks only do dispatch. Don't add code that does real jobs in hooks.
// Otherwise the code would be hard to read and maintian.

export default {
  onStartup,
  onShutdown,
  onMainWindowLoad,
  onMainWindowUnload,
  onNotify,
  onPrefsEvent,
  onShortcuts,
  //  onDialogEvents,
}
