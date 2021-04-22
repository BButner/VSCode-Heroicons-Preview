import * as vscode from 'vscode';
import { Events } from './lib/events';
import { detectHeroIcons } from './lib/file'
import { IconHandler } from './lib/icon';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Heroicons Preview is now active.');

	// initEventHandlers()

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('heroicons-preview.hipTest', () => {
	// 	svg()
	// });

	// context.subscriptions.push(disposable);

	// if (vscode.window.activeTextEditor) {
	// 	svg()
	// }
	detectHeroIcons()
		.then(location => {
			if (location) {
				const iconHandler: IconHandler = new IconHandler(location)
				const events: Events = new Events(iconHandler)
			} else {
				console.log('not detected')
			}
		})
}

// this method is called when your extension is deactivated
export function deactivate() {}
