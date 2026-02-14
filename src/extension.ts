import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

  const disposable = vscode.commands.registerCommand(
    'gen-code-ai.generate',
    async () => {

      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const instruction = await vscode.window.showInputBox({
        prompt: "¿Qué quieres que la IA genere?"
      });

      if (!instruction) return;

      const selection = editor.selection;
      const context = editor.document.getText(selection);

      if (!context) {
        vscode.window.showErrorMessage("Selecciona código primero");
        return;
      }

      const config = vscode.workspace.getConfiguration("gen-code-ai");
      const apiUrl = config.get<string>("gen-code-ai.apiUrl");

      const apiResponse = await fetch(
        `${apiUrl}/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            instruction,
            context
          })
        }
      );

      const data = await apiResponse.json() as GenerateAIResponse;

      if (!data.code) {
        vscode.window.showErrorMessage("Backend no devolvió código 😢");
        return;
      }

      const edit = new vscode.WorkspaceEdit();

      edit.replace(
        editor.document.uri,
        editor.selection,
        data.code
      );

      await vscode.workspace.applyEdit(edit);

      vscode.window.showInformationMessage('gen-code-ai-works! 🚀');
    }
  );

  context.subscriptions.push(disposable);
}

interface GenerateAIResponse {
  code: string;
}