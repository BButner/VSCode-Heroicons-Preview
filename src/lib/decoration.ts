import * as vscode from 'vscode'
import { ConfigurationOption, getConfigurationValue } from './configuration'
import { detectIconStyle } from './detection'
import { IconHandler } from './icon'

const defaultDecorationType: vscode.TextEditorDecorationType = vscode.window.createTextEditorDecorationType({
  rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
  before: {
    height: getConfigurationValue(ConfigurationOption.iconSize)!,
    width: getConfigurationValue(ConfigurationOption.iconSize)!
  }
})

const documentDecorationTypes: DocumentDecorationType[] = []

export const documentIsRegistered = (documentName: string): boolean => {
  return documentDecorationTypes.map(type => type.documentName).includes(documentName)
}

export const registerDocument = (documentName: string): void => {
  documentDecorationTypes.push({
    documentName,
    decorationType: defaultDecorationType
  })
}

export const getDocumentDecorationTypeByName = (documentName: string): vscode.TextEditorDecorationType => {
  return documentDecorationTypes.filter(type => type.documentName === documentName)[0].decorationType
}

interface DocumentDecorationType {
  documentName: string;
  decorationType: vscode.TextEditorDecorationType;
}

export class Decorator {
  private iconHandler: IconHandler

  constructor (iconHandler: IconHandler) {
    this.iconHandler = iconHandler
  }

  decorateEditor = (documentName: string): void => {
    const visibleEditors: vscode.TextEditor[] = vscode.window.visibleTextEditors
    const potentialEditor: vscode.TextEditor[] = visibleEditors.filter(editor => editor.document.fileName === documentName)

    let decorationsArray: any[] = []
    
    if (visibleEditors.length > 0 && potentialEditor.length > 0) {
      const editor: vscode.TextEditor = potentialEditor[0]
      const documentText: string | undefined = editor.document.getText()

      if (documentText) {
        const editorLines: string[] = documentText.split('\n')
        const lineTest: RegExp = new RegExp(this.iconHandler.getIconNames().join('|'))

        for (let line = 0; line < editorLines.length; line++) {
          const foundIcons: string[] = [] // There could be multiple Icons on a single line
          // We find the line that has the Icon Text
          if (lineTest.test(editorLines[line])) {
            const words = editorLines[line].split(' ')

            this.iconHandler.getIconNames().some(
              (icon) => {
                if (words.filter(word => word.includes(icon)).length > 0) {
                  foundIcons.push(icon)
                }
              }
            )
          }

          if (foundIcons.length > 0) {
            foundIcons.forEach(icon => {
              const match: RegExpMatchArray | null = editorLines[line].match(new RegExp(icon))

              if (match !== null && match.index !== undefined) {
                const range: vscode.Range = new vscode.Range(
                  new vscode.Position(line, match.index + match[0].length),
                  new vscode.Position(line, match.index + match[0].length)
                )

                decorationsArray.push({
                  range,
                  renderOptions: {
                    before: {
                      contentIconPath: vscode.Uri.parse(
                        `data:image/svg+xml;utf8,${encodeURI(
                          this.iconHandler.getIconData(icon, detectIconStyle(documentText, icon))
                        )}`
                      )	
                    }
                  }
                })
              }
            })
          }
        }

        editor.setDecorations(
          getDocumentDecorationTypeByName(editor.document.fileName),
          decorationsArray
        )
      }
    }
  }
}