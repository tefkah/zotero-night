# Zotero Plugin Template

[![zotero target version](https://img.shields.io/badge/Zotero-7-green?style=flat-square&logo=zotero&logoColor=CC2936)](https://www.zotero.org)
[![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)

This is a plugin template for [Zotero](https://www.zotero.org/).

Plugins created with this template:

[![GitHub Repo stars](https://img.shields.io/github/stars/windingwind/zotero-better-notes?label=zotero-better-notes&style=flat-square)](https://github.com/windingwind/zotero-better-notes)
[![GitHub Repo stars](https://img.shields.io/github/stars/windingwind/zotero-pdf-preview?label=zotero-pdf-preview&style=flat-square)](https://github.com/windingwind/zotero-pdf-preview)
[![GitHub Repo stars](https://img.shields.io/github/stars/windingwind/zotero-pdf-translate?label=zotero-pdf-translate&style=flat-square)](https://github.com/windingwind/zotero-pdf-translate)
[![GitHub Repo stars](https://img.shields.io/github/stars/windingwind/zotero-tag?label=zotero-tag&style=flat-square)](https://github.com/windingwind/zotero-tag)
[![GitHub Repo stars](https://img.shields.io/github/stars/iShareStuff/ZoteroTheme?label=zotero-theme&style=flat-square)](https://github.com/iShareStuff/ZoteroTheme)
[![GitHub Repo stars](https://img.shields.io/github/stars/MuiseDestiny/zotero-reference?label=zotero-reference&style=flat-square)](https://github.com/MuiseDestiny/zotero-reference)
[![GitHub Repo stars](https://img.shields.io/github/stars/MuiseDestiny/zotero-citation?label=zotero-citation&style=flat-square)](https://github.com/MuiseDestiny/zotero-citation)
[![GitHub Repo stars](https://img.shields.io/github/stars/MuiseDestiny/ZoteroStyle?label=zotero-style&style=flat-square)](https://github.com/MuiseDestiny/ZoteroStyle)
[![GitHub Repo stars](https://img.shields.io/github/stars/volatile-static/Chartero?label=Chartero&style=flat-square)](https://github.com/volatile-static/Chartero)
[![GitHub Repo stars](https://img.shields.io/github/stars/l0o0/tara?label=tara&style=flat-square)](https://github.com/l0o0/tara)
[![GitHub Repo stars](https://img.shields.io/github/stars/redleafnew/delitemwithatt?label=delitemwithatt&style=flat-square)](https://github.com/redleafnew/delitemwithatt)
[![GitHub Repo stars](https://img.shields.io/github/stars/redleafnew/zotero-updateifsE?label=zotero-updateifsE&style=flat-square)](https://github.com/redleafnew/zotero-updateifsE)
[![GitHub Repo stars](https://img.shields.io/github/stars/northword/zotero-format-metadata?label=zotero-format-metadata&style=flat-square)](https://github.com/northword/zotero-format-metadata)
[![GitHub Repo stars](https://img.shields.io/github/stars/inciteful-xyz/inciteful-zotero-plugin?label=inciteful-zotero-plugin&style=flat-square)](https://github.com/inciteful-xyz/inciteful-zotero-plugin)
[![GitHub Repo stars](https://img.shields.io/github/stars/MuiseDestiny/zotero-gpt?label=zotero-gpt&style=flat-square)](https://github.com/MuiseDestiny/zotero-gpt)
[![GitHub Repo stars](https://img.shields.io/github/stars/zoushucai/zotero-journalabbr?label=zotero-journalabbr&style=flat-square)](https://github.com/zoushucai/zotero-journalabbr)
[![GitHub Repo stars](https://img.shields.io/github/stars/MuiseDestiny/zotero-figure?label=zotero-figure&style=flat-square)](https://github.com/MuiseDestiny/zotero-figure)

📖 [Plugin Development Documentation](https://zotero.yuque.com/books/share/8d230829-6004-4934-b4c6-685a7001bfa0/vec88d) (Chinese, provides English translation)

🛠️ [Zotero Plugin Toolkit](https://github.com/windingwind/zotero-plugin-toolkit) | [API Documentation](https://github.com/windingwind/zotero-plugin-toolkit/blob/master/docs/zotero-plugin-toolkit.md)

ℹ️ [Zotero Type Definitions](https://github.com/windingwind/zotero-types)

📜 [Zotero Source Code](https://github.com/zotero/zotero)

📌 [Zotero Plugin Template](https://github.com/windingwind/zotero-plugin-template) (This repo)

> 👁 Watch this repo so that you can be notified whenever there are fixes & updates.

If you are using this repo, I recommended that you put this badge ([![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)) on your README:

```md
[![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)
```

## Features

> ❗The localization system is upgraded (dtd is deprecated and we do not use .properties anymore). Only supports Zotero 7.0.0-beta.12 or higher now. If you want to support Zotero 6, you may need to use `dtd`, `properties`, and `ftl` at the same time. See the staled branch `zotero6-bootstrap`.

- Event-driven, functional programming, under extensive skeleton;
- Simple and user-friendly, works out-of-the-box.
- ⭐[New!]Auto hot reload! Whenever the source code is modified, automatically compile and reload. [See here→](#auto-hot-reload)
- Abundant examples in `src/modules/examples.ts`, covering most of the commonly used APIs in plugins(using [zotero-plugin-toolkit](https://github.com/windingwind/zotero-plugin-toolkit));
- TypeScript support:
  - Full type definition support for the whole Zotero project, which is written in JavaScript(using [zotero-types](https://github.com/windingwind/zotero-types));
  - Global variables and environment setup;
- Plugin build/test/release workflow:
  - Automatically generate/update plugin id/version, update configrations, and set environment variables(`development/production`);
  - Automatically build and reload code in Zotero;
  - Automatically release to GitHub(using [release-it](https://github.com/release-it/release-it));

## Examples

This repo provides examples for [zotero-plugin-toolkit](https://github.com/windingwind/zotero-plugin-toolkit) APIs.

Search `@example` in `src/examples.ts`. The examples are called in `src/hooks.ts`.

### Basic Examples

- registerNotifier
- registerPrefs, unregisterPrefs

### Shortcut Keys Examples

- registerShortcuts
- exampleShortcutLargerCallback
- exampleShortcutSmallerCallback
- exampleShortcutConflictionCallback

### UI Examples

![image](https://user-images.githubusercontent.com/33902321/211739774-cc5c2df8-5fd9-42f0-9cdf-0f2e5946d427.png)

- registerStyleSheet(the official make-it-red example)
- registerRightClickMenuItem
- registerRightClickMenuPopup
- registerWindowMenuWithSeprator
- registerExtraColumn
- registerExtraColumnWithCustomCell
- registerCustomItemBoxRow
- registerCustomCellRenderer
- registerLibraryTabPanel
- registerReaderTabPanel

### Preference Pane Examples

![image](https://user-images.githubusercontent.com/33902321/211737987-cd7c5c87-9177-4159-b975-dc67690d0490.png)

- Preferences bindings
- UI Events
- Tabel
- Locale

See [`src/modules/preferenceScript.ts`](./src/modules/preferenceScript.ts)

### HelperExamples

![image](https://user-images.githubusercontent.com/33902321/215119473-e7d0d0ef-6d96-437e-b989-4805ffcde6cf.png)

- dialogExample
- clipboardExample
- filePickerExample
- progressWindowExample
- vtableExample(See Preference Pane Examples)

### PromptExamples

An Obsidian-style prompt(popup command input) module. It accepts text command to run callback, with optional display in the popup.

Activate with `Shift+P`.

![image](https://user-images.githubusercontent.com/33902321/215120009-e7c7ed27-33a0-44fe-b021-06c272481a92.png)

- registerAlertPromptExample

## Quick Start Guide

### Install Pre-built `xpi`

See how the examples work by directly downloading the `xpi` file from GitHub release and install it to your Zotero.

This is also how your plugin will be released and used by others.

> The release do not promise any real functions. It is probably not up-to-date.
>
> The `xpi` package is a zip file. However, please don't modify it directly. Modify the source code and build it.

### Build from Source

- Fork this repo/Click `Use this template`;
- Git clone the forked repo;
- Enter the repo folder;
<details >
<summary>💡 Start with GitHub Codespace</summary>

_GitHub CodeSpace_ enables you getting started without the need to download code/IDE/dependencies locally.

Replace the steps above and build you first plugin in 30 seconds!

- Goto top of the [homepage](https://github.com/windingwind/zotero-plugin-template), click the green button `Use this template`, click `Open in codespace`. You may need to login to your GitHub account.
- Wait for codespace to load.

</details>

- Modify the settings in `./package.json`, including:

  ```json5
  {
    version,
    author,
    description,
    homepage,
    config {
      releasepage, // URL to releases(`.xpi`)
      updaterdf, // URL to update.json
      addonName, // name to be displayed in the plugin manager
      addonID, // ID to avoid confliction. IMPORTANT!
      addonRef, // e.g. Element ID prefix
      addonInstance // the plugin's root instance: Zotero.${addonInstance}
    }
  }
  ```

  > Be careful to set the addonID and addonRef to avoid confliction.

- Run `npm install` to set up the plugin and install dependencies. If you don't have NodeJS installed, please download it [here](https://nodejs.org/en/);
- Run `npm run build` to build the plugin in production mode. Run `npm run build-dev` to build the plugin in development mode. The xpi for installation and the built code is under `build` folder.

  > What the difference between dev & prod?
  >
  > - This environment variable is stored in `Zotero.${addonInstance}.data.env`. The outputs to console is disabled in prod mode.
  > - You can decide what users cannot see/use based on this variable.

### Release

To build and release, use

```shell
# A release-it command: version increase, npm run build, git push, and GitHub release
# You need to set the environment variable GITHUB_TOKEN https://github.com/settings/tokens
# release-it: https://github.com/release-it/release-it
npm run release
```

### Setup Development Environment

1. Install a beta version of Zotero: <https://www.zotero.org/support/beta_builds> (Zotero 7 beta: <https://www.zotero.org/support/dev/zotero_7_for_developers>)

2. Install Firefox 102 (for Zotero 7)

3. Copy zotero command line config file. Modify the commands that starts your installation of the beta Zotero.

   > (Optional) Do this only once: Start the beta Zotero with `/path/to/zotero -p`. Create a new profile and use it as your development profile.
   > Put the path of the profile into the `profilePath` in `zotero-cmd.json` to specify which profile to use.

   ```sh
   cp ./scripts/zotero-cmd-default.json ./scripts/zotero-cmd.json
   vim ./scripts/zotero-cmd.json
   ```

4. Build plugin and restart Zotero with `npm run restart`.

5. Launch Firefox 102 (Zotero 7)

6. In Firefox, go to devtools, go to settings, click "enable remote debugging" and the one next to it that's also about debugging

   > Enter `about:debugging#/setup` in FF 102.

7. In Zotero, go to setting, advanced, config editor, look up "debugging" and click on "allow remote debugging".

8. Connect to Zotero in Firefox. In FF 102, enter `localhost:6100` in the bottom input of remote-debugging page and click `add`.

9. Click `connect` in the leftside-bar of Firefox remote-debugging page.

10. Click "Inspect Main Process"

### Auto Hot Reload

Tired of endless restarting? Forget about it!

1. Run `npm run start-watch`. (If Zotero is already running, use `npm run watch`)
2. Coding. (Yes, that's all)

When file changes are detected in `src` or `addon`, the plugin will be automatically compiled and reloaded.

<details style="text-indent: 2em">
<summary>💡 Steps to add this feature to an existing plugin</summary>

1. Copy `scripts/reload.mjs`
2. Copy `reload`, `watch`, and `start-watch` commands in `package.json`
3. Run `npm install --save-dev chokidar-cli`
4. Done.

</details>

### Debug in Zotero

You can also:

- Test code snipastes in Tools->Developer->Run Javascript;
- Debug output with `Zotero.debug()`. Find the outputs in Help->Debug Output Logging->View Output;
- Debug UI. Zotero is built on the Firefox XUL framework. Debug XUL UI with software like [XUL Explorer](https://udn.realityripple.com/docs/Archive/Mozilla/XUL_Explorer).
  > XUL Documentation: <http://www.devdoc.net/web/developer.mozilla.org/en-US/docs/XUL.html>

## Details

### About Hooks

> See also [`src/hooks.ts`](https://github.com/windingwind/zotero-plugin-template/blob/bootstrap/src/hooks.ts)

1. When install/enable/startup triggered from Zotero, `bootstrap.js` > `startup` is called
   - Wait for Zotero ready
   - Load `index.js` (the main entrance of plugin code, built from `index.ts`)
   - Register resources if Zotero 7+
2. In the main entrance `index.js`, the plugin object is injected under `Zotero` and `hooks.ts` > `onStartup` is called.
   - Initialize anything you want, including notify listeners, preference panes, and UI elements.
3. When uninstall/disabled triggered from Zotero, `bootstrap.js` > `shutdown` is called.
   - `events.ts` > `onShutdown` is called. Remove UI elements, preference panes, or anything created by the plugin.
   - Remove scripts and release resources.

### About Global Variables

> See also [`src/index.ts`](https://github.com/windingwind/zotero-plugin-template/blob/bootstrap/src/index.ts)

The bootstrapped plugin runs in a sandbox, which does not have default global variables like `Zotero` or `window`, which we used to have in the overlay plugins' window environment.

This template registers the following variables to the global scope:

```ts
Zotero, ZoteroPane, Zotero_Tabs, window, document, rootURI, ztoolkit, addon;
```

### Create Elements API

The plugin template provides new APIs for bootstrap plugins. We have two reasons to use these APIs, instead of the `createElement/createElementNS`:

- In bootstrap mode, plugins have to clean up all UI elements on exit (disable or uninstall), which is very annoying. Using the `createElement`, the plugin template will maintain these elements. Just `unregisterAll` at the exit.
- Zotero 7 requires createElement()/createElementNS() → createXULElement() for remaining XUL elements, while Zotero 6 doesn't support `createXULElement`. The React.createElement-like API `createElement` detects namespace(xul/html/svg) and creates elements automatically, with the return element in the corresponding TS element type.

```ts
createElement(document, "div"); // returns HTMLDivElement
createElement(document, "hbox"); // returns XUL.Box
createElement(document, "button", { namespace: "xul" }); // manually set namespace. returns XUL.Button
```

### About Build

Use Esbuild to build `.ts` source code to `.js`.

Use `replace-in-file` to replace keywords and configurations defined in `package.json` in non-build files (`xhtml`, `.flt`, et. al.).

Steps in `scripts/build.mjs`:

1. Clean `./build`
2. Copy `./addon` to `./build`
3. Esbuild to `./build/addon/chrome/content/scripts`
4. Replace `__buildVersion__` and `__buildTime__` in `./build/addon`
5. Zip the `./build/addon` to `./build/*.xpi`

### About Zotero API

Zotero docs are outdated and incomplete. Clone <https://github.com/zotero/zotero> and search the keyword globally.

> ⭐The [zotero-types](https://github.com/windingwind/zotero-types) provides most frequently used Zotero APIs. It's included in this template by default. Your IDE would provide hint for most of the APIs.

A trick for finding the API you want:

Search the UI label in `.xhtml`/`.flt` files, find the corresponding key in locale file. Then search this keys in `.js`/`.jsx` files.

### Directory Structure

This section shows the directory structure of a template.

- All `.js/.ts` code files are in `./src`;
- Addon config files: `./addon/manifest.json`;
- UI files: `./addon/chrome/content/*.xhtml`.
- Locale files: `./addon/locale/**/*.flt`;
- Preferences file: `./addon/prefs.js`;
  > Don't break the lines in the `prefs.js`

```shell
.
|-- .eslintrc.json            # eslint conf
|-- .gitattributes            # git conf
|-- .github/                  # github conf
|-- .gitignore                # git conf
|-- .prettierrc               # prettier conf
|-- .release-it.json          # release-it conf
|-- .vscode                   # vs code conf
|   |-- extensions.json
|   |-- launch.json
|   |-- setting.json
|   `-- toolkit.code-snippets
|-- package-lock.json         # npm conf
|-- package.json              # npm conf
|-- LICENSE
|-- README.md
|-- addon
|   |-- bootstrap.js               # addon load/unload script, like a main.c
|   |-- chrome
|   |   `-- content
|   |       |-- icons/
|   |       |-- preferences.xhtml  # preference panel
|   |       `-- zoteroPane.css
|   |-- locale                     # locale
|   |   |-- en-US
|   |   |   |-- addon.ftl
|   |   |   `-- preferences.ftl
|   |   `-- zh-CN
|   |       |-- addon.ftl
|   |       `-- preferences.ftl
|   |-- manifest.json              # addon config
|   `-- prefs.js
|-- build/                         # build dir
|-- scripts                        # scripts for dev
|   |-- build.mjs                  # esbuild and replace
|   |-- reload.mjs
|   |-- start.mjs
|   |-- stop.mjs
|   `-- zotero-cmd-default.json
|-- src                           # source code
|   |-- addon.ts                  # base class
|   |-- hooks.ts                  # lifecycle hooks
|   |-- index.ts                  # main entry
|   |-- modules                   # sub modules
|   |   |-- examples.ts
|   |   `-- preferenceScript.ts
|   `-- utils                     # utilities
|       |-- locale.ts
|       |-- prefs.ts
|       |-- wait.ts
|       `-- window.ts
|-- tsconfig.json                 # https://code.visualstudio.com/docs/languages/jsconfig
|-- typings                       # ts typings
|   `-- global.d.ts
|-- update-template.json          # template of `update.json`
`-- update.json
```

## Disclaimer

Use this code under AGPL. No warranties are provided. Keep the laws of your locality in mind!

If you want to change the license, please contact me at <wyzlshx@foxmail.com>
