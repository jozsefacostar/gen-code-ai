import { buildAngularPrompt } from "../languages/angular-prompt";
import { buildCSharpPrompt } from "../languages/csharp-prompt";

export function buildPrompt(
  languageId: string,
  code: string,
  instruction: string
): string {

  if (languageId === "csharp") {
    return buildCSharpPrompt(code, instruction);
  }

  if (languageId === "typescript" || languageId === "html") {
    return buildAngularPrompt(code, instruction);
  }

  return `
You are a senior software engineer.

Given this code:

${code}

Instruction:
${instruction}

Return only the updated code.
`;
}