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
      const selectedCode = editor.document.getText(selection);

      if (!selectedCode) {
        vscode.window.showErrorMessage("Selecciona código primero");
        return;
      }

      const config = vscode.workspace.getConfiguration("gen-code-ai");
      const apiUrl = config.get<string>("apiUrl");

      // 🔥 ARMAS EL PROMPT AQUÍ
      const prompt = `
Tienes el siguiente código:

${selectedCode}

Realiza la siguiente instrucción:
${instruction}

Devuelve únicamente el código resultante.
`;

      const apiResponse = await fetch(`${apiUrl}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      const data = await apiResponse.json() as GenerateAIResponse;

      const generatedCode = data.code;

      if (!generatedCode) {
        vscode.window.showErrorMessage("Backend no devolvió código 😢");
        return;
      }

      await editor.edit(editBuilder => {
        editBuilder.replace(selection, generatedCode);
      });

      vscode.window.showInformationMessage('Código generado 🚀');
    }
  );

  context.subscriptions.push(disposable);
}


interface GenerateAIResponse {
  code: string;
}