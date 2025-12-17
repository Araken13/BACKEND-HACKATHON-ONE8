# 📊 Relatório Técnico de Data Science (Model V4)

Este documento detalha o processo de criação, treinamento e validação do modelo de Inteligência Artificial utilizado no ChurnInsight V2.

## 1. Definição do Problema

O objetivo é classificar clientes em duas categorias:

* **0 (Não Churn):** Cliente que provavelmente continuará assinando.
* **1 (Churn):** Cliente com alto risco de cancelamento.

## 2. Dataset

O modelo foi treinado utilizando o dataset `dados_streamingV4.csv`, que contém dados históricos de comportamento de usuários de uma plataforma de streaming.

### Dicionário de Dados (Features)

| Variável | Tipo | Descrição |
| :--- | :--- | :--- |
| `idade` | Numérico | Idade do cliente (anos). |
| `genero` | Categórico | Masculino, Feminino, Outro. |
| `regiao` | Categórico | Região do Brasil (Norte, Sul, etc). |
| `tempo_assinatura_meses` | Numérico | Tempo de vida do cliente na base. |
| `dias_ultimo_acesso` | Numérico | Recência do último login. **(Fator Crítico)** |
| `visualizacoes_mes` | Numérico | Intensidade de uso da plataforma. |
| `contatos_suporte` | Numérico | Número de tickets abertos. **(Indicador de frustração)** |
| `plano_assinatura` | Categórico | Básico, Padrão, Premium. |
| `valor_mensal` | Numérico | Ticket médio pago pelo cliente. |
| `avaliacao_plataforma` | Numérico | Nota (1-5) dada pelo cliente. |
| `tipo_contrato` | Categórico | Mensal, Anual. |

## 3. Pré-Processamento (Pipeline ETL)

O script `train_model_v4.py` implementa um pipeline robusto usando `scikit-learn`:

1. **Limpeza:** Tratamento de valores nulos (`SimpleImputer`).
2. **Conversão de Tipos:** Ajuste de colunas numéricas que usam vírgula (padrão PT-BR) para ponto.
3. **Encoding:**
    * **Numéricas:** Normalização com `StandardScaler` (média 0, desvio padrão 1).
    * **Categóricas:** Transformação com `OneHotEncoder` para converter texto em vetores binários.

## 4. O Modelo (Random Forest)

Optamos pelo algoritmo **Random Forest Classifier** devido à sua robustez contra overfitting e capacidade de lidar com mix de dados numéricos e categóricos sem necessidade de normalização complexa (embora tenhamos aplicado).

* **Hiperparâmetros:** `n_estimators=50`, `random_state=42`.
* **Separação:** 80% Treino / 20% Teste.

## 5. Resultados e Métricas

O modelo final atingiu uma performance excepcional nos dados de teste:

> **Acurácia Global:** 96.23% 🎯

Isso significa que o modelo acerta a previsão de cancelamento ou permanência em **96 de cada 100 casos** analisados pelo teste cego.

## 6. Serialização e Deploy

O modelo treinado é salvo no formato `.joblib` (`churn_model_v4.joblib`), permitindo que a API Python (`api_v2_real.py`) o carregue instantaneamente na memória para inferência em tempo real, sem necessidade de re-treino a cada chamada.

---
**Data de Treinamento:** 17/12/2025
**Ambiente:** Python 3.13
