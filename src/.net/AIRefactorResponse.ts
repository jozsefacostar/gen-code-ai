export interface FileChange {
  file: string;
  code: string;
}

export interface AIRefactorResponse {
  changes: FileChange[];
}