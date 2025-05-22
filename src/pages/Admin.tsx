
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  fetchAllCardapio, 
  fetchConfiguracoes, 
  saveCardapioItem, 
  removeCardapioItem,
  updateCardapioItemStatus,
  updateConfiguracao,
  CardapioItem,
  Configuracao
} from '@/lib/supabaseServices';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  ChevronRight, 
  Save, 
  Trash, 
  Plus, 
  RefreshCw, 
  LogOut,
  Loader2
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Password para acesso admin
const ADMIN_PASSWORD = 'admin123';

// Lista pré-definida de proteínas
const PROTEINAS_PREDEFINIDAS = [
  "Frango ao molho", "Frango frito", "Frango com legumes", 
  "Frango empanado", "Frango acebolado", "Creme de galinha",
  "Frango à milanesa", "Bife ao molho", "Bife trinchado",
  "Bife acebolado", "Carne moída", "Picadinho de gado",
  "Assado de panela", "Carne cozida", "Panelada",
  "Cozidão de boi", "Galinha caipira", "Pernil suína ao molho",
  "Paleta suína", "Bisteca suína", "Bisteca suína acebolada",
  "Bisteca de porco no molho da cebola", "Fígado acebolado",
  "Fígado trinchado acebolado", "Calabresa acebolada",
  "Ovos fritos", "Ovos com calabresa", "Omelete de carne",
  "Bolinha de carne", "Panqueca de carne", 
  "Estrogonofe de frango", "Peixe frito", "Carne suína ao molho",
  "Porco ao molho"
];

// Lista pré-definida de acompanhamentos
const ACOMPANHAMENTOS_PREDEFINIDOS = [
  "Arroz", "Feijão", "Macarrão", "Espaguete no alho e óleo",
  "Cuscuz", "Pirão", "Farofa da casa", "Farofa de cuscuz",
  "Farofa de farinha", "Farofa de farinha temperada"
];

// Lista pré-definida de saladas
const SALADAS_PREDEFINIDAS = [
  "Salada de alface", "Salada de legumes", "Salada verde", 
  "Salada de alface com cenoura", "Salada de repolho",
  "Salada de repolho com cenoura", "Salada de legumes cozida",
  "Salada de legumes com alface"
];

const Admin = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cardapio, setCardapio] = useState<CardapioItem[]>([]);
  const [configuracoes, setConfiguracoes] = useState<Record<string, string>>({});
  const [novoItem, setNovoItem] = useState('');
  const [tipoAtual, setTipoAtual] = useState<'proteina' | 'acompanhamento' | 'salada'>('proteina');
  const [itemSelecionado, setItemSelecionado] = useState<string>('');
  
  // Form fields para configurações
  const [precoMarmitaMedia, setPrecoMarmitaMedia] = useState('');
  const [precoMarmitaGrande, setPrecoMarmitaGrande] = useState('');
  const [precoAgua, setPrecoAgua] = useState('');
  const [aguaDisponivel, setAguaDisponivel] = useState(true);
  const [taxaEntrega, setTaxaEntrega] = useState('');
  const [valorKm, setValorKm] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [chaveMapbox, setChaveMapbox] = useState('');

  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar se já está autenticado
  useEffect(() => {
    const storedAuth = localStorage.getItem('marmitaria_auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Carregar dados quando autenticado
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadData = async () => {
      setLoading(true);
      try {
        const [cardapioData, configData] = await Promise.all([
          fetchAllCardapio(),
          fetchConfiguracoes()
        ]);
        
        setCardapio(cardapioData);
        setConfiguracoes(configData);
        
        // Preencher os campos de configuração
        setPrecoMarmitaMedia(configData.preco_marmita_media || '12');
        setPrecoMarmitaGrande(configData.preco_marmita_grande || '16');
        setPrecoAgua(configData.preco_agua || '5');
        setAguaDisponivel(configData.agua_disponivel === 'true');
        setTaxaEntrega(configData.taxa_entrega || '3');
        setValorKm(configData.valor_km || '1');
        setChavePix(configData.chave_pix || '');
        setChaveMapbox(configData.chave_mapbox || '');
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do sistema.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [isAuthenticated, toast]);

  // Função de login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('marmitaria_auth', 'true');
    } else {
      toast({
        title: "Senha incorreta",
        description: "Verifique a senha e tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Função para logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('marmitaria_auth');
  };

  // Função para adicionar item ao cardápio
  const handleAddItem = async () => {
    let itemToAdd = itemSelecionado || novoItem;
    
    if (!itemToAdd.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, selecione ou digite o nome do item.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await saveCardapioItem({
        tipo: tipoAtual,
        nome: itemToAdd.trim(),
        ativo: true
      });
      
      if (result.success) {
        toast({
          title: "Item adicionado",
          description: `${itemToAdd} foi adicionado ao cardápio.`
        });
        
        // Atualizar a lista local
        const newItem: CardapioItem = {
          id: result.id || 'temp-id',
          tipo: tipoAtual,
          nome: itemToAdd.trim(),
          ativo: true
        };
        
        setCardapio(prev => [...prev, newItem]);
        setNovoItem('');
        setItemSelecionado('');
      } else {
        toast({
          title: "Erro ao adicionar item",
          description: result.error || "Houve um problema ao adicionar o item.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para remover item do cardápio
  const handleRemoveItem = async (id: string, nome: string) => {
    if (!confirm(`Deseja realmente remover "${nome}" do cardápio?`)) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await removeCardapioItem(id);
      
      if (result.success) {
        toast({
          title: "Item removido",
          description: `${nome} foi removido do cardápio.`
        });
        
        // Atualizar a lista local
        setCardapio(prev => prev.filter(item => item.id !== id));
      } else {
        toast({
          title: "Erro ao remover item",
          description: result.error || "Houve um problema ao remover o item.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar status de disponibilidade de água
  const handleToggleAgua = async (checked: boolean) => {
    setAguaDisponivel(checked);
    
    try {
      const result = await updateConfiguracao('agua_disponivel', checked.toString());
      
      if (result.success) {
        toast({
          title: "Configuração atualizada",
          description: `Água ${checked ? 'disponível' : 'indisponível'}.`
        });
      } else {
        toast({
          title: "Erro ao atualizar configuração",
          description: result.error || "Houve um problema ao atualizar a configuração.",
          variant: "destructive"
        });
        // Reverter mudança em caso de erro
        setAguaDisponivel(!checked);
      }
    } catch (error) {
      console.error('Erro ao atualizar disponibilidade de água:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      // Reverter mudança em caso de erro
      setAguaDisponivel(!checked);
    }
  };

  // Função para salvar configurações de preço
  const handleSavePrecos = async () => {
    setLoading(true);
    try {
      const updates = [
        updateConfiguracao('preco_marmita_media', precoMarmitaMedia),
        updateConfiguracao('preco_marmita_grande', precoMarmitaGrande),
        updateConfiguracao('preco_agua', precoAgua),
        updateConfiguracao('taxa_entrega', taxaEntrega),
        updateConfiguracao('valor_km', valorKm)
      ];
      
      const results = await Promise.all(updates);
      
      if (results.every(r => r.success)) {
        toast({
          title: "Preços atualizados",
          description: "Todos os valores foram atualizados com sucesso."
        });
      } else {
        const errors = results.filter(r => !r.success).map(r => r.error);
        toast({
          title: "Erro ao atualizar preços",
          description: `Alguns valores não puderam ser atualizados: ${errors.join(', ')}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar preços:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado ao atualizar os preços.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para salvar chave Pix
  const handleSaveChavePix = async () => {
    if (!chavePix.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, digite a chave Pix.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await updateConfiguracao('chave_pix', chavePix.trim());
      
      if (result.success) {
        toast({
          title: "Chave Pix atualizada",
          description: "A chave Pix foi atualizada com sucesso."
        });
      } else {
        toast({
          title: "Erro ao atualizar chave Pix",
          description: result.error || "Houve um problema ao atualizar a chave Pix.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar chave Pix:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado ao atualizar a chave Pix.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para salvar chave da API Mapbox
  const handleSaveChaveMapbox = async () => {
    if (!chaveMapbox.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, digite a chave da API Mapbox.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await updateConfiguracao('chave_mapbox', chaveMapbox.trim());
      
      if (result.success) {
        toast({
          title: "Chave da API atualizada",
          description: "A chave da API Mapbox foi atualizada com sucesso."
        });
      } else {
        toast({
          title: "Erro ao atualizar chave da API",
          description: result.error || "Houve um problema ao atualizar a chave da API Mapbox.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar chave da API Mapbox:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado ao atualizar a chave da API Mapbox.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para recarregar os dados
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [cardapioData, configData] = await Promise.all([
        fetchAllCardapio(),
        fetchConfiguracoes()
      ]);
      
      setCardapio(cardapioData);
      setConfiguracoes(configData);
      
      // Atualizar os campos de configuração
      setPrecoMarmitaMedia(configData.preco_marmita_media || '12');
      setPrecoMarmitaGrande(configData.preco_marmita_grande || '16');
      setPrecoAgua(configData.preco_agua || '5');
      setAguaDisponivel(configData.agua_disponivel === 'true');
      setTaxaEntrega(configData.taxa_entrega || '3');
      setValorKm(configData.valor_km || '1');
      setChavePix(configData.chave_pix || '');
      setChaveMapbox(configData.chave_mapbox || '');
      
      toast({
        title: "Dados atualizados",
        description: "Informações recarregadas com sucesso."
      });
    } catch (error) {
      console.error('Erro ao recarregar dados:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível recarregar os dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar cardápio por tipo
  const cardapioFiltrado = cardapio.filter(item => item.tipo === tipoAtual);
  
  // Obter listas predefinidas com base no tipo selecionado
  const getPreDefinedItems = () => {
    switch (tipoAtual) {
      case 'proteina':
        return PROTEINAS_PREDEFINIDAS;
      case 'acompanhamento':
        return ACOMPANHAMENTOS_PREDEFINIDOS;
      case 'salada':
        return SALADAS_PREDEFINIDAS;
      default:
        return [];
    }
  };
  
  const getTipoLabel = () => {
    switch (tipoAtual) {
      case 'proteina':
        return 'Proteína';
      case 'acompanhamento':
        return 'Acompanhamento';
      case 'salada':
        return 'Salada';
      default:
        return '';
    }
  };
  
  const formattedDate = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });

  if (loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-green" />
          <p className="text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-beige flex flex-col">
        <header className="bg-green py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-white text-2xl font-bold text-center">Área Administrativa</h1>
          </div>
        </header>
        
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">Login Administrativo</h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password" className="block text-sm font-medium mb-1">
                  Senha:
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  placeholder="Digite a senha de administrador"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full bg-green hover:bg-green-600">
                Acessar
              </Button>
              
              <div className="text-center">
                <a href="/" className="text-sm text-green hover:underline">
                  Voltar para o Cardápio
                </a>
              </div>
            </form>
          </div>
        </main>
        
        <footer className="bg-brown text-white py-3 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm">
            <p>Marmitaria Família &copy; 2025 - Área Administrativa</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      <header className="bg-green py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-xl md:text-2xl font-bold">Área Administrativa</h1>
            <Button 
              variant="ghost" 
              className="text-white hover:text-white hover:bg-green-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" /> Sair
            </Button>
          </div>
          <p className="text-white text-sm mt-1">
            Configurando o cardápio para {formattedDate}
          </p>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green" />
            <span className="ml-2">Carregando dados...</span>
          </div>
        ) : (
          <Tabs defaultValue="cardapio" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-4">
                <TabsTrigger value="cardapio">Cardápio</TabsTrigger>
                <TabsTrigger value="precos">Preços</TabsTrigger>
                <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
                <TabsTrigger value="pix" className="hidden md:inline-flex">Pix</TabsTrigger>
                <TabsTrigger value="mapbox" className="hidden md:inline-flex">Mapbox</TabsTrigger>
              </TabsList>
              
              <Button 
                variant="outline"
                onClick={handleRefresh}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" /> Atualizar
              </Button>
            </div>
            
            <TabsContent value="cardapio" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Itens do Cardápio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant={tipoAtual === 'proteina' ? 'default' : 'outline'} 
                      onClick={() => setTipoAtual('proteina')}
                      className="flex-1"
                    >
                      Proteínas
                    </Button>
                    <Button 
                      variant={tipoAtual === 'acompanhamento' ? 'default' : 'outline'} 
                      onClick={() => setTipoAtual('acompanhamento')}
                      className="flex-1"
                    >
                      Acompanhamentos
                    </Button>
                    <Button 
                      variant={tipoAtual === 'salada' ? 'default' : 'outline'} 
                      onClick={() => setTipoAtual('salada')}
                      className="flex-1"
                    >
                      Saladas
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <div className="flex-grow">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full flex justify-between">
                              {itemSelecionado || `Selecione ${getTipoLabel()}`}
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-64 max-h-60 overflow-y-auto">
                            {getPreDefinedItems().map((item) => (
                              <DropdownMenuItem 
                                key={item} 
                                onClick={() => {
                                  setItemSelecionado(item);
                                  setNovoItem('');
                                }}
                              >
                                {item}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Button 
                        onClick={handleAddItem} 
                        className="bg-green hover:bg-green-600"
                        disabled={loading || (!itemSelecionado && !novoItem)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-center text-muted-foreground">ou</p>
                    <div className="flex space-x-2">
                      <Input
                        placeholder={`Digite o nome do ${getTipoLabel().toLowerCase()}`}
                        value={novoItem}
                        onChange={(e) => {
                          setNovoItem(e.target.value);
                          setItemSelecionado('');
                        }}
                        className="flex-grow"
                      />
                      <Button 
                        onClick={handleAddItem} 
                        className="bg-green hover:bg-green-600"
                        disabled={loading || (!itemSelecionado && !novoItem)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-full">Nome do Item</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cardapioFiltrado.length > 0 ? (
                          cardapioFiltrado.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.nome}</TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleRemoveItem(item.id, item.nome)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                              Nenhum item cadastrado.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Disponibilidade de Água</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Label htmlFor="agua-disponivel" className="text-base">
                    Galão de Água 25L disponível
                  </Label>
                  <Switch 
                    id="agua-disponivel" 
                    checked={aguaDisponivel}
                    onCheckedChange={handleToggleAgua}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="precos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuração de Preços</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="preco-media">Preço Marmita Média (R$):</Label>
                      <Input 
                        id="preco-media" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        value={precoMarmitaMedia}
                        onChange={(e) => setPrecoMarmitaMedia(e.target.value)}
                        placeholder="Ex: 12.00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preco-grande">Preço Marmita Grande (R$):</Label>
                      <Input 
                        id="preco-grande" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        value={precoMarmitaGrande}
                        onChange={(e) => setPrecoMarmitaGrande(e.target.value)}
                        placeholder="Ex: 16.00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preco-agua">Preço da Água (R$):</Label>
                      <Input 
                        id="preco-agua" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        value={precoAgua}
                        onChange={(e) => setPrecoAgua(e.target.value)}
                        placeholder="Ex: 5.00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="taxa-entrega">Taxa de Entrega Mínima (R$):</Label>
                      <Input 
                        id="taxa-entrega" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        value={taxaEntrega}
                        onChange={(e) => setTaxaEntrega(e.target.value)}
                        placeholder="Ex: 3.00"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="valor-km">Preço por KM (R$):</Label>
                      <Input 
                        id="valor-km" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        value={valorKm}
                        onChange={(e) => setValorKm(e.target.value)}
                        placeholder="Ex: 1.00"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      onClick={handleSavePrecos}
                      className="bg-green hover:bg-green-600"
                      disabled={loading}
                    >
                      <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="configuracoes" className="space-y-4 flex flex-wrap gap-4">
              <div className="w-full md:hidden space-y-4">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Configuração de Pix</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="chave-pix-mobile">Chave Pix:</Label>
                      <Input 
                        id="chave-pix-mobile" 
                        value={chavePix}
                        onChange={(e) => setChavePix(e.target.value)}
                        placeholder="Digite a chave Pix"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSaveChavePix}
                        className="bg-green hover:bg-green-600"
                        disabled={loading || !chavePix.trim()}
                      >
                        <Save className="h-4 w-4 mr-2" /> Salvar Chave Pix
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>API de Mapas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="chave-mapbox-mobile">Chave API Mapbox:</Label>
                      <Input 
                        id="chave-mapbox-mobile" 
                        value={chaveMapbox}
                        onChange={(e) => setChaveMapbox(e.target.value)}
                        placeholder="Digite a chave da API Mapbox"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSaveChaveMapbox}
                        className="bg-green hover:bg-green-600"
                        disabled={loading || !chaveMapbox.trim()}
                      >
                        <Save className="h-4 w-4 mr-2" /> Salvar Chave API
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Água Disponível</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Label htmlFor="agua-disponivel-tab" className="text-base">
                    Galão de Água 25L disponível
                  </Label>
                  <Switch 
                    id="agua-disponivel-tab" 
                    checked={aguaDisponivel}
                    onCheckedChange={handleToggleAgua}
                  />
                </CardContent>
              </Card>
              
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Voltar para o Cardápio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">
                    Visualize o cardápio como seus clientes o veem.
                  </p>
                  <Button 
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="w-full"
                  >
                    Visualizar Página do Cliente
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pix" className="hidden md:block">
              <Card>
                <CardHeader>
                  <CardTitle>Configuração de Pix</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="chave-pix">Chave Pix:</Label>
                    <Input 
                      id="chave-pix" 
                      value={chavePix}
                      onChange={(e) => setChavePix(e.target.value)}
                      placeholder="Digite a chave Pix"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveChavePix}
                      className="bg-green hover:bg-green-600"
                      disabled={loading || !chavePix.trim()}
                    >
                      <Save className="h-4 w-4 mr-2" /> Salvar Chave Pix
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mapbox" className="hidden md:block">
              <Card>
                <CardHeader>
                  <CardTitle>API de Mapas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="chave-mapbox">Chave API Mapbox:</Label>
                    <Input 
                      id="chave-mapbox" 
                      value={chaveMapbox}
                      onChange={(e) => setChaveMapbox(e.target.value)}
                      placeholder="Digite a chave da API Mapbox"
                    />
                    <p className="text-xs text-muted-foreground">
                      Esta chave é usada para calcular distâncias e taxas de entrega.
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveChaveMapbox}
                      className="bg-green hover:bg-green-600"
                      disabled={loading || !chaveMapbox.trim()}
                    >
                      <Save className="h-4 w-4 mr-2" /> Salvar Chave API
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
      
      <footer className="bg-brown text-white py-3 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>Marmitaria Família &copy; 2025 - Área Administrativa</p>
          <div className="mt-2">
            <a href="/" className="text-white underline hover:text-gray-300">
              Voltar ao Cardápio
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
