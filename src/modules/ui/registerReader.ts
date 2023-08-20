import { getPref } from '../../utils/prefs'
import { waitUtilAsync } from '../../utils/wait'
import tab from '../../styles/tab.scss'
import { addFilterToReader, cycleFilter, getFilterByID } from './filterSchema'
import { getSecondaryReaderDocument } from '../../utils/getSplitWindow'
import { TagElementProps } from 'zotero-plugin-toolkit/dist/tools/ui'

export async function registerReader() {
  ztoolkit.ReaderInstance.register('initialized', 'night', async (instance) => {
    await instance._waitForReader()
    await instance._initPromise

    ztoolkit.log('registerReader', instance)

    const doc = instance._iframeWindow?.document

    addFilterToggleButton(instance)
    addFilterToReader(instance)

    attachTabStylesToReaderWindow(doc!)

    addSplitMutationObserver(instance)
    try {
      await waitUtilAsync(() => {
        const secondviewdoc = getSecondaryReaderDocument(instance)
        ztoolkit.log('2️⃣ secondviewdoc', secondviewdoc)
        return (
          secondviewdoc?.URL === 'resource://zotero/pdf-reader/viewer.html?'
        )
      })
      const secondViewDoc = getSecondaryReaderDocument(instance)

      if (secondViewDoc) {
        attachTabStylesToReaderWindow(secondViewDoc!)
        try {
          addFilterToReader(instance)
        } catch (e) {
          Zotero.log(e)
        }
      }
    } catch (e) {
      ztoolkit.log(e)
    }
    // ;[doc, secondViewDoc].forEach(async (doc, idx) => {
    //   if (idx === 1) {
    //     ztoolkit.log('registering styles for window', idx, doc)
    //   }
    // })
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
        // @ts-expect-error it do
        const newClassValue = mutation.target.className

        // If the window is not split, do nothing
        if (
          !newClassValue.includes('split') ||
          mutation.oldValue?.includes('split')
        ) {
          return
        }

        await waitUtilAsync(() => {
          const secondviewdoc = getSecondaryReaderDocument(reader)
          ztoolkit.log('2️⃣ secondviewdoc', secondviewdoc)
          return (
            secondviewdoc?.URL === 'resource://zotero/pdf-reader/viewer.html?'
          )
        })

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
        style: 'display: none; height: 20px; width: 20px; marginRight: 20px',
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
  doc
    .querySelector('html[dir]')
    ?.setAttribute('theme', getPref('current_theme'))

  if (alreadyExistingStyle) {
    ztoolkit.UI.replaceElement(props, alreadyExistingStyle)
    return
  }

  ztoolkit.UI.appendElement(props, doc.body)
}
