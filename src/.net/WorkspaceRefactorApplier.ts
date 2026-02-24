import * as vscode from 'vscode';
import { FileChange } from './AIRefactorResponse';

export class WorkspaceRefactorApplier {

  public static async apply(changes: FileChange[]) {

    const edit = new vscode.WorkspaceEdit();

    for (const change of changes) {

      const uri = vscode.Uri.file(change.file);

      edit.replace(
        uri,
        new vscode.Range(
          0,
          0,
          Number.MAX_VALUE,
          Number.MAX_VALUE
        ),
        change.code
      );
    }

    await vscode.workspace.applyEdit(edit);
  }
}