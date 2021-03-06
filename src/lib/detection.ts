import { ConfigurationOption, getConfigurationValue } from "./configuration"

export enum IconStyleType {
  outline = 'outline',
  solid = 'solid'
}

export const detectIconStyle = (documentText: string, iconName: string): IconStyleType => {
  const heroiconImportRegex: RegExp = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s]@heroicons.*([@\w_-]+)["'\s].*(;)?$/gm
  const matches: string[] = [...documentText.matchAll(heroiconImportRegex)].map(entry => entry[0])
  const fallback: string = getConfigurationValue(ConfigurationOption.iconStyleFallback)! as string

  let style: IconStyleType = fallback === IconStyleType.outline ? IconStyleType.outline : IconStyleType.solid

  matches.forEach(match => {
    if (match.includes(iconName) && match.includes('/outline')) style = IconStyleType.outline
    else if (match.includes(iconName) && match.includes('/solid')) style = IconStyleType.solid
  })

  return style
}