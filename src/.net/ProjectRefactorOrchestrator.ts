import * as vscode from 'vscode';
import { ProjectFileReader } from './ProjectFileReader';
import { AIRefactorResponse } from './AIRefactorResponse';
import { WorkspaceRefactorApplier } from './WorkspaceRefactorApplier';
import { DotnetBuildRunner } from './DotnetBuildRunner';

export class ProjectRefactorOrchestrator {

    public static async run(instruction: string) {

        const config = vscode.workspace.getConfiguration("gen-code-ai");
        const apiUrl = config.get<string>("apiUrl");

        const files = await ProjectFileReader.readAllCsFiles();

        const prompt = `
Proyecto completo .NET:

${files.map(f => `
Archivo: ${f.path}
${f.content}
`).join('\n\n')}

Instrucción:
${instruction}

Devuelve únicamente JSON:

{
  "changes":[
    {
      "file":"ruta absoluta",
      "code":"contenido completo"
    }
  ]
}
`;

        const confirmation = await vscode.window.showWarningMessage(
            "La IA va a modificar TODO el proyecto .NET",
            { modal: true },
            "Aplicar Cambios"
        );

        if (confirmation !== "Aplicar Cambios") return;

        const response = await fetch(`${apiUrl}/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt })
        });

        const raw = await response.text();
     
        // Primer parse → backend
        const outer = JSON.parse(raw);

        // Segundo parse → respuesta del LLM
        let cleaned = outer.code
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        const data = JSON.parse(cleaned);

        if (!Array.isArray(data.changes)) {
            vscode.window.showErrorMessage("changes no es un array");
            console.log("Parsed:", data);
            return;
        }

        await WorkspaceRefactorApplier.apply(data.changes);

        await DotnetBuildRunner.run();
    }
}