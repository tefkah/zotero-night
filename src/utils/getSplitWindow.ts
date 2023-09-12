export function getReaderDocument(
  reader: _ZoteroTypes.ReaderInstance,
  type: 'secondary' | 'primary' | 'portal' = 'secondary',
) {
  const readerDocument = reader._iframeWindow?.document

  if (!readerDocument) {
    return null
  }

  const iframe = readerDocument.querySelector<HTMLIFrameElement>(
    `#${type}-view iframe`,
  )

  if (!iframe) {
    return null
  }

  const secondaryReaderDocument = iframe.contentDocument

  ztoolkit.log('getReaderDocument', secondaryReaderDocument, type)
  return secondaryReaderDocument
}
