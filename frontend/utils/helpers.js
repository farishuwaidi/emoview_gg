export const autoDash = (text) => {
  return text
    .replace(/-/gi, '')
    .match(/(.{0,3})(.{0,4})(.{0,3})/)
    .slice(1)
    .join('-')
    .replace(/-*$/g, '')
}
