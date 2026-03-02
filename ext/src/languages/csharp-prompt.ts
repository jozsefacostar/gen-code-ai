export function buildCSharpPrompt(
  code: string,
  instruction: string
): string {

  return `
You are a senior C# architect.

Apply clean architecture and SOLID principles.

Code:
${code}

Instruction:
${instruction}

Return only valid C# code.
`;
}