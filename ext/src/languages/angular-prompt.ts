export function buildAngularPrompt(
  code: string,
  instruction: string
): string {

  return `
You are a senior Angular developer.

Follow Angular best practices, strong typing, and clean component architecture.

Code:
${code}

Instruction:
${instruction}

Return only valid Angular (TypeScript or HTML) code.
`;
}