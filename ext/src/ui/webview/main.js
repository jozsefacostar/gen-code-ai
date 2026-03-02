const vscode = acquireVsCodeApi();

function generate() {

  const prompt = document.getElementById("prompt").value;

  vscode.postMessage({
    command: "generate",
    prompt
  });
}