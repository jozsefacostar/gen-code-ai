import * as vscode from 'vscode';
import { FileChange } from './AIRefactorResponse';
import * as path from 'path';

export class WorkspaceRefactorApplier {

  public static async apply(changes: FileChange[]) {

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showErrorMessage("No hay workspace abierto");
      return;
    }

    const workspaceEdit = new vscode.WorkspaceEdit();

    for (const change of changes) {

      let relativePath = change.file;

      // 🔧 Normalizar separadores
      relativePath = relativePath.replace(/\\/g, '/');

      // 🔧 Si el LLM envió ruta absoluta → convertirla
      if (path.isAbsolute(relativePath)) {
        relativePath = path.relative(
          workspaceFolder.uri.fsPath,
          relativePath
        );
      }

      const fileUri = vscode.Uri.joinPath(
        workspaceFolder.uri,
        relativePath
      );

      const dir = path.dirname(relativePath);

      const folderUri = vscode.Uri.joinPath(
        workspaceFolder.uri,
        dir
      );

      // ✅ Crear directorios primero
      try {
        await vscode.workspace.fs.createDirectory(folderUri);
      } catch {}

      try {

        // 📄 ¿Existe archivo?
        await vscode.workspace.fs.stat(fileUri);

        // Existe → reemplazar
        const document = await vscode.workspace.openTextDocument(fileUri);

        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(document.getText().length)
        );

        workspaceEdit.replace(fileUri, fullRange, change.code);

      } catch {

        // ❗ NO existe → crear con contenido directamente
        workspaceEdit.createFile(
          fileUri,
          { ignoreIfExists: true }
        );

        workspaceEdit.insert(
          fileUri,
          new vscode.Position(0, 0),
          change.code
        );
      }
    }

    await vscode.workspace.applyEdit(workspaceEdit);
  }
}