import { hexToFilter } from './hexToFilter.js'
import { getReaderDocument } from '../../utils/getSplitWindow.js'
import { getPref, setPref } from '../../utils/prefs.js'
import { sleep } from '../../utils/wait.js'
import { ElementProps } from 'zotero-plugin-toolkit/dist/tools/ui.js'
import { Filter, Filters, filterSchema } from './types.js'
import { defaultFilters } from './defaultFilters.js'

const filterId = 'pdf-filter'

export const createFilter = (filter: Filter) => filterSchema.parse(filter)

export const createFilterFromHex = (
  filter: Omit<Filter, 'filter'>,
  hex: string,
) =>
  createFilter({
    ...filter,
    filter: hexToFilter(hex).result.filter,
  })

export const getFilters = (): Filters => {
  const customFilters = getPref('filters')
  if (!customFilters) {
    const filters = defaultFilters
    setPref('filters', filters)
    return filters as Filters
  }
  return customFilters
}

export const getFilter = (name: string): Filter => {
  const filters = getFilters()
  return filters[name]
}

export const getFiltersByID = () => {
  const filtersByID = getPref('filters_by_id')
  return filtersByID ?? {}
}

export const setFilterByID = (id: number, name: string) => {
  const filtersByID = getFiltersByID()
  filtersByID[id] = name
  return setPref('filters_by_id', filtersByID)
}

export const getFilterByID = (id: number) => {
  const filtersByID = getFiltersByID()
  const filterName = filtersByID[id]

  if (!filterName) {
    const defaultFilterName = getDefaultFilter()
    setFilterByID(id, defaultFilterName)
    return getFilter(defaultFilterName)
  }
  return getFilter(filterName)
}

export const getReaderFilters = (reader: _ZoteroTypes.ReaderInstance) => {
  const primary = getReaderDocument(reader, false)?.querySelector(
    `#${filterId}`,
  )
  const secondary = getReaderDocument(reader)?.querySelector(`#${filterId}`)

  ztoolkit.log(
    'getReaderFilters',
    primary,
    secondary,
    getReaderDocument(reader),
  )

  return [primary, secondary]
}

export function readerHasFilter(reader: _ZoteroTypes.ReaderInstance) {
  return getReaderFilters(reader)?.length == 2
}

export function saveFiltersByID(pair?: { id: number; key: string }) {
  const filtersByID = getFiltersByID()

  if (pair) {
    filtersByID[pair?.id] = pair?.key
    ztoolkit.log('saveFiltersByID', pair, filtersByID)
  }

  setPref('filters_by_id', filtersByID)
}

export function removeFiltersFromReader(reader: _ZoteroTypes.ReaderInstance) {
  const filter = getReaderFilters(reader)
  filter?.forEach((filter) => filter?.remove())
}

export function getDefaultFilter() {
  return getPref('default_pdf_filter') ?? 'nord'
}

export function cycleFilter(reader: _ZoteroTypes.ReaderInstance) {
  const currentFilter = getReaderFilters(reader)
  // getFilterByID(reader.itemID!)

  const filters = Object.keys(getFilters())

  // const currentIndex = filters.findIndex((filter) =>
  //   [...(currentFilter[0] ?? [])].some((f) => f?.className === filter),
  // )
  const currentIndex = filters.findIndex(
    (filter) => filter === currentFilter[0]?.className,
  )

  const nextIndex = (currentIndex + 1) % filters.length

  const nextFilter = filters[nextIndex]

  ztoolkit.log('cycleFilter', {
    currentFilter,
    currentIndex,
    nextIndex,
    filters,
  })

  addFilterToReader(reader, nextFilter)

  return getFilter(nextFilter)
}

export function addFilterToReader(
  reader: _ZoteroTypes.ReaderInstance,
  key?: string,
) {
  // if (readerHasFilter(reader)) {
  //   ztoolkit.log('REMOVING')
  //   removeFiltersFromReader(reader)
  // }

  const currentFilter = getFilterByID(reader.itemID!)
  key ??= currentFilter.name ?? getDefaultFilter()
  ztoolkit.log('KEY', currentFilter, key)

  const primaryDocument = getReaderDocument(reader, false)
  const secondaryDocument = getReaderDocument(reader)

  ;[primaryDocument, secondaryDocument].forEach(async (doc, idx) => {
    if (!doc) {
      ztoolkit.log('addFilterToReader', 'no document')
      return
    }

    if (idx === 1) {
      //    await sleep(100)
    }

    ztoolkit.log('addFilterToReader', 'doc', idx, doc)

    const filterElement = createOrReplaceFilterElement(doc, key!)

    // doc?.head?.appendChild(filterElement)
  })

  saveFiltersByID({
    id: reader.itemID!,
    key,
  })

  return true
}

export function setFilterForReader(
  reader: _ZoteroTypes.ReaderInstance,
  key: string,
) {
  if (!readerHasFilter(reader)) {
    ztoolkit.log('does not have filter')
    addFilterToReader(reader, key)
  }

  const windowsWithFilters = getReaderFilters(reader)

  windowsWithFilters?.forEach((filter) => {
    if (!filter) {
      return
    }

    filter.setAttribute('class', key)
    filter.textContent = createFilterString(getFilter(key).filter)
  })

  saveFiltersByID({
    id: reader.itemID!,
    key,
  })
}

export function createFilterString(filterCSS: string) {
  return `[theme='dark'] .page .canvasWrapper canvas:not(.selectionCanvas) { filter:  ${filterCSS} }`
}

function createFilterElementProperties(filter: string) {
  const filterCSS = getFilter(filter)?.filter

  if (!filterCSS) {
    throw new Error(`Filter ${filter} not found`)
  }
  return {
    attributes: {
      id: filterId,
      class: filter,
    },
    properties: {
      textContent: createFilterString(filterCSS),
    },
    namespace: 'html',
  } as ElementProps
}

export function createOrReplaceFilterElement(
  document: Document,
  filter: string,
) {
  const existingFilterElement = document.querySelector(`#${filterId}`)

  const filterProperties = createFilterElementProperties(filter)

  const filterElement = existingFilterElement
    ? ztoolkit.UI.replaceElement(
        { tag: 'style', ...filterProperties },
        existingFilterElement,
      )
    : ztoolkit.UI.appendElement(
        { tag: 'style', ...filterProperties },
        document.head,
      )

  return filterElement
}
