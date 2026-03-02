import * as vscode from "vscode";
import { GenCodePanel } from "./ui/panels/gen-code-panel";

export function activate(context: vscode.ExtensionContext) {

  const provider = new GenCodePanel(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "genCodeAI.sidebar",
      provider
    )
  );
}

export function deactivate() {}