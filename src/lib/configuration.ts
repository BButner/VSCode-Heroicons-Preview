import * as vscode from 'vscode'

export enum ConfigurationOption {
  iconColor = 'iconColor',
  iconSize = 'iconSize',
  nodeModulesPath = 'nodeModulesPath',
  fileDecorationExtensions = 'fileDecorationExtensions'
}

export const getConfigurationValue = (configOption: ConfigurationOption): string | string[] | null | undefined => {
  return vscode.workspace.getConfiguration('hip').get(configOption)
}