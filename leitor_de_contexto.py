import os

# Configurações
ROOT_DIR = "."
OUTPUT_FILE = "PROJECT_CONTEXT_SUMMARY.txt"
IGNORE_DIRS = {
    ".git", ".terraform", ".vscode", ".idea", "__pycache__", 
    "node_modules", "venv", ".oci"
}
IGNORE_EXTENSIONS = {
    ".exe", ".dll", ".so", ".bin", ".box", ".zip", ".tar", ".gz", 
    ".png", ".jpg", ".jpeg", ".gif", ".ico", ".pdf", ".tfstate", 
    ".tfstate.backup"
}
IGNORE_FILES = {
    "package-lock.json", "yarn.lock", OUTPUT_FILE
}

def is_text_file(filename):
    return not any(filename.endswith(ext) for ext in IGNORE_EXTENSIONS)

def generate_context():
    print(f"Lendo arquivos em: {os.path.abspath(ROOT_DIR)}...")
    with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
        outfile.write(f"# RESUMO DO PROJETO: {os.path.basename(os.path.abspath(ROOT_DIR))}\n")
        outfile.write("="*80 + "\n\n")

        for root, dirs, files in os.walk(ROOT_DIR):
            # Modifica dirs in-place para ignorar pastas indesejadas
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for file in files:
                if file in IGNORE_FILES or not is_text_file(file):
                    continue

                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, ROOT_DIR)

                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as infile:
                        content = infile.read()
                        
                    outfile.write(f"\n{'='*80}\n")
                    outfile.write(f"ARQUIVO: {relative_path}\n")
                    outfile.write(f"{'-'*80}\n")
                    outfile.write(content + "\n")
                    print(f"Lido: {relative_path}")
                    
                except Exception as e:
                    print(f"Erro ao ler {relative_path}: {e}")

    print(f"\nConcluido! Contexto salvo em: {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_context()
