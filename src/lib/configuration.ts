import * as vscode from 'vscode'

export enum ConfigurationOption {
  iconColor = 'iconColor'
}

export const getConfigurationValue = (configOption: ConfigurationOption): string | null | undefined => {
  return vscode.workspace.getConfiguration('hip').get(configOption)
}