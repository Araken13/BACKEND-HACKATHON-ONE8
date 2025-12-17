# 🚀 Manual do Sistema de Teletransporte de Projetos

Este sistema permite que você leve seu projeto inteiro dentro de um único arquivo de texto (`.txt`) e o reconstrua em qualquer lugar, sem precisar de Git, Docker ou instalações complexas. É ideal para compartilhar contexto com IAs ou migrar entre ambientes isolados.

## 📂 Estrutura do Kit

- `orquestrador.py`: **Menu Principal**. Execute este arquivo para começar.
- `scripts/leitor_contexto_pdr.py`: O **Gerador** (Backup). Cria o arquivo único.
- `scripts/construtor_projeto.py`: O **Construtor** (Restore). Recria o projeto.
- `auto_leitor.py`: Monitor automático para IAs.

---

## 📖 Como Usar

### Passo 1: Preparação

Certifique-se de que você tem Python instalado.
Abra o terminal na pasta do projeto e execute uma verificação rápida:

```bash
python scripts/pipeline_check.py
```

### Passo 2: Usando o Menu

Para acessar qualquer função, basta rodar:

```bash
python orquestrador.py
```

Você verá as opções:

1. **📸 GERAR Contexto**: Cria o arquivo `PROJECT_CONTEXT_PDR.txt` com todo o seu código atual.
2. **🏗️ RESTAURAR Projeto**: Lê um arquivo de contexto e recria as pastas e códigos originais.
3. **🤖 Daemon**: Deixa rodando em background para atualizar contexto enquanto você programa.

---

## ⚡ Fluxo de Teleporte (Cenário Real)

#### Origem (Onde o projeto existe)

1. Execute `python orquestrador.py` e escolha a **Opção 1**.
2. Pegue o arquivo gerado (`PROJECT_CONTEXT_PDR.txt`).
3. Pegue este script (`orquestrador.py` e a pasta `scripts/`).

#### Destino (Pasta vazia/Virgem)

1. Coloque o arquivo `.txt` e os scripts na pasta.
2. Execute `python orquestrador.py` e escolha a **Opção 2**.
3. **Pronto!** Seu projeto foi recriado.

---

## 🛠️ Comandos Manuais (Expert Mode)

Se preferir não usar o menu:

**Para Gerar:**

```bash
python scripts/leitor_contexto_pdr.py
```

**Para Restaurar:**

```bash
python scripts/construtor_projeto.py MEU_ARQUIVO_DE_CONTEXTO.txt
```

---
*Gerado por Antigravity Agent - 2025*
