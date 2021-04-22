import * as vscode from 'vscode'
import { readdirSync, existsSync } from 'fs'
import { join } from 'path'

export const detectHeroIcons = async (): Promise<string | null> => {
  const nodeModules: string | null = await findNodeModules()

  let location: string | null = null

  if (nodeModules) {
    try {
      if (existsSync(join(nodeModules + '/@heroicons'))) {
        location = join(nodeModules + '/@heroicons')
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  return location
}

const findNodeModules = async (): Promise<string | null> => {
  let nodeModuleLocation: string | null = null

  if (vscode.workspace.workspaceFolders) {
    const topLevelFolders: ReadonlyArray<vscode.WorkspaceFolder> = vscode.workspace.workspaceFolders

    if (topLevelFolders) {
      const topLevelPath: string = topLevelFolders[0].uri.fsPath
      const dirs: string[] = readdirSync(topLevelPath)
      const potentialNodeModules: string[] = dirs.filter(dir => dir.toLowerCase() === 'node_modules')

      if (potentialNodeModules.length > 0) nodeModuleLocation = join(topLevelPath, potentialNodeModules[0])
    }
  }

  return nodeModuleLocation
}