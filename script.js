document.addEventListener('DOMContentLoaded', () => {
  // Inicializa os ícones do Lucide
  lucide.createIcons();

  // Mapeamento de IDs dos campos de formulário
  const inputs = {
    orcamento: document.getElementById('orcamento'),
    tipoPiscina: document.getElementById('tipoPiscina'),
    tamanho: document.getElementById('tamanho'),
    profundidade: document.getElementById('profundidade'),
    valorEstimado: document.getElementById('valorEstimado')
  };

  const btnLimpar = document.getElementById('btnLimpar');
  const flowchartArea = document.getElementById('flowchartArea');

  // Adiciona Event Listeners em todos os campos para atualização em tempo real
  Object.values(inputs).forEach(input => {
    input.addEventListener('input', renderFlowchart);
    input.addEventListener('change', renderFlowchart);
  });

  btnLimpar.addEventListener('click', () => {
    Object.values(inputs).forEach(input => {
      input.value = '';
    });
    renderFlowchart();
  });

  // Função principal para renderizar o fluxograma
  function renderFlowchart() {
    const values = {
      orcamento: parseFloat(inputs.orcamento.value) || 0,
      tipoPiscina: inputs.tipoPiscina.value,
      tamanho: inputs.tamanho.value,
      profundidade: inputs.profundidade.value,
      valorEstimado: parseFloat(inputs.valorEstimado.value) || 0
    };

    // Textos explicativos para exibição
    const tipoTextos = {
      fibra: 'Fibra de Vidro',
      vinil: 'Vinil Personalizado',
      alvenaria: 'Alvenaria / Azulejo',
      plastico: 'Estruturada / Plástico'
    };

    const tamanhoTextos = {
      pequena: 'Pequena (Até 4m x 2.5m)',
      media: 'Média (Até 7m x 3m)',
      grande: 'Grande (Acima de 8m x 4m)'
    };

    const profundidadeTextos = {
      rasa: 'Rasa (1.0m - 1.2m)',
      padrao: 'Padrão (1.4m - 1.5m)',
      funda: 'Funda (1.6m - 2.0m+)'
    };

    // Lógica da Análise de Orçamento x Custo
    let statusHTML = '';
    let nodeResultadoClass = '';

    if (values.orcamento > 0 && values.valorEstimado > 0) {
      const diff = values.orcamento - values.valorEstimado;
      if (diff >= 0) {
        nodeResultadoClass = 'highlight-ok';
        statusHTML = `
          <div class="status-badge status-ok">
            ✓ Dentro do Orçamento (Sobra: R$ ${diff.toLocaleString('pt-BR')})
          </div>
        `;
      } else {
        nodeResultadoClass = 'highlight-warn';
        statusHTML = `
          <div class="status-badge status-warn">
            ⚠️ Excede o Orçamento (Falta: R$ ${Math.abs(diff).toLocaleString('pt-BR')})
          </div>
        `;
      }
    }

    // Configuração dos Nós do Fluxograma
    const nodes = [
      {
        icon: 'wallet',
        step: 'Passo 01 - Investimento Disponível',
        value: values.orcamento ? `R$ ${values.orcamento.toLocaleString('pt-BR')}` : 'Não Informado',
        active: values.orcamento > 0
      },
      {
        icon: 'waves',
        step: 'Passo 02 - Modelo Escolhido',
        value: values.tipoPiscina ? tipoTextos[values.tipoPiscina] : 'Não Selecionado',
        active: Boolean(values.tipoPiscina)
      },
      {
        icon: 'maximize-2',
        step: 'Passo 03 - Dimensão / Tamanho',
        value: values.tamanho ? tamanhoTextos[values.tamanho] : 'Não Selecionado',
        active: Boolean(values.tamanho)
      },
      {
        icon: 'arrow-down',
        step: 'Passo 04 - Profundidade',
        value: values.profundidade ? profundidadeTextos[values.profundidade] : 'Não Selecionada',
        active: Boolean(values.profundidade)
      },
      {
        icon: 'tag',
        step: 'Passo 05 - Valor do Orçamento',
        value: values.valorEstimado ? `R$ ${values.valorEstimado.toLocaleString('pt-BR')}` : 'Não Informado',
        active: values.valorEstimado > 0,
        extra: statusHTML,
        customClass: nodeResultadoClass
      }
    ];

    // Construção do HTML do Fluxograma
    let html = '';
    nodes.forEach((node, idx) => {
      const isActive = node.active ? 'active' : '';
      const customCls = node.customClass || '';

      html += `
        <div class="flow-node ${isActive} ${customCls}">
          <div class="flow-icon-box">
            <i data-lucide="${node.icon}"></i>
          </div>
          <div class="flow-content">
            <div class="flow-step-title">${node.step}</div>
            <div class="flow-step-val">${node.value}</div>
            ${node.extra || ''}
          </div>
        </div>
      `;

      // Linha de conexão entre nós
      if (idx < nodes.length - 1) {
        const lineActive = node.active && nodes[idx + 1].active ? 'active' : '';
        html += `<div class="flow-line ${lineActive}"></div>`;
      }
    });

    flowchartArea.innerHTML = html;
    
    // Re-inicializa os ícones gerados dinamicamente
    lucide.createIcons();
  }

  // Render inicial
  renderFlowchart();
});