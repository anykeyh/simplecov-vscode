// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { existsSync } from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { readResultSet } from './Cache';
import { ISimplecovResultset } from './ISimplecovResultset';

const DECORATIONS = {
	notCovered: vscode.window.createTextEditorDecorationType({
		backgroundColor: new vscode.ThemeColor("coverage.notCovered"),
		isWholeLine: true
	}),
	covered: vscode.window.createTextEditorDecorationType({
		backgroundColor: new vscode.ThemeColor("coverage.covered"),
		isWholeLine: true
	}),
	ignored: vscode.window.createTextEditorDecorationType({
		backgroundColor: new vscode.ThemeColor("coverage.ignored"),
		isWholeLine: true
	})
};

function disableDecorations() {
	let editors = vscode.window.visibleTextEditors;

	editors.forEach(editor => {
		for(let key in DECORATIONS) {
			editor.setDecorations( (<any>DECORATIONS)[key], []);
		}
	});
}

export async function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('simplecov-vscode') as unknown as IConfiguration;
	let enabled = config.enabled;

	function run() {
		if(!enabled) {
			disableDecorations();
			return;
		}

		const currentFilePath = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;

		if(currentFilePath){

			const absoluteFilePath = path.resolve(currentFilePath, config.path);

			const updateView = async () => {
				if (!enabled) { return; }
				decorateFilesWithCoverage(
					vscode.window.visibleTextEditors, await readResultSet(absoluteFilePath)
				);
			};

			if(existsSync(absoluteFilePath)) {
				vscode.window.onDidChangeTextEditorSelection(updateView);
				console.log("UPDATE VIEW?")
				updateView();
			} else {
				vscode.window.showErrorMessage(`simplecov-vscode: resulset json file not found: ${config.path}`);
			}
		}

		function decorateFilesWithCoverage(editors : vscode.TextEditor[], resulset : ISimplecovResultset) {
			editors.forEach(editor => {
				decorateFileWithCoverage(editor, resulset)
			});
		}

		function decorateFileWithCoverage(editor : vscode.TextEditor | undefined, resultSet : ISimplecovResultset) {
			if(!editor) { return; }

			let filename = editor.document.fileName;

			let coverage = resultSet.RSpec.coverage;

			let map;

			// due to difference in versions of output, we boiler plate the structure here.
			if(coverage.lines) {
				map = coverage.lines[filename];
			} else {
				map = (<any>coverage)[filename];
			}

			if(!map) { return; }

			map = map.lines;

			const ranges = {
				notCovered: [] as vscode.Range[],		// not covered by Simplecov.
				covered: [] as vscode.Range[],			// covered by Simplecov
				ignored: []  as vscode.Range[] 			// :nocov: directive
			};

			let ignored = false;

			for(let i = 0; i < editor.document.lineCount; i++) {
				const range = new vscode.Range(i, 0, i, 1);

				const content = editor.document.lineAt(i);

				if(/^[ ]*#[ ]*:nocov:/.test(content.text)) {
					ignored = !ignored;
					ranges.ignored.push(range);
				} else if (ignored){
					ranges.ignored.push(range);
				} else {
					const value = map[i];

					switch(value) {
					case 0:
						ranges.notCovered.push(range);
					break;
					case null:
						/* do nothing for now. This is not a relevant line */
					break;
					case undefined:
						/* the file has been saved and some lines got added. */
					break;
					default: // number > 0
						ranges.covered.push(range);
					}
				}
			}

			editor.setDecorations(DECORATIONS.notCovered, ranges.notCovered);
			editor.setDecorations(DECORATIONS.covered, ranges.covered);
			editor.setDecorations(DECORATIONS.ignored, ranges.ignored);
		};
	}

	context.subscriptions.push(
		vscode.commands.registerCommand('simplecov-vscode.toggle', () => {
			enabled = !enabled;
			vscode.workspace.getConfiguration('simplecov-vscode').update("enabled", enabled);
			run();
		})
	);

	run();
}

// this method is called when your extension is deactivated
export function deactivate() {

}
