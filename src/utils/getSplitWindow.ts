export function getReaderDocument(
  reader: _ZoteroTypes.ReaderInstance,
  secondary = true,
) {
  const readerDocument = reader._iframeWindow?.document

  if (!readerDocument) {
    return null
  }

  const secondaryIFrame = readerDocument.querySelector<HTMLIFrameElement>(
    `#${secondary ? 'secondary' : 'primary'}-view iframe`,
  )

  if (!secondaryIFrame) {
    return null
  }

  const secondaryReaderDocument = secondaryIFrame.contentDocument
  return secondaryReaderDocument
}
