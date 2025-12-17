import { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    idade: 30,
    genero: 'Masculino',
    regiao: 'Sudeste',
    tipo_contrato: 'Mensal',
    metodo_pagamento: 'Pix',
    plano_assinatura: 'Padrão',
    valor_mensal: 29.90,
    tempo_assinatura_meses: 6,
    dias_ultimo_acesso: 5,
    visualizacoes_mes: 20,
    contatos_suporte: 0,
    dispositivo_principal: 'Mobile',
    categoria_favorita: 'Séries',
    avaliacao_plataforma: 4.5
  });

  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);
    setError('');

    try {
      // Ajustar tipos numéricos
      const payload = {
        ...formData,
        idade: Number(formData.idade),
        valor_mensal: Number(formData.valor_mensal),
        tempo_assinatura_meses: Number(formData.tempo_assinatura_meses),
        dias_ultimo_acesso: Number(formData.dias_ultimo_acesso),
        visualizacoes_mes: Number(formData.visualizacoes_mes),
        contatos_suporte: Number(formData.contatos_suporte),
        avaliacao_plataforma: Number(formData.avaliacao_plataforma)
      };

      const response = await axios.post('http://localhost:3000/churn/predict', payload);
      setResultado(response.data);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao processar: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:flex">

        {/* Formulário */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Simulador de Churn</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Idade</label>
                <input name="idade" type="number" value={formData.idade} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tempo (Meses)</label>
                <input name="tempo_assinatura_meses" type="number" value={formData.tempo_assinatura_meses} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Dias s/ Acesso</label>
              <input name="dias_ultimo_acesso" type="number" value={formData.dias_ultimo_acesso} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contatos Suporte</label>
                <input name="contatos_suporte" type="number" value={formData.contatos_suporte} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Plano</label>
                <select name="plano_assinatura" value={formData.plano_assinatura} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 text-sm">
                  <option>Básico</option>
                  <option>Padrão</option>
                  <option>Premium</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Categoria Favorita</label>
              <select name="categoria_favorita" value={formData.categoria_favorita} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 border p-2 text-sm">
                <option>Filmes</option>
                <option>Séries</option>
                <option>Esportes</option>
                <option>Infantil</option>
                <option>Documentários</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50 font-semibold">
              {loading ? 'Analisando...' : 'Prever Churn'}
            </button>
          </form>
        </div>

        {/* Painel de Resultado */}
        <div className="md:w-1/2 bg-blue-50 p-8 flex flex-col justify-center items-center border-l border-blue-100">
          {!resultado && !error && (
            <div className="text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>Preencha os dados para analisar o risco do cliente.</p>
            </div>
          )}

          {resultado && (
            <div className="text-center w-full animation-fade-in">
              <h3 className="text-lg font-uppercase tracking-wider text-gray-500 mb-2">Resultado da Análise</h3>

              <div className={`text-4xl font-extrabold mb-4 p-4 rounded-lg inline-block w-full ${resultado.risco_alto ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'}`}>
                {resultado.previsao}
              </div>

              <div className="grid grid-cols-2 gap-4 text-left mt-6">
                <div className="bg-white p-3 rounded shadow-sm">
                  <p className="text-xs text-gray-500">Probabilidade</p>
                  <p className="text-xl font-bold">{(resultado.probabilidade * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <p className="text-xs text-gray-500">Risco Alto?</p>
                  <p className={`text-xl font-bold ${resultado.risco_alto ? 'text-red-500' : 'text-green-500'}`}>
                    {resultado.risco_alto ? 'SIM' : 'NÃO'}
                  </p>
                </div>
              </div>

              {resultado.historico_id && (
                <p className="mt-4 text-xs text-gray-400">ID da Análise: {resultado.historico_id}</p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg w-full text-center border border-red-200">
              <strong>Ops!</strong><br />{error}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
