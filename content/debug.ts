/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable  @typescript-eslint/no-unsafe-return */
// declare const Zotero: any

function to_s(obj: any): string {
  if (typeof obj === 'string') return obj
  const s = `${obj}`
  switch (s) {
    case '[object Object]':
      return JSON.stringify(obj)
    case '[object Set]':
      return JSON.stringify(Array.from(obj)) // eslint-disable-line @typescript-eslint/no-unsafe-argument
    default:
      return s
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function format(...msg: any[][]) {
  return `🌌 Night: ${msg.map(to_s).join(' ')}`
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function debug(
  ...msg: (string | number | Window | HTMLHtmlElement)[]
): void {
  Zotero?.debug(format(msg))
}
