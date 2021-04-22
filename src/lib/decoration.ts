import * as vscode from 'vscode'

interface DocumentDecorationType {
  documentName: string;
  decorationType: vscode.TextEditorDecorationType;
}

const defaultDecorationType = vscode.window.createTextEditorDecorationType({
  before: {
		margin: '.1em',
		height: '1em',
		width: '1em',
	}
})

const svg: string = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white"><path transform-origin="12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>`

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

export const decorateEditor = (documentName: string): void => {
  const visibleEditors: vscode.TextEditor[] = vscode.window.visibleTextEditors
  const potentialEditor: vscode.TextEditor[] = visibleEditors.filter(editor => editor.document.fileName === documentName)

  let decorationsArray = []
  
  if (visibleEditors.length > 0 && potentialEditor.length > 0) {
    const editor: vscode.TextEditor = potentialEditor[0]
    const documentText: string | undefined = editor.document.getText()

    if (documentText) {
      const editorLines: string[] = documentText.split('\n')
		  const regex: RegExp = /ChevronDownIcon/

      for (let line = 0; line < editorLines.length; line++) {
        let match: RegExpMatchArray | null = editorLines[line].match(regex)
  
        if (match !== null && match.index !== undefined) {
          let range: vscode.Range = new vscode.Range(
            new vscode.Position(line, match.index + match[0].length),
            new vscode.Position(line, match.index + match[0].length)
          )
  
          decorationsArray.push({
            range,
            renderOptions: {
              before: {
                contentIconPath: vscode.Uri.parse(
                  `data:image/svg+xml;utf8,${encodeURI(svg)}`
                )	
              }
            }
          })
        }
      }
    }

    editor.setDecorations(
      getDocumentDecorationTypeByName(editor.document.fileName),
      decorationsArray
    )
  }
}