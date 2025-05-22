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
    <Card className="p-3 sm:p-4 shadow-sm w-full bg-white/80 backdrop-blur-sm">
      <h3 className="text-sm sm:text-base font-medium mb-3 text-center text-green-800">{title}</h3>
      <div className="grid grid-cols-1 gap-2">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center gap-2 border rounded-md p-2 cursor-pointer hover:bg-gray-50/80 transition-colors"
            onClick={() => handleToggleItem(item.nome)}
          >
            <Checkbox 
              id={`item-${item.id}`}
              checked={selectedItems.includes(item.nome)}
              onCheckedChange={() => handleToggleItem(item.nome)}
              className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            />
            <Label
              htmlFor={`item-${item.id}`}
              className="flex-1 cursor-pointer text-sm sm:text-base"
            >
              {item.nome}
            </Label>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <p className="text-center text-muted-foreground text-sm mt-2">
          Nenhum item disponível
        </p>
      )}
    </Card>
  );
};

export default SidesSelector;
