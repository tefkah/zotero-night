import { config } from '../../../package.json'
import { getPref } from '../../utils/prefs'
import { sleep, waitUtilAsync } from '../../utils/wait'
import tab from '../../styles/tab.scss'
import { addFilterToReader, cycleFilter, getFilterByID } from './filterSchema'
import { getSecondaryReaderDocument } from '../../utils/getSplitWindow'
import { TagElementProps } from 'zotero-plugin-toolkit/dist/tools/ui'

const filters = {
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

// export function addTab() {
//   const BNotes = Zotero.BetterNotes
//   ztoolkit.log('BNotes', BNotes)

//   const iframes = BNotes.data.workspace.tab.container.querySelectorAll('iframe')
//   ztoolkit.log('iframes', iframes)

//   iframes.forEach((iframe) => {
//     const doc = iframe.contentDocument
//     attachTabStylesToReaderWindow(doc!)
//   })
// }

export function registerReader() {
  ztoolkit.ReaderInstance.register('initialized', 'night', async (instance) => {
    await instance._waitForReader()
    await instance._initPromise

    ztoolkit.log('registerReader', instance)
    //  await instance._splitVertically()

    const doc = instance._iframeWindow?.document

    addFilterToggleButton(instance)
    addFilterToReader(instance)

    const secondViewDoc = getSecondaryReaderDocument(instance)

    addSplitMutationObserver(instance)
    ;[doc, secondViewDoc].forEach(async (doc, idx) => {
      if (idx === 1) {
        await sleep(1000)
        ztoolkit.log('registering styles for window', idx, doc)
      }
      attachTabStylesToReaderWindow(doc!)
    })
  })
}

function hasToggle(readerWindow: Window): boolean {
  return !!readerWindow.document.querySelector('#night-toggle')
}

function addSplitMutationObserver(reader: _ZoteroTypes.ReaderInstance) {
  const doc = reader._iframeWindow?.document
  if (!doc) {
    return
  }

  const splitWrapper = doc?.querySelector('#splitWrapper')

  const prevMutationObserver =
    cache.mutationObservers[reader.itemID?.toString() ?? '']

  if (prevMutationObserver) {
    prevMutationObserver.disconnect()
  }

  const observer = new window.MutationObserver(async (mutationsList) => {
    ztoolkit.log(mutationsList)
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

        // If the window is not split, do nothing
        if (
          !newClassValue.includes('split') ||
          mutation.oldValue?.includes('split')
        ) {
          return
        }

        const secondViewDoc = getSecondaryReaderDocument(reader)
        if (!secondViewDoc) {
          return
        }

        attachTabStylesToReaderWindow(secondViewDoc!)

        addFilterToReader(reader)
      }
    }
  })

  if (splitWrapper) {
    // Start observing the target element for attribute changes
    observer.observe(splitWrapper, {
      attributes: true,
      attributeOldValue: true,
    })
    cache.mutationObservers[reader.itemID?.toString() ?? ''] = observer
  }
}

function addFilterToggleButton(reader: _ZoteroTypes.ReaderInstance) {
  const readerWindow = reader._iframeWindow!
  if (hasToggle(readerWindow)) {
    ztoolkit.log('addToggleButton', 'window already has toggle')
    return
  }

  const filterForReader = getFilterByID(reader.itemID as number)

  const toggle: HTMLButtonElement = ztoolkit.UI.createElement(
    readerWindow.document,
    'button',
    {
      attributes: {
        id: 'night-toggle',
        'data:filter': filterForReader.icon,
      },
      properties: {
        textContent: filterForReader.icon,
        onclick: () => {
          // toggleFilterOnClick(readerWindow)
          const nextFilter = cycleFilter(reader)
          //         toggle.setAttribute('data:filter', _currentFilter)
          const icon = nextFilter.icon // getCurrentFilterIcon()

          toggle.textContent = icon
        },
      },
      styles: {
        filter: '0 !important',
        height: '20px',
        width: '20px',
        marginRight: '20px',
      },
    },
  )

  const middleToolbar = readerWindow.document.querySelector(
    '#toolbarViewerMiddle',
  )

  if (!middleToolbar) {
    ztoolkit.log('addToggleButton: no middle toolbar')
    return
  }

  middleToolbar.prepend(toggle)
}

const existingStyle = (element: HTMLElement | Document) =>
  element.querySelector('#pageStyle')

function attachTabStylesToReaderWindow(doc: Document) {
  const alreadyExistingStyle = existingStyle(doc)

  const props: TagElementProps = {
    tag: 'style',
    attributes: {
      id: 'pageStyle',
    },
    properties: {
      textContent: tab,
    },
  }

  /**
   * Set the theme to dark
   */
  doc.querySelector('html[dir]')?.setAttribute('theme', 'dark')

  if (alreadyExistingStyle) {
    ztoolkit.UI.replaceElement(props, alreadyExistingStyle)
    return
  }

  ztoolkit.UI.appendElement(props, doc.body)
}
