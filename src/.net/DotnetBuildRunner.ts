import { exec } from 'child_process';
import * as vscode from 'vscode';

export class DotnetBuildRunner {

  public static async run(): Promise<boolean> {

    const workspace = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

    return new Promise((resolve) => {

      exec('dotnet build', { cwd: workspace }, (err, stdout, stderr) => {

        if (err) {
          vscode.window.showErrorMessage("Build falló ❌");
          resolve(false);
          return;
        }

        vscode.window.showInformationMessage("Build exitoso ✅");
        resolve(true);
      });

    });
  }
}