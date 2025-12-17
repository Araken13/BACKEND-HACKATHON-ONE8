# 🔮 ChurnInsight V2 - Plataforma de Previsão de Churn

![Tech Stack](tech_satck.png)

Este projeto é uma solução completa (Full Stack) para prever a probabilidade de cancelamento de clientes (Churn) utilizando Inteligência Artificial.

## 🚀 Tecnologias Utilizadas

A arquitetura foi projetada em microserviços para modularidade e escalabilidade:

1. **Backend (Orquestrador):** NestJS (Node.js) + TypeORM + SQLite.
2. **Frontend (Interface):** React + Vite + Tailwind CSS.
3. **AI Service (Cérebro):** Python Flask + Scikit-Learn (Random Forest).

---

## 📋 Funcionalidades

### Obrigatórias (MVP)

* ✅ **Previsão Individual:** Endpoint para pontuar um único cliente.
* ✅ **Probabilidade Real:** O modelo retorna a % de chance de churn (ex: 85.3%).
* ✅ **Validação de Dados:** O sistema valida os campos de entrada.

### Extras Implementados

* ✨ **Dashboard em Tempo Real:** KPIs de total analisado e risco atualizados automaticamente.
* ✨ **Upload em Lote (Batch):** Envie um CSV com milhares de clientes e receba o resultado na hora.
* ✨ **Persistência:** Histórico de todas as análises salvo em banco de dados SQLite.
* ✨ **Modelo Otimizado (V4):** Random Forest com **96% de acurácia** treinado com dados V4.

---

## 🛠️ Como Executar o Projeto

Simplicidade total. Criamos um script que sobe toda a infraestrutura com um clique.

### Pré-requisitos

* Node.js (v18+)
* Python (3.10 ou superior, testado com 3.13)
* Git

### Passo a Passo

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/seurepo/churninsight-v2.git
    cd churninsight-v2
    ```

2. **Instale as dependências (Primeira vez):**

    ```bash
    # Backend
    cd backend_v2 && npm install && cd ..
    
    # Frontend
    cd frontend_v2 && npm install && cd ..
    
    # Python
    pip install scikit-learn pandas numpy joblib flask flask-cors
    ```

3. **Inicie a Plataforma:**
    No Windows, basta clicar duas vezes em **`start_platform_v2.bat`** ou rodar no terminal:

    ```bash
    ./start_platform_v2.bat
    ```

    Isso abrirá 3 janelas:
    * 🧠 **Python API** na porta `8000`
    * 🚀 **NestJS Backend** na porta `3000`
    * 🎨 **React Frontend** na porta `5173` (ou `5174`)

4. **Acesse:**
    Abra seu navegador em: **`http://localhost:5173`** (ou a porta indicada no terminal).

---

## 📡 Documentação da API

O sistema expõe uma API RESTful documentada via Swagger e endpoints diretos.

### 1. Previsão Individual

* **Endpoint:** `POST /churn/predict` (NestJS)
* **URL:** `http://localhost:3000/churn/predict`
* **Body (JSON):**

    ```json
    {
        "idade": 30,
        "genero": "Masculino",
        "regiao": "Sudeste",
        "tipo_contrato": "Mensal",
        "metodo_pagamento": "Pix",
        "plano_assinatura": "Padrão",
        "valor_mensal": 29.90,
        "tempo_assinatura_meses": 6,
        "dias_ultimo_acesso": 5,
        "visualizacoes_mes": 20,
        "contatos_suporte": 0,
        "dispositivo_principal": "Mobile",
        "categoria_favorita": "Séries",
        "avaliacao_plataforma": 4.5
    }
    ```

* **Retorno:**

    ```json
    {
        "previsao": "Vai continuar",
        "probabilidade": 0.1234,
        "risco_alto": false,
        "historico_id": 42
    }
    ```

### 2. Dashboard Stats

* **Endpoint:** `GET /churn/stats`
* **Retorno:**

    ```json
    {
        "total_analises": 150,
        "total_churn_previsto": 23,
        "taxa_risco": 0.153
    }
    ```

---

## 📂 Estrutura de Pastas

```
/
├── backend_v2/         # Código NestJS (API Gateway + Banco)
├── frontend_v2/        # Código React (Interface Gráfica)
├── README.md           # Este arquivo
├── start_platform_v2.bat # Script de Inicialização Automática
├── api_v2_real.py      # Microserviço de IA (Produção)
├── train_model_v4.py   # Script de Treinamento e ETL
├── churn_model_v4.joblib # O Modelo de IA treinado
└── dados_streamingV4.csv # Dataset utilizado
```

## 👥 Equipe

Projeto desenvolvido para o Hackathon Oracle One G8.
