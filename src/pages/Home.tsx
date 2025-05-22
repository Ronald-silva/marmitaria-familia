import React, { useState, useEffect } from 'react';
import { fetchCardapioByTipo, fetchConfiguracoes, savePedido, CardapioItem } from '@/lib/supabaseServices';
import MarmitaSelector from '@/components/MarmitaSelector';
import ProteinsSelector from '@/components/ProteinsSelector';
import SidesSelector from '@/components/SidesSelector';
import WaterOption from '@/components/WaterOption';
import PaymentSelector from '@/components/PaymentSelector';
import AddressInput from '@/components/AddressInput';
import OrderSummary from '@/components/OrderSummary';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

const Home = () => {
  // Estados para os dados do cardápio
  const [proteinas, setProteinas] = useState<CardapioItem[]>([]);
  const [acompanhamentos, setAcompanhamentos] = useState<CardapioItem[]>([]);
  const [saladas, setSaladas] = useState<CardapioItem[]>([]);
  
  // Estados para configurações
  const [config, setConfig] = useState<Record<string, string>>({
    preco_marmita_media: '12.00',
    preco_marmita_grande: '16.00',
    preco_agua: '5.00',
    taxa_entrega: '3.00',
    chave_pix: '',
    telefone_whatsapp: '5585912345678'
  });
  
  // Estados para a seleção do usuário
  const [tipoMarmita, setTipoMarmita] = useState<string>('media');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [precoMarmita, setPrecoMarmita] = useState<number>(12);
  const [proteinasSelecionadas, setProteinasSelecionadas] = useState<string[]>([]);
  const [acompanhamentosSelecionados, setAcompanhamentosSelecionados] = useState<string[]>([]);
  const [saladasSelecionadas, setSaladasSelecionadas] = useState<string[]>([]);
  const [addAgua, setAddAgua] = useState<boolean>(false);
  const [formaPagamento, setFormaPagamento] = useState<'pix' | 'dinheiro'>('pix');
  const [troco, setTroco] = useState<{valor: number, para: number} | undefined>();
  const [endereco, setEndereco] = useState<string>('');
  
  // Estado para carregamento
  const [loading, setLoading] = useState<boolean>(true);
  
  const { toast } = useToast();

  // Buscar dados do cardápio e configurações
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Carregar configurações
        const configData = await fetchConfiguracoes();
        if (Object.keys(configData).length > 0) {
          setConfig(configData);
          setPrecoMarmita(parseFloat(configData.preco_marmita_media));
        }
        
        // Carregar proteínas
        const proteinasData = await fetchCardapioByTipo('proteina');
        setProteinas(proteinasData);
        
        // Carregar acompanhamentos
        const acompanhamentosData = await fetchCardapioByTipo('acompanhamento');
        setAcompanhamentos(acompanhamentosData);
        
        // Carregar saladas
        const saladasData = await fetchCardapioByTipo('salada');
        setSaladas(saladasData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os itens do cardápio."
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  // Lidar com a seleção da marmita
  const handleMarmitaSelect = (tipo: string, qtd: number, preco: number) => {
    setTipoMarmita(tipo);
    setQuantidade(qtd);
    setPrecoMarmita(preco);
    
    // Limpar proteínas se mudar de grande para média
    if (tipo === 'media' && proteinasSelecionadas.length > 1) {
      setProteinasSelecionadas([proteinasSelecionadas[0]]);
    }
  };
  
  // Lidar com a adição de água
  const handleWaterToggle = (selected: boolean) => {
    setAddAgua(selected);
  };
  
  // Lidar com a seleção da forma de pagamento
  const handlePaymentSelect = (method: 'pix' | 'dinheiro', trocoInfo?: { valor: number, para: number }) => {
    setFormaPagamento(method);
    setTroco(trocoInfo);
  };
    // Verificar se o formulário é válido
  const isFormValid = () => {
    // Verificar quantidade
    if (!quantidade || quantidade < 1) return false;

    // Verificar proteínas
    if (proteinasSelecionadas.length === 0) return false;
    if (tipoMarmita === 'grande' && proteinasSelecionadas.length < 2) return false;
    if (tipoMarmita === 'media' && proteinasSelecionadas.length > 1) return false;
    
    // Verificar endereço
    if (!endereco.trim()) return false;
    if (endereco.length < 10) return false; // Endereço muito curto

    // Calcular total para validação do troco
    const total = calcularTotal();
    
    // Verificar forma de pagamento
    if (formaPagamento === 'dinheiro' && troco && troco.para < total) {
      return false; // Valor para troco menor que o total
    }
    
    return true;
  };
  
  // Montar mensagem para WhatsApp
  const formatWhatsappMessage = () => {
    const proteinas = proteinasSelecionadas.join(', ');
    const acompanhamentos = acompanhamentosSelecionados.length > 0 
      ? acompanhamentosSelecionados.join(', ') 
      : 'Nenhum';
    const saladas = saladasSelecionadas.length > 0 
      ? saladasSelecionadas.join(', ') 
      : 'Nenhuma';
    
    const subtotal = (precoMarmita * quantidade) + (addAgua ? parseFloat(config.preco_agua) : 0);
    const total = subtotal + parseFloat(config.taxa_entrega);
    
    let message = `*NOVO PEDIDO*\n\n`;
    message += `*Marmita ${tipoMarmita === 'media' ? 'Média' : 'Grande'} x${quantidade}*\n`;
    message += `*Proteínas:* ${proteinas}\n`;
    message += `*Acompanhamentos:* ${acompanhamentos}\n`;
    message += `*Saladas:* ${saladas}\n`;
    message += `*Água:* ${addAgua ? 'Sim' : 'Não'}\n\n`;
    message += `*Forma de pagamento:* ${formaPagamento === 'pix' ? 'PIX' : 'Dinheiro'}\n`;
    
    if (formaPagamento === 'dinheiro' && troco && troco.valor > 0) {
      message += `*Troco para:* R$ ${troco.para.toFixed(2)} → Levar R$ ${troco.valor.toFixed(2)}\n`;
    }
    
    message += `\n*Endereço:* ${endereco}\n\n`;
    message += `*Subtotal:* R$ ${subtotal.toFixed(2)}\n`;
    message += `*Taxa de entrega:* R$ ${parseFloat(config.taxa_entrega).toFixed(2)}\n`;
    message += `*Total:* R$ ${total.toFixed(2)}`;
    
    return encodeURIComponent(message);
  };
    // Calcular o total do pedido
  const calcularTotal = () => {
    const subtotal = (precoMarmita * quantidade) + (addAgua ? parseFloat(config.preco_agua) : 0);
    return subtotal + parseFloat(config.taxa_entrega);
  };

  // Enviar pedido
  const handleSubmit = async () => {
    const total = calcularTotal();

    // Validações específicas com mensagens detalhadas
    if (!quantidade || quantidade < 1) {
      toast({
        variant: "destructive",
        title: "Quantidade inválida",
        description: "Por favor, selecione pelo menos uma marmita."
      });
      return;
    }

    if (proteinasSelecionadas.length === 0) {
      toast({
        variant: "destructive",
        title: "Proteína não selecionada",
        description: tipoMarmita === 'grande' 
          ? "Selecione duas proteínas para a marmita grande."
          : "Selecione uma proteína para a marmita."
      });
      return;
    }

    if (!endereco.trim() || endereco.length < 10) {
      toast({
        variant: "destructive",
        title: "Endereço inválido",
        description: "Forneça um endereço completo para entrega."
      });
      return;
    }

    if (formaPagamento === 'dinheiro' && troco && troco.para < total) {
      toast({
        variant: "destructive",
        title: "Valor para troco inválido",
        description: `O valor precisa ser maior que o total do pedido (R$ ${total.toFixed(2)}).`
      });
      return;
    }
      try {
      // Exibir toast de carregamento
      toast({
        title: "Processando pedido",
        description: "Aguarde enquanto salvamos seu pedido..."
      });

      const total = calcularTotal();
      
      const pedidoData = {
        cliente: "Cliente via site",
        endereco: endereco,
        forma_pagamento: formaPagamento,
        total: total,
        detalhes: {
          tipo_marmita: tipoMarmita,
          quantidade: quantidade,
          proteinas: proteinasSelecionadas,
          acompanhamentos: acompanhamentosSelecionados,
          saladas: saladasSelecionadas,
          agua: addAgua,
          troco: troco,
          data_pedido: new Date().toISOString(),
          valor_unitario: precoMarmita,
          taxa_entrega: parseFloat(config.taxa_entrega)
        }
      };
      
      // Salvar pedido no banco
      const resultado = await savePedido(pedidoData);
      
      if (!resultado.success) {
        throw new Error(resultado.error || 'Falha ao salvar o pedido');
      }
      
      // Montar URL do WhatsApp e redirecionar
      const message = formatWhatsappMessage();
      const whatsappUrl = `https://wa.me/${config.telefone_whatsapp}?text=${message}`;
      
      // Limpar formulário
      setProteinasSelecionadas([]);
      setAcompanhamentosSelecionados([]);
      setSaladasSelecionadas([]);
      setAddAgua(false);
      setTroco(undefined);
      setEndereco('');
      
      // Abrir WhatsApp em nova aba
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "Pedido enviado com sucesso!",
        description: "Você será redirecionado para o WhatsApp para finalizar seu pedido."
      });
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar pedido",
        description: error instanceof Error 
          ? error.message 
          : "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde."
      });
    }
  };

  // Número máximo de proteínas conforme o tipo de marmita
  const maxProteinas = tipoMarmita === 'media' ? 1 : 2;
  
  // Renderizar loader
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-green-700 mb-8">Marmitaria Família</h1>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="md:col-span-3 lg:col-span-1">
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-[85%] sm:max-w-xl lg:max-w-2xl mx-auto py-4 sm:py-6 px-2 sm:px-4">
        <h1 className="text-lg sm:text-xl font-bold text-center text-green-700 mb-4">Marmitaria Família</h1>
        
        <div className="grid grid-cols-1 gap-3">
          {/* Seleção principal */}
          <div className="space-y-3">
            <MarmitaSelector 
              precoMedia={parseFloat(config.preco_marmita_media)} 
              precoGrande={parseFloat(config.preco_marmita_grande)}
              onSelect={handleMarmitaSelect}
            />
            
            <ProteinsSelector 
              proteins={proteinas} 
              maxSelection={maxProteinas}
              onSelect={setProteinasSelecionadas}
            />
          </div>

          {/* Seleções secundárias */}
          <div className="space-y-3">
            <SidesSelector 
              title="Acompanhamentos" 
              items={acompanhamentos}
              onSelect={setAcompanhamentosSelecionados}
            />
            
            <SidesSelector 
              title="Saladas" 
              items={saladas}
              onSelect={setSaladasSelecionadas}
            />
          </div>

          {/* Opções adicionais */}
          <div className="space-y-3">
            <WaterOption 
              precoAgua={parseFloat(config.preco_agua)}
              onToggle={handleWaterToggle}
            />
            
            <PaymentSelector 
              total={(precoMarmita * quantidade) + (addAgua ? parseFloat(config.preco_agua) : 0) + parseFloat(config.taxa_entrega)}
              chavePix={config.chave_pix}
              onSelect={handlePaymentSelect}
            />
            
            <AddressInput 
              onChange={setEndereco}
              value={endereco}
            />
          </div>

          {/* Resumo do pedido */}
          <div className="mt-2">
            <OrderSummary 
              tipoMarmita={tipoMarmita}
              quantidade={quantidade}
              precoMarmita={precoMarmita}
              proteinas={proteinasSelecionadas}
              acompanhamentos={acompanhamentosSelecionados}
              saladas={saladasSelecionadas}
              agua={addAgua}
              precoAgua={parseFloat(config.preco_agua)}
              formaPagamento={formaPagamento}
              troco={troco}
              endereco={endereco}
              taxaEntrega={parseFloat(config.taxa_entrega)}
              telefoneWhatsapp={config.telefone_whatsapp}
              onSubmit={handleSubmit}
              isFormValid={isFormValid()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
