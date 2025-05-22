
import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { MenuData, MenuItem, saveMenu } from '@/lib/supabaseClient';
import { useIsMobile } from '@/hooks/use-mobile';

interface MenuFormProps {
  initialMenu: MenuData;
  onSave: () => void;
}

const MenuForm: React.FC<MenuFormProps> = ({ initialMenu, onSave }) => {
  const [menu, setMenu] = useState<MenuData>(initialMenu);
  const [date, setDate] = useState<string>(initialMenu.date);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    setMenu(initialMenu);
    setDate(initialMenu.date);
  }, [initialMenu]);

  // Melhorado para lidar melhor com espaços e vírgulas
  const formatInputArray = (value: string): string[] => {
    if (!value) return [];
    // Divide por vírgulas, remove espaços em branco e filtra strings vazias
    return value.split(',').map(item => item.trim()).filter(Boolean);
  };

  // Converte array para string separada por vírgulas para exibição no input
  const formatArrayForInput = (array: string[] | undefined): string => {
    if (!array || array.length === 0) return '';
    return array.join(', ');
  };

  const handleItemChange = (index: number, field: keyof MenuItem, value: any) => {
    const newItems = [...menu.items];
    
    if (field === 'proteins' || field === 'salads' || field === 'sides') {
      newItems[index] = { 
        ...newItems[index], 
        [field]: formatInputArray(value) 
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    
    setMenu({ ...menu, items: newItems });
  };

  const addNewItem = () => {
    const newItems = [...menu.items];
    newItems.push({
      type: "",
      price: 0,
      proteins: [],
      salads: [],
      sides: [],
      available: true
    });
    setMenu({ ...menu, items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = [...menu.items];
    newItems.splice(index, 1);
    setMenu({ ...menu, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    for (const item of menu.items) {
      if (!item.type || item.price <= 0) {
        toast({
          title: "Dados incompletos",
          description: "Todos os itens devem ter nome e preço válido.",
          variant: "destructive"
        });
        return;
      }
    }
    
    try {
      // Salva o menu com a data selecionada
      const result = await saveMenu({
        ...menu,
        date
      });
      
      if (result.success) {
        toast({
          title: "Menu salvo!",
          description: result.message
        });
        onSave();
      } else {
        toast({
          title: "Erro ao salvar",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao salvar menu:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao tentar salvar o menu.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-muted">
        <h3 className="text-lg font-semibold mb-3">Configuração do Menu</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data do Menu:
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="marmita-input"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Configure o menu para cada dia específico.
          </p>
        </div>
      </div>

      {menu.items.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-muted">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Item #{index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
              className="text-vermelho hover:text-vermelho hover:bg-red-50"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {/* Nome e preço do item */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome:
                </label>
                <Input
                  value={item.type}
                  onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                  placeholder="Ex: Marmita Grande"
                  className="marmita-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço (R$):
                </label>
                <Input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.5"
                  className="marmita-input"
                />
              </div>
            </div>
            
            {/* Switch de disponibilidade para galão de água */}
            {item.type.toLowerCase().includes('galão') && (
              <div className="flex items-center space-x-2">
                <Switch
                  checked={!!item.available}
                  onCheckedChange={(checked) => handleItemChange(index, 'available', checked)}
                />
                <label className="text-sm font-medium text-gray-700">
                  Disponível
                </label>
              </div>
            )}
            
            {/* Opções para marmitas */}
            {item.type.toLowerCase().includes('marmita') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proteínas (separadas por vírgula):
                  </label>
                  <Input
                    value={formatArrayForInput(item.proteins)}
                    onChange={(e) => handleItemChange(index, 'proteins', e.target.value)}
                    placeholder="Ex: Frango, Carne, Porco ao molho"
                    className="marmita-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Acompanhamentos (separados por vírgula):
                  </label>
                  <Input
                    value={formatArrayForInput(item.sides)}
                    onChange={(e) => handleItemChange(index, 'sides', e.target.value)}
                    placeholder="Ex: Arroz, Feijão, Macarrão"
                    className="marmita-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Saladas (separadas por vírgula):
                  </label>
                  <Input
                    value={formatArrayForInput(item.salads)}
                    onChange={(e) => handleItemChange(index, 'salads', e.target.value)}
                    placeholder="Ex: Alface, Tomate, Repolho"
                    className="marmita-input"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ))}
      
      <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'justify-between'}`}>
        <Button
          type="button"
          onClick={addNewItem}
          className={`flex items-center gap-1 ${isMobile ? 'w-full' : ''}`}
        >
          <Plus className="h-4 w-4" /> Adicionar Item
        </Button>
        
        <Button
          type="submit"
          className={`marmita-btn-primary flex items-center gap-1 ${isMobile ? 'w-full' : ''}`}
        >
          <Save className="h-4 w-4" /> Salvar Menu
        </Button>
      </div>
    </form>
  );
};

export default MenuForm;
