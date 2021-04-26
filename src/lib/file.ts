import * as vscode from 'vscode'
import { readdirSync, existsSync, readFileSync, lstatSync } from 'fs'
import { join } from 'path'
import { ConfigurationOption, getConfigurationValue } from './configuration'

export const detectHeroIcons = async (): Promise<string | null> => {
  const nodeModules: string[] = await findNodeModules()

  let location: string | null = null

  if (nodeModules.length > 0) {
    nodeModules.forEach(dir => {
      if (searchDirForHeroicons(dir)) location = join(dir, '@heroicons')
    })
  }

  if (!location) {
    const nodeConfigurationOption: string | null | undefined = getConfigurationValue(ConfigurationOption.nodeModulesPath)

    console.log('nodeConfigurationOption', nodeConfigurationOption)

    if (nodeConfigurationOption) {
      const topLevelDirs: ReadonlyArray<vscode.WorkspaceFolder> | undefined = vscode.workspace.workspaceFolders

      if (topLevelDirs) {
        const topLevelDir: string = topLevelDirs[0].uri.fsPath // rootPath is deprecated
        console.log(topLevelDirs)
  
        const customNodeLocation: string = join(topLevelDir, nodeConfigurationOption)

        if (existsSync(customNodeLocation)) {
          if (customNodeLocation.includes('node_modules')) {
            // Path is directly to node_modules
            if (searchDirForHeroicons(customNodeLocation)) location = join(customNodeLocation, '@heroicons')
            else vscode.window.showErrorMessage('Could not find @heroicons in specified node_modules1. Specified path: ' + customNodeLocation)
          } else {
            if (searchDirForNodeModules(customNodeLocation)) {
              // Path contains node_modules directory
              if (searchDirForHeroicons(join(customNodeLocation, 'node_modules'))) location = join(customNodeLocation, 'node_modules', '@heroicons')
              else vscode.window.showErrorMessage('Could not find @heroicons in specified node_modules2. Specified path: ' + customNodeLocation)
            } else vscode.window.showErrorMessage('Could not find specified node_modules. Specified path: ' + customNodeLocation)
          }
        } else {
          console.log('does not exist')
          vscode.window.showErrorMessage('Could not find specified node_modules. Specified path: ' + customNodeLocation)
        }
      }
    }
  }

  return location
}

const findNodeModules = async (): Promise<string[]> => {
  const nodeModuleLocations: string[] = []

  if (vscode.workspace.workspaceFolders) {
    const topLevelFolders: ReadonlyArray<vscode.WorkspaceFolder> = vscode.workspace.workspaceFolders

    if (topLevelFolders.length > 0) {
      topLevelFolders.forEach(folder => {
        console.log(folder.uri.fsPath)
        const dirs: string[] = readdirSync(folder.uri.fsPath)

        // Search Top Level Direcotry for node_modules
        if (searchDirForNodeModules(folder.uri.fsPath)) {
          nodeModuleLocations.push(join(folder.uri.fsPath, 'node_modules'))
        }

        // Search Top Level Subdirectories for node_modules
        dirs.forEach(dir => {
          const dirPath: string = join(folder.uri.fsPath, dir)

          if (lstatSync(dirPath).isDirectory()) {
            if (searchDirForNodeModules(dirPath)) nodeModuleLocations.push(join(dirPath, 'node_modules'))
          }
        })
      })
    }
  }

  return nodeModuleLocations
}

const searchDirForNodeModules = (dirPath: string): boolean => {
  console.log('Searching Dir:', dirPath)
  return readdirSync(dirPath).filter(dir => dir === 'node_modules').length > 0
}

const searchDirForHeroicons = (dirPath: string): boolean => {
  console.log('Searching Dir for Heroicons:', dirPath)
  return readdirSync(dirPath).filter(dir => dir === '@heroicons').length > 0
}

export const getFileDataFromIconName = (iconFileLocation: string): string | null => {
  let iconData: string | null = null

  try {
    iconData = readFileSync(iconFileLocation, 'utf8')
  } catch (ex) {}

  return iconData
}