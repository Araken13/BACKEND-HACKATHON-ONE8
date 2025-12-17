import { useState, useEffect } from 'react';
import axios from 'axios';

// DTOs
interface Stats {
  total_analises: number;
  total_churn_previsto: number;
  taxa_risco: number;
}

interface PredictionResult {
  previsao: string;
  probabilidade: number;
  risco_alto: boolean;
  historico_id: number;
  mensagem: string;
}

function App() {
  // --- Estados ---
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

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

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [predLoading, setPredLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Estados Upload ---
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  // --- Efeitos ---
  useEffect(() => {
    fetchStats();
    // Poll de stats a cada 10s
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- Ações ---
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await axios.get('http://localhost:3000/churn/stats');
      setStats(res.data);
    } catch (err) {
      console.error("Erro ao buscar stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setPredLoading(true);
    setPrediction(null);
    setError('');

    try {
      // Payload ajustado para números
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
      setPrediction(response.data);
      fetchStats(); // Atualiza stats após prever
    } catch (err: any) {
      console.error(err);
      setError('Erro ao processar: ' + (err.response?.data?.message || err.message));
    } finally {
      setPredLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <h1 className="text-xl font-bold text-indigo-600 tracking-tight">ChurnInsight <span className="text-slate-400 font-normal ml-1">V2</span></h1>
          </div>
          <div className="text-xs font-medium bg-slate-100 text-slate-500 px-3 py-1 rounded-full border border-slate-200">
            Ambiente: NestJS + React + Python AI
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-8">

        {/* KPI DASHBOARD */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="stat-label">Total Analisado</div>
            <div className="stat-value">{stats ? stats.total_analises : '-'}</div>
          </div>
          <div className="card border-l-4 border-l-red-500">
            <div className="stat-label text-red-600">Risco Previsto</div>
            <div className="stat-value text-red-600">{stats ? stats.total_churn_previsto : '-'}</div>
            <div className="text-xs text-slate-400 mt-1">Clientes em perigo</div>
          </div>
          <div className="card">
            <div className="stat-label">Taxa de Risco</div>
            <div className="stat-value text-indigo-600">{stats ? (Number(stats.taxa_risco) * 100).toFixed(1) : '-'}%</div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* SIMULATOR FORM */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span>⚡</span> Simulador de Cliente
                </h3>
                <p className="text-sm text-slate-500 mt-1">Preencha os dados abaixo para consultar a IA em tempo real.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Idade</label>
                    <input name="idade" type="number" value={formData.idade} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Tempo de Assinatura (Meses)</label>
                    <input name="tempo_assinatura_meses" type="number" value={formData.tempo_assinatura_meses} onChange={handleChange} className="input-field" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Dias sem Acesso</label>
                    <input name="dias_ultimo_acesso" type="number" value={formData.dias_ultimo_acesso} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Chamados Suporte</label>
                    <input name="contatos_suporte" type="number" value={formData.contatos_suporte} onChange={handleChange} className="input-field" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Plano Atual</label>
                    <select name="plano_assinatura" value={formData.plano_assinatura} onChange={handleChange} className="input-field">
                      <option>Básico</option>
                      <option>Padrão</option>
                      <option>Premium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Categoria Favorita</label>
                    <select name="categoria_favorita" value={formData.categoria_favorita} onChange={handleChange} className="input-field">
                      <option>Filmes</option>
                      <option>Séries</option>
                      <option>Esportes</option>
                      <option>Infantil</option>
                      <option>Documentários</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Valor Mensal (R$)</label>
                    <input name="valor_mensal" type="number" step="0.1" value={formData.valor_mensal} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Avaliação (1-5)</label>
                    <input name="avaliacao_plataforma" type="number" step="0.1" max="5" value={formData.avaliacao_plataforma} onChange={handleChange} className="input-field" />
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={predLoading} className="btn-primary flex justify-center items-center gap-2">
                    {predLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analisando...
                      </>
                    ) : (
                      'Simular Risco de Churn'
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* RESULT & INFO */}
          <div className="lg:col-span-5 space-y-6">

            {/* RESULT CARD */}
            {prediction && (
              <div className={`card border-l-8 ${prediction.risco_alto ? 'border-l-red-500 bg-red-50' : 'border-l-green-500 bg-green-50'} animate-fade-in`}>
                <h3 className="text-sm uppercase font-bold text-slate-500 mb-2">Resultado da Análise</h3>

                <div className="flex items-center gap-4 mb-6">
                  <div className={`text-4xl font-extrabold ${prediction.risco_alto ? 'text-red-600' : 'text-green-600'}`}>
                    {prediction.previsao}
                  </div>
                  {prediction.risco_alto && <span className="bg-red-200 text-red-800 text-xs font-bold px-2 py-1 rounded">ALTO RISCO</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">Probabilidade</div>
                    <div className="text-xl font-bold text-slate-800">{(prediction.probabilidade * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">ID da Transação</div>
                    <div className="text-sm font-mono text-slate-600 truncate">#{prediction.historico_id}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ERROR CARD */}
            {error && (
              <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
                <span>⚠️</span>
                <div>
                  <h4 className="font-bold text-sm">Erro na Simulação</h4>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* BATCH UPLOAD */}
            <div className="card">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span>📂</span> Processamento em Lote
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Envie um arquivo CSV para processar previsões em massa.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 p-10 transition-colors hover:border-indigo-400 hover:bg-indigo-50/30">

                {!uploading ? (
                  <label className="cursor-pointer flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    </div>
                    <span className="text-sm font-medium text-slate-700">Clique para selecionar CSV</span>
                    <span className="text-xs text-slate-400 mt-1">ou arraste e solte aqui</span>
                    <input type="file" accept=".csv" className="hidden" onChange={async (e) => {
                      if (!e.target.files?.length) return;
                      const file = e.target.files[0];

                      setUploading(true);
                      setUploadMsg("Enviando arquivo para IA...");

                      const formData = new FormData();
                      formData.append('file', file);

                      try {
                        // Chama Direto o Python para Stream de Arquivo (Mais eficiente para Hackathon)
                        const response = await fetch('http://localhost:8000/predict/batch', {
                          method: 'POST',
                          body: formData,
                        });

                        if (response.ok) {
                          setUploadMsg("Processando (Isso pode levar alguns segundos)...");
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `PREVISOES_${file.name}`;
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          setUploadMsg("✅ Download Iniciado!");
                          setTimeout(() => setUploadMsg(""), 3000);
                        } else {
                          const errText = await response.text();
                          alert("Erro no processamento: " + errText);
                          setUploadMsg("");
                        }
                      } catch (err) {
                        console.error(err);
                        alert("Erro de conexão com o servidor de IA.");
                        setUploadMsg("");
                      } finally {
                        setUploading(false);
                      }
                    }} />
                  </label>
                ) : (
                  <div className="text-center">
                    <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm font-semibold text-slate-700">Processando...</p>
                    <p className="text-xs text-slate-500 mt-1">{uploadMsg}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
