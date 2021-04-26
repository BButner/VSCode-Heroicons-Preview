import * as vscode from 'vscode'
import { readdirSync, existsSync, readFileSync, lstatSync } from 'fs'
import { join } from 'path'

export const detectHeroIcons = async (): Promise<string | null> => {
  const nodeModules: string[] = await findNodeModules()

  let location: string | null = null

  console.log(nodeModules)

  if (nodeModules.length > 0) {
    nodeModules.forEach(dir => {
      if (searchDirForHeroicons(dir)) location = join(dir, '@heroicons')
    })
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
  return readdirSync(dirPath).filter(dir => dir === '@heroicons').length > 0
}

export const getFileDataFromIconName = (iconFileLocation: string): string | null => {
  let iconData: string | null = null

  try {
    iconData = readFileSync(iconFileLocation, 'utf8')
  } catch (ex) {}

  return iconData
}