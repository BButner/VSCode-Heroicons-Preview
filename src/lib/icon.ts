import { readdirSync } from 'fs'
import { join } from 'path'
import { getFileDataFromIconName } from './file'

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
}

const svgString: string = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" stroke="white">'

export class IconHandler {
  private iconCache: IconCacheEntry[] = []
  private iconNames: string[] = []
  private heroIconsLocation: string
  private mode: 'vue' | 'react' | null = null
  private pathRegEx = /React\.createElement\("path",.*?{(.*?)}\)/s
  private pathPropertiesRegEx = /.?(\S+):.?"(.+)"/g

  constructor (heroIconsLocation: string) {
    this.heroIconsLocation = heroIconsLocation

    this.init()
  }

  private init (): void {
    if (readdirSync(this.heroIconsLocation)[0] === 'vue')
      this.mode = 'vue'
    else
      this.mode = 'react'

    this.populateAvailableIconNames()
  }

  getIconData = (iconName: string): string => {
    const iconData: string | null = getFileDataFromIconName(join(this.getIconPath() + '/' + iconName + '.js'))

    if (iconData) return this.serializeIconFromData(iconData)

    return ''
  }

  private populateAvailableIconNames = (): void => {
    this.iconNames = readdirSync(this.getIconPath())
      .filter(name => name.substring(name.length - 3, name.length) === '.js' && !name.includes('index'))
      .map(name => name.replace('.js', ''))
  }

  getIconNames = (): string[] => {
    return this.iconNames
  }

  private getIconPath = (): string => {
    return join(this.heroIconsLocation + '/' + this.mode + '/outline')
  }

  private serializeIconFromData = (iconFileData: string): string => {
    const paths: string[] = []
    const match: RegExpMatchArray | null = iconFileData.match(this.pathRegEx)

    if (match) {
      match.forEach(match => paths.push(
        '<path ' + this.cleanPathProperties(match) + '>'
      ))
    }

    return svgString + paths.join('') + '</path>'.repeat(paths.length) + '</svg>'
  }

  private cleanPathProperties = (path: string): string => {
    const cleanedProperties: string[] = []
    const match: Array<string[]> = [...path.matchAll(this.pathPropertiesRegEx)] // This is where the issue lies

    if (match.length > 0) {
      const props: string[] = match.map(m => m[0].trim())

      props.forEach(prop =>{
        const propName: string = prop.split(':')[0] // Original Property name
        const cleanedPropName: string | undefined = cleanedVariables[propName] // Cleaned Property name
        let cleanedProperty: string = prop

        if (cleanedPropName) cleanedProperty = cleanedProperty.replace(propName, cleanedPropName)

        cleanedProperties.push(
          cleanedProperty.replace(': ', '=')
        )
      })
    }

    return cleanedProperties.join(' ')
  }
}