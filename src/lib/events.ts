import * as vscode from 'vscode'
import { ConfigurationOption, getConfigurationValue } from './configuration';
import { documentIsRegistered, registerDocument, Decorator } from './decoration';
import { IconHandler } from './icon';

export class Events {
	private timeout: NodeJS.Timeout | null = null
	private iconHandler: IconHandler
	private decorator: Decorator

	constructor (iconHandler: IconHandler) {
		this.iconHandler = iconHandler
		this.decorator = new Decorator(iconHandler)
		this.init()
	}

	private init = (): void => {
		vscode.workspace.onDidChangeTextDocument(this.changed)
		vscode.workspace.onDidOpenTextDocument(this.opened)
		vscode.workspace.onDidChangeConfiguration(this.configChanged)
	}

	private configChanged = () =>{
		const editors: vscode.TextEditor[] = vscode.window.visibleTextEditors

		console.log('config changed')

		editors.forEach(editor => {
			if (editor.document && editor.document.getText()) {
				const cleanedDocumentName: string = this.cleanFileName(editor.document.fileName)

				if (!documentIsRegistered(cleanedDocumentName)) {
					registerDocument(cleanedDocumentName)
				}

				if (new RegExp(this.iconHandler.getIconNames().join('|')).test(editor.document.getText())) {
					this.decorator.decorateEditor(cleanedDocumentName)
				}
			}
		})
	}

	private opened = (openedDocument: vscode.TextDocument) => {
		const cleanedDocumentName: string = this.cleanFileName(openedDocument.fileName)

		if (!documentIsRegistered(cleanedDocumentName)) {
			registerDocument(cleanedDocumentName)
		}

		const potentialEditor: vscode.TextEditor[] = vscode.window.visibleTextEditors.filter(editor => editor.document.fileName === cleanedDocumentName)

		if (potentialEditor.length > 0) {
			if (new RegExp(this.iconHandler.getIconNames().join('|')).test(potentialEditor[0].document.getText())) {
				this.decorator.decorateEditor(cleanedDocumentName)
			}
		}
	}

	private changed = (changeEvent: vscode.TextDocumentChangeEvent): void => {
		if (this.timeout) clearTimeout(this.timeout)

		this.timeout = setTimeout(() => {
			if (!documentIsRegistered(changeEvent.document.fileName)) {
				registerDocument(changeEvent.document.fileName)
			}
		
			this.decorator.decorateEditor(changeEvent.document.fileName)
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