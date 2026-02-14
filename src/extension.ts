import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

  const disposable = vscode.commands.registerCommand(
    'gen-code-ai.generateConstructor',
    async () => {

      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const document = editor.document;
      const code = document.getText();

      const apiResponse = await fetch(
        "http://localhost:3000/generate-constructor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            code,
            filename: document.fileName
          })
        }
      );

      const data = await apiResponse.json() as GenerateConstructorResponse;

      console.log("happyCode backend response:", data);

      if (!data.diff) {
        vscode.window.showErrorMessage("Backend no devolvió diff 😢");
        return;
      }

      const diff = data.diff;



      const edit = new vscode.WorkspaceEdit();

      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(code.length)
      );

      edit.replace(document.uri, fullRange, applyDiff(code, diff!));

      await vscode.workspace.applyEdit(edit);

      vscode.window.showInformationMessage('Constructor generado por happyCode 🚀');
    }
  );

  context.subscriptions.push(disposable);
}

function applyDiff(original: string, diff: string): string {

  const addedLines = diff
    .split('\n')
    .filter(l => l.startsWith('+') && !l.startsWith('+++'))
    .map(l => l.substring(1));

  const insertPoint = original.lastIndexOf('}');

  return (
    original.slice(0, insertPoint) +
    '\n' +
    addedLines.join('\n') +
    '\n}'
  );
}

interface GenerateConstructorResponse {
  diff: string;
}