
import React, { useState, useEffect } from 'react';
import { fetchCardapioByTipo, fetchConfiguracoes, savePedido } from '@/lib/supabaseServices';
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
  const [proteinas, setProteinas] = useState<any[]>([]);
  const [acompanhamentos, setAcompanhamentos] = useState<any[]>([]);
  const [saladas, setSaladas] = useState<any[]>([]);
  
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
    // Verificar se pelo menos uma proteína está selecionada
    if (proteinasSelecionadas.length === 0) return false;
    
    // Se for marmita grande, precisa de 2 proteínas
    if (tipoMarmita === 'grande' && proteinasSelecionadas.length < 2) return false;
    
    // Verificar se o endereço foi informado
    if (!endereco.trim()) return false;
    
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
  
  // Enviar pedido
  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({
        variant: "destructive",
        title: "Formulário incompleto",
        description: "Preencha todos os campos obrigatórios."
      });
      return;
    }
    
    try {
      // Salvar pedido no banco (opcional)
      const subtotal = (precoMarmita * quantidade) + (addAgua ? parseFloat(config.preco_agua) : 0);
      const total = subtotal + parseFloat(config.taxa_entrega);
      
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
          troco: troco
        }
      };
      
      await savePedido(pedidoData);
      
      // Montar URL do WhatsApp e redirecionar
      const message = formatWhatsappMessage();
      const whatsappUrl = `https://wa.me/${config.telefone_whatsapp}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "Pedido enviado",
        description: "Você será redirecionado para o WhatsApp."
      });
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar pedido",
        description: "Tente novamente mais tarde."
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">Marmitaria Família</h1>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna esquerda */}
          <div className="lg:col-span-2 space-y-6">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          {/* Coluna direita - resumo */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
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
    </div>
  );
};

export default Home;
