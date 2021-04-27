import { readdirSync } from 'fs'
import { join } from 'path'
import { getFileDataFromIconName } from './file'
import { IconStyleType } from './detection'
import { ConfigurationOption, getConfigurationValue } from './configuration'

const cleanedVariables: Record<string, string> = {
   'fillRule': 'fill-rule',
   'clipRule': 'clip-rule',
   'srokeLinecap': 'stroke-linecap',
   'strokeLinejoin': 'stroke-linejoin',
   'strokeWidth': 'stroke-width',
}

interface IconCacheEntry {
  iconName: string;
  iconData: string;
  iconStyle: IconStyleType;
}

enum HeroiconsMode {
  react = 'react',
  vue = 'vue'
}

export class IconHandler {
  private iconCache: IconCacheEntry[] = []
  private iconNames: string[] = []
  private heroIconsLocation: string
  private mode: HeroiconsMode | null = null
  private pathRegExReact = /React\.createElement\("path",.*?{(.*?)}\)/gms
  private pathRegExVue = /_createVNode\("path",.*?{(.*?)}\)/gms
  private pathPropertiesRegEx = /.?(\S+):.?"(.+)"/gm

  constructor (heroIconsLocation: string) {
    this.heroIconsLocation = heroIconsLocation

    this.init()
  }

  private init (): void {
    if (readdirSync(this.heroIconsLocation)[0] === 'vue')
      this.mode = HeroiconsMode.vue
    else
      this.mode = HeroiconsMode.react

    this.populateAvailableIconNames()
  }

  getIconData = (iconName: string, iconStyle: IconStyleType): string => {
    if (!this.isIconCached(iconName, iconStyle)) {
      const iconData: string | null = getFileDataFromIconName(join(this.getIconPath(iconStyle) + '/' + iconName + '.js'))

      if (iconData) {
        const serializedIconData: string = this.serializeIconFromData(iconData)
        this.cacheIconData(iconName, serializedIconData, iconStyle)
        return this.getSVGString(iconStyle) + serializedIconData + '</svg>'
      }
    } else {
      return this.getSVGString(iconStyle) + this.getIconDataFromCache(iconName, iconStyle) + '</svg>'
    }

    return ''
  }

  private populateAvailableIconNames = (): void => {
    this.iconNames = readdirSync(this.getIconPath(IconStyleType.outline))
      .filter(name => name.substring(name.length - 3, name.length) === '.js' && !name.includes('index'))
      .map(name => name.replace('.js', ''))
  }

  getIconNames = (): string[] => {
    return this.iconNames
  }

  private getIconPath = (iconStyle: string): string => {
    return join(this.heroIconsLocation + '/' + this.mode + '/' + iconStyle)
  }

  private isIconCached = (iconName: string, iconStyle: IconStyleType): boolean => {
    return this.iconCache.filter(icon => icon.iconName === iconName && icon.iconStyle === iconStyle).length !== 0
  }

  private cacheIconData = (iconName: string, iconData: string, iconStyle: IconStyleType): void => {
    this.iconCache.push({ iconName, iconData, iconStyle })
  }

  private getIconDataFromCache = (iconName: string, iconStyle: IconStyleType): string => {
    return this.iconCache.filter(icon => icon.iconName === iconName && icon.iconStyle === iconStyle)[0].iconData
  }

  private serializeIconFromData = (iconFileData: string): string => {
    const paths: string[] = []
    const match: RegExpMatchArray | null = iconFileData.match(this.mode === HeroiconsMode.react ? this.pathRegExReact : this.pathRegExVue)

    if (match) {
      match.forEach(match => paths.push(
        '<path ' + this.cleanPathProperties(match) + ' />'
      ))
    }

    return paths.join('')
  }

  private getSVGString = (iconStyle: IconStyleType): string => {
    const color: string = getConfigurationValue(ConfigurationOption.iconColor)! // Force string because it will return the custom value, OR the default value

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" transform-origin="0 0 12 12" ` + (iconStyle === IconStyleType.solid ?
      `fill="${color}"`.replace('#', '%23') : `fill="none" stroke="${color}"`.replace('#', '%23'))
      + '>'
  }

  private cleanPathProperties = (path: string): string => {
    const cleanedProperties: string[] = []
    const match: Array<string[]> = [...path.matchAll(this.pathPropertiesRegEx)]

    if (match.length > 0) {
      const props: string[] = match.map(m => m[0].trim())

      props.forEach(prop =>{
        const propName: string = prop.split(':')[0].replace(/"/g, '') // Original Property name
        const cleanedPropName: string | undefined = cleanedVariables[propName] // Cleaned Property name
        let cleanedProperty: string = prop.replace(prop.split(':')[0], propName)

        if (cleanedPropName) cleanedProperty = cleanedProperty.replace(propName, cleanedPropName)

        cleanedProperties.push(
          cleanedProperty.replace(': ', '=')
        )
      })
    }

    return cleanedProperties.join(' ')
  }
}