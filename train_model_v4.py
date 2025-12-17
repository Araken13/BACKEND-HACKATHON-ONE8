import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

# 1. Carregar Dados
print("Carregando dados V4...")
try:
    df = pd.read_csv('dados_streamingV4.csv')
except FileNotFoundError:
    # Fallback se não baixou ainda (embora deva ter baixado)
    url = 'https://raw.githubusercontent.com/rafaelreisramos/oracle-one-g8-hackathon/refs/heads/main/data/dados_streamingV4.csv'
    df = pd.read_csv(url)

# 2. Pré-processamento Básico
# Converter colunas numéricas que podem estar como string (vírgula decimal)
cols_to_fix = ['avaliacao_conteudo_media', 'avaliacao_conteudo_ultimo_mes', 'avaliacao_plataforma']
for col in cols_to_fix:
    if df[col].dtype == 'object':
        df[col] = df[col].str.replace(',', '.').astype(float)

# Remover colunas irrelevantes para treino (IDs)
X = df.drop(columns=['cliente_id', 'churn'])
y = df['churn']

# 3. Definir Colunas Numéricas e Categóricas
numeric_features = [
    'idade', 'valor_mensal', 'tempo_assinatura_meses', 'dias_ultimo_acesso',
    'contatos_suporte', 'visualizacoes_mes', 'tempo_medio_sessao_min',
    'avaliacao_conteudo_media', 'avaliacao_conteudo_ultimo_mes', 'avaliacao_plataforma'
]

categorical_features = [
    'genero', 'regiao', 'tipo_contrato', 'metodo_pagamento',
    'plano_assinatura', 'dispositivo_principal', 'categoria_favorita'
]

# Garantir que só usamos colunas que existem no DF
numeric_features = [c for c in numeric_features if c in X.columns]
categorical_features = [c for c in categorical_features if c in X.columns]

# 4. Pipeline de Transformação
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='Nao_Informado')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ])

# 5. Modelo
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=50, random_state=42))
])

# 6. Treinar
print("Treinando modelo V4...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model.fit(X_train, y_train)

# 7. Métricas Simples
score = model.score(X_test, y_test)
print(f"Acurácia do modelo V4: {score:.4f}")

# 8. Salvar
joblib.dump(model, 'churn_model_v4.joblib')
print("Modelo salvo como 'churn_model_v4.joblib'")

# Salvar metadata das colunas para a API saber o que esperar
import json
metadata = {
    "numeric": numeric_features,
    "categorical": categorical_features
}
with open('model_v4_metadata.json', 'w') as f:
    json.dump(metadata, f)
