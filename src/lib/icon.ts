import { readdirSync } from 'fs'
import { join } from 'path'

interface IconCacheEntry {
  iconName: string;
  iconData: string;
}

export class IconHandler {
  private iconCache: IconCacheEntry[] = []
  private iconNames: string[] = []
  private heroIconsLocation: string
  private mode: 'vue' | 'react' | null = null

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

    console.log(this.iconNames)
  }

  getIconData = (): void => {
    
  }

  private populateAvailableIconNames = (): void => {
    this.iconNames = readdirSync(this.getIconPath())
      .filter(name => name.substring(name.length - 3, name.length) === '.js')
      .map(name => name.replace('.js', ''))
  }

  getIconNames = (): string[] => {
    return this.iconNames
  }

  private getIconPath = (): string => {
    return join(this.heroIconsLocation + '/' + this.mode + '/solid')
  }
}