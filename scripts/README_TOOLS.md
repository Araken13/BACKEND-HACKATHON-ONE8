# 🤖 ChurnInsight - Ferramentas de Automação de Contexto

Este diretório contém a suíte de ferramentas desenvolvida para garantir que Agentes de IA (como LLMs e Code Assistants) tenham sempre acesso à versão mais recente e limpa do código, evitando "alucinações" e melhorando a qualidade das sugestões.

---

## 🛠️ Ferramentas Disponíveis

### 1. 🛡️ Protocolo Zero (Regrounding)

**Arquivo:** `.agent/workflows/protocolo_zero.md`

Um workflow que força a IA a "acordar" e reler o estado atual do projeto.

* **Comando:** `/pz` ou `/protocolo_zero` (no chat com o agente).
* **O que faz:**
    1. Roda o script de geração de PDR.
    2. Lê o arquivo gerado para a memória RAM.
    3. Confirma sincronização.

### 2. Gerador de Contexto Otimizado (PDR)

**Script:** `scripts/leitor_contexto_pdr.py`

Um script Python inteligente que varre o projeto e gera um único arquivo de texto (`PROJECT_CONTEXT_PDR.txt`) contendo todo o código e documentação relevante.

* **Diferenciais:**
  * **Filtro Inteligente:** Ignora pastas pesadas (`.venv`, `node_modules`, `build`, `dist`) e arquivos binários.
  * **Ordenação Semântica**: Organiza o arquivo como uma história para a IA ler:
        1. Documentação (`.md`)
        2. Configuração (`Dockerfile`, `requirements`)
        3. Backend (`.py`)
        4. Frontend (`.tsx`)
  * **Tamanho Otimizado**: Reduziu o contexto de 26MB para ~140KB.

### 3. Auto-Leitor (Watchdog)

**Script:** `auto_leitor.py` (na raiz)

Um daemon que roda em background e monitora alterações nos arquivos.

* **Como funciona:** Se você salvar qualquer arquivo no VS Code, ele detecta a mudança e roda o gerador PDR automaticamente em < 1 segundo.
* **Benefício:** Sua IA nunca trabalha com código desatualizado.

---

## 🚀 Como Usar

### Instalação

As ferramentas já vêm pré-configuradas no repositório. Certifique-se de ter o Python instalado.

### Execução Manual

Se quiser gerar o contexto manualmente:

```bash
# No Windows/Linux/WSL
python scripts/leitor_contexto_pdr.py
```

### Execução Automática (Recomendado)

Deixe rodando em um terminal separado:

```bash
python auto_leitor.py
```

---

## 🔒 Segurança

* Os arquivos gerados (`PROJECT_CONTEXT_PDR.txt`) são automaticamente adicionados ao `.gitignore` para evitar vazamento de código ou commits gigantes acidentais.
