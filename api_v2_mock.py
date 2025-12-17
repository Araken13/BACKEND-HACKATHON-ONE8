from flask import Flask, request, jsonify
import random

app = Flask(__name__)

# Metadados simulados para compatibilidade
METADATA = {
    "numeric": ['idade', 'valor_mensal', 'tempo_assinatura_meses', 'dias_ultimo_acesso', 'visualizacoes_mes'],
    "categorical": ['genero', 'regiao', 'plano_assinatura']
}

@app.route('/', methods=['GET'])
def health():
    return jsonify({"status": "online", "model": "V4-Heuristic-Mock"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Lógica Heurística para Simular Modelo ML (já que o ambiente sklearn está instável)
        score = 0
        
        # Fatores de Risco (+ aumenta chance de churn)
        if data.get('dias_ultimo_acesso', 0) > 30: score += 40
        if data.get('contatos_suporte', 0) > 3: score += 20
        if data.get('avaliacao_plataforma', 5) < 3: score += 25
        if data.get('tipo_contrato') == 'Mensal': score += 10
        
        # Fatores de Retenção (- diminui chance de churn)
        if data.get('tempo_assinatura_meses', 0) > 24: score -= 20
        if data.get('visualizacoes_mes', 0) > 50: score -= 15
        if data.get('categoria_favorita') == 'Infantil': score -= 10 # Pais tendem a manter por causa dos filhos

        # Normalização probabilística
        base_prob = 0.2 # 20% base churn rate
        final_prob = min(max(base_prob + (score / 100), 0.0), 0.99)
        
        prediction = "Vai cancelar" if final_prob > 0.5 else "Vai continuar"
        
        return jsonify({
            "previsao": prediction,
            "probabilidade": round(final_prob, 4),
            "risco_alto": final_prob > 0.6,
            "metodo": "heuristica_v4"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Roda na porta 8000 para diferenciar
    print("Iniciando API de Previsão (Mock V4) na porta 8000...")
    app.run(host='0.0.0.0', port=8000)
