import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { buildPrompt } from "../../core/prompt-builder";
import { AIClient } from "../../core/ai-client";

export class GenCodePanel implements vscode.WebviewViewProvider {

  constructor(private context: vscode.ExtensionContext) {}

  resolveWebviewView(view: vscode.WebviewView) {

    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this.context.extensionPath, "src", "ui", "webview"))
      ]
    };

    view.webview.html = this.getHtml(view.webview);

    view.webview.onDidReceiveMessage(async message => {

      if (message.command === "generate") {

        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selection = editor.selection;
        const selectedCode = editor.document.getText(selection);

        if (!selectedCode) {
          vscode.window.showErrorMessage("Select code first.");
          return;
        }

        const languageId = editor.document.languageId;

        const prompt = buildPrompt(
          languageId,
          selectedCode,
          message.prompt
        );

        const config = vscode.workspace.getConfiguration("gen-code-ai");
        const apiUrl = config.get<string>("apiUrl")!;

        const client = new AIClient(apiUrl);

        const result = await client.generate(prompt);

        await editor.edit(edit => {
          edit.replace(selection, result);
        });

        vscode.window.showInformationMessage("Code generated.");
      }
    });
  }

  private getHtml(webview: vscode.Webview): string {

    const htmlPath = path.join(
      this.context.extensionPath,
      "src",
      "ui",
      "webview",
      "index.html"
    );

    return fs.readFileSync(htmlPath, "utf8");
  }
}