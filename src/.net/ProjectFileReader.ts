import * as vscode from 'vscode';

export interface ProjectFile {
  path: string;
  content: string;
}

export class ProjectFileReader {

  public static async readAllCsFiles(): Promise<ProjectFile[]> {

    const files = await vscode.workspace.findFiles(
      '**/*.cs',
      '**/{bin,obj}/**'
    );

    const result: ProjectFile[] = [];

    for (const file of files) {

      const bytes = await vscode.workspace.fs.readFile(file);

      result.push({
        path: file.fsPath,
        content: Buffer.from(bytes).toString('utf8')
      });
    }

    return result;
  }
}