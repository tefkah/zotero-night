declare const _globalThis: {
  [key: string]: any
  Zotero: _ZoteroTypes.Zotero
  ZoteroPane: _ZoteroTypes.ZoteroPane
  Zotero_Tabs: typeof Zotero_Tabs
  window: Window
  document: Document
}

// declare const ztoolkit: import("../src/addon").MyToolkit;
// declare const ztoolkit: import('zotero-plugin-toolkit').ZoteroToolkit

declare const rootURI: string

// declare const addon: import('../src/addon').default

declare const __env__: 'production' | 'development'

declare class Localization {}
