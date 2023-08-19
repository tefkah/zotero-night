import { ColumnOptions } from 'zotero-plugin-toolkit/dist/helpers/virtualizedTable'
import { DialogHelper } from 'zotero-plugin-toolkit/dist/helpers/dialog'
import hooks from './hooks'
import { createZToolkit } from './utils/ztoolkit'

export type Cache = {
  mutationObservers: Record<string, MutationObserver>
}

class Addon {
  public data: {
    alive: boolean
    // Env type, see build.js
    env: 'development' | 'production'
    ztoolkit: ZToolkit
    locale?: {
      current: any
    }
    prefs?: {
      window: Window
      columns: Array<ColumnOptions>
      rows: Array<{ [dataKey: string]: string }>
    }
    dialog?: DialogHelper
    cache: Cache
  }
  // Lifecycle hooks
  public hooks: typeof hooks
  // APIs
  public api: object

  constructor() {
    this.data = {
      alive: true,
      env: __env__,
      ztoolkit: createZToolkit(),
      cache: {
        mutationObservers: {},
      },
    }
    this.hooks = hooks
    this.api = {}
  }
}

export default Addon
