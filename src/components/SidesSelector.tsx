
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CardapioItem } from '@/lib/supabaseServices';

interface SidesSelectorProps {
  title: string;
  items: CardapioItem[];
  onSelect: (selected: string[]) => void;
}

const SidesSelector = ({ title, items, onSelect }: SidesSelectorProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleToggleItem = (item: string) => {
    setSelectedItems(prev => {
      // Se já está selecionado, remova
      if (prev.includes(item)) {
        const updated = prev.filter(i => i !== item);
        onSelect(updated);
        return updated;
      } 
      
      // Adiciona o item à seleção
      const updated = [...prev, item];
      onSelect(updated);
      return updated;
    });
  };

  return (
    <Card className="p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center space-x-2 border rounded p-2 cursor-pointer hover:bg-gray-50"
            onClick={() => handleToggleItem(item.nome)}
          >
            <Checkbox 
              id={`item-${item.id}`}
              checked={selectedItems.includes(item.nome)}
              onCheckedChange={() => handleToggleItem(item.nome)}
            />
            <Label
              htmlFor={`item-${item.id}`}
              className="flex-1 cursor-pointer"
            >
              {item.nome}
            </Label>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <p className="text-center text-muted-foreground mt-2">
          Nenhum item disponível
        </p>
      )}
    </Card>
  );
};

export default SidesSelector;
