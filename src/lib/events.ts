import * as vscode from 'vscode'
import { decorateEditor, documentIsRegistered, registerDocument } from './decoration';
import { IconHandler } from './icon';

export class Events {
	private timeout: NodeJS.Timeout | null = null
	private iconHandler: IconHandler

	constructor (iconHandler: IconHandler) {
		this.iconHandler = iconHandler

		this.init()
	}

	private init = (): void => {
		vscode.workspace.onDidChangeTextDocument(this.changed)
		vscode.workspace.onDidOpenTextDocument(this.opened)
	}

	private opened = (openedDocument: vscode.TextDocument) => {
		const cleanedDocumentName: string = this.cleanFileName(openedDocument.fileName)

		console.log(cleanedDocumentName)

		if (!documentIsRegistered(cleanedDocumentName)) {
			registerDocument(cleanedDocumentName)
		}

		// decorateEditor(cleanedDocumentName)

		const potentialEditor: vscode.TextEditor[] = vscode.window.visibleTextEditors.filter(editor => editor.document.fileName === cleanedDocumentName)

		if (potentialEditor.length > 0) {
			if (new RegExp(this.iconHandler.getIconNames().join('|')).test(potentialEditor[0].document.getText())) {
				// we now need to decorate
			}
		}
	}

	private changed = (changeEvent: vscode.TextDocumentChangeEvent): void => {
		if (this.timeout) clearTimeout(this.timeout)

		this.timeout = setTimeout(() => {
			console.log('timeout fired')

			if (!documentIsRegistered(changeEvent.document.fileName)) {
				registerDocument(changeEvent.document.fileName)
			}
		
			decorateEditor(changeEvent.document.fileName)
		}, 500)
	}

	private cleanFileName = (fileName: string): string => {
		if (fileName.length > 5) {
			if (fileName.substr(fileName.length - 4, fileName.length - 1).toLowerCase() === '.git') {
				return fileName.slice(0, -4)
			} else {
				return fileName
			}
		} else {
			return fileName
		}
	}
}