export class AIClient {

  constructor(private apiUrl: string) {}

  async generate(prompt: string): Promise<string> {

    const response = await fetch(`${this.apiUrl}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error("Backend error");
    }

    const data = await response.json() as { code: string };

    return data.code;
  }
}