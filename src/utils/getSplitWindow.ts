export function getSecondaryReaderDocument(
  reader: _ZoteroTypes.ReaderInstance,
) {
  const readerDocument = reader._iframeWindow?.document

  if (!readerDocument) {
    return null
  }

  const secondaryIFrame = readerDocument.querySelector('iframe')

  if (!secondaryIFrame) {
    return null
  }

  const secondaryReaderDocument = secondaryIFrame.contentDocument
  return secondaryReaderDocument
}
