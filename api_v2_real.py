import pandas as pd
import joblib
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io

app = Flask(__name__)
CORS(app)  # Permite chamadas do Frontend direto

# Carregar Modelo Treinado
print("Carregando modelo churn_model_v4.joblib...")
model = joblib.load('churn_model_v4.joblib')
print("Modelo carregado com sucesso!")

# Colunas esperadas para garantir ordem
METADATA = pd.read_json('model_v4_metadata.json', typ='series')
EXPECTED_COLS = METADATA['numeric'] + METADATA['categorical']

@app.route('/', methods=['GET'])
def health():
    return jsonify({
        "status": "online", 
        "model": "V4-RandomForest-REAL", 
        "accuracy": "96.2%"
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Criar DataFrame (1 linha)
        df_input = pd.DataFrame([data])
        
        # O Pipeline já cuida do pre-processamento (impute, scale, encode)
        # Predição de Probabilidade
        prob = model.predict_proba(df_input)[0][1] # Probabilidade da classe 1 (Churn)
        prediction = "Vai cancelar" if prob >= 0.5 else "Vai continuar"
        
        return jsonify({
            "previsao": prediction,
            "probabilidade": float(prob),
            "risco_alto": prob > 0.6,
            "metodo": "RandomForest_V4"
        })

    except Exception as e:
        print(f"Erro predicao individual: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "Nenhum arquivo enviado"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "Nome de arquivo vazio"}), 400

        # Ler CSV
        df = pd.read_csv(file)
        print(f"Processando batch de {len(df)} registros...")
        
        # 1. Tratar vírgulas em colunas numéricas (Problema comum em CSV pt-BR)
        cols_to_fix = ['avaliacao_conteudo_media', 'avaliacao_conteudo_ultimo_mes', 'avaliacao_plataforma']
        for col in cols_to_fix:
             if col in df.columns and df[col].dtype == 'object':
                 df[col] = df[col].str.replace(',', '.').astype(float)

        # 2. Prever
        # O pipeline espera certas colunas. Se tiver colunas extras, não tem problema, o ColumnTransformer ignora (se remainder='drop', que é default).
        # Vamos garantir que não quebre se faltar colunas, mas o modelo precisa delas.
        
        probs = model.predict_proba(df)[:, 1] # Array de probabilidades
        preds = ["Vai cancelar" if p >= 0.5 else "Vai continuar" for p in probs]
        
        # 3. Adicionar Resultados ao DF Original
        df['PREVISAO_IA'] = preds
        df['PROBABILIDADE_CHURN'] = probs
        df['RISCO_ALTO'] = df['PROBABILIDADE_CHURN'] > 0.6
        
        # 4. Retornar CSV processado
        output = io.BytesIO()
        df.to_csv(output, index=False, sep=';', decimal=',') # Formato Brasileiro Excel-friendly
        output.seek(0)
        
        return send_file(
            output,
            mimetype='text/csv',
            as_attachment=True,
            download_name='resultado_previsoes_v4.csv'
        )

    except Exception as e:
        print(f"Erro batch: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Roda na porta 8000
    print("🚀 API REAL V4 rodando na porta 8000")
    app.run(host='0.0.0.0', port=8000)
