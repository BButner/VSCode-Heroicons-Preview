import * as vscode from 'vscode';
import { Events } from './lib/events';
import { detectHeroIcons } from './lib/file'
import { IconHandler } from './lib/icon';

export function activate(context: vscode.ExtensionContext) {
	console.log('Heroicons Preview is now active.');

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

export function deactivate() {}
