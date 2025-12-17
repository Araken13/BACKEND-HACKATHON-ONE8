# 📖 Manual de Uso - ChurnInsight V2

Bem-vindo ao manual do usuário do ChurnInsight V2. Este guia explica como utilizar as funcionalidades da interface web para prever cancelamentos.

## 1. Acessando o Sistema

Após iniciar a plataforma (via `start_platform_v2.bat`), abra seu navegador em:
👉 **<http://localhost:5173>** (ou a porta indicada no terminal)

Você verá a tela inicial com o Dashboard de KPIs e as opções de simulação.

---

## 2. Painel de Indicadores (KPIs)

No topo da tela, você encontra métricas em tempo real sobre a saúde da base analisada:

* **Total Analisado:** Quantidade total de simulações (individuais ou lote) realizadas.
* **Risco Previsto:** Quantos desses clientes foram classificados como "Risco de Churn".
* **Taxa de Risco:** A porcentagem da base que está em perigo.

---

## 3. Simulador Individual

Utilize esta ferramenta para analisar um cliente específico durante um atendimento ou para testes rápidos.

1. **Preencha o Formulário:** Insira os dados do cliente (Idade, Tempo de Assinatura, Plano, etc).
2. **Clique em "Simular Risco de Churn":** A IA analisará os dados em tempo real.
3. **Veja o Resultado:**
    * **VERDE:** "Vai continuar". O cliente está saudável.
    * **VERMELHO:** "Vai cancelar". Alerta de risco alto!
    * **Probabilidade:** Veja a certeza da IA (ex: 98.5%).

---

## 4. Processamento em Lote (Batch Upload)

Ideal para analisar bases inteiras de clientes de uma só vez (ex: relatório mensal).

1. Localize o cartão **"Processamento em Lote"** à direita.
2. **Arraste e Solte** um arquivo `.csv` ou clique para selecionar.
    * *Nota: O CSV deve seguir as colunas do padrão V4 (veja o dicionário de dados).*
3. O sistema processará linha por linha e iniciará o **Download Automático**.
4. Abra o arquivo baixado (`PREVISOES_nome_do_arquivo.csv`). Ele conterá as colunas originais mais 3 novas:
    * `PREVISOES_IA`: O veredito (Cancela/Continua).
    * `PROBABILIDADE_CHURN`: O valor numérico (0.0 a 1.0).
    * `RISCO_ALTO`: Booleano (TRUE/FALSE).

---

## 5. Solução de Problemas

**"Erro ao conectar com o servidor"**

* Verifique se as janelas pretas (terminais) ainda estão abertas. Se fechou alguma, rode o `start_platform_v2.bat` novamente.

**"Probabilidade NaN ou Erro 500"**

* Verifique se você preencheu campos numéricos com letras ou formatos inválidos.
