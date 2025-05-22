
import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { MenuItem as MenuItemType } from '../lib/supabaseClient';

interface MenuItemProps {
  item: MenuItemType;
  onSelect: (item: MenuItemType, options: MenuItemSelection) => void;
  isSelected: boolean;
}

export interface MenuItemSelection {
  protein?: string;
  salad?: string;
  side?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onSelect, isSelected }) => {
  const [selection, setSelection] = useState<MenuItemSelection>({
    protein: item.proteins ? item.proteins[0] : undefined,
    salad: item.salads ? item.salads[0] : undefined,
    side: item.sides ? item.sides[0] : undefined,
  });

  const handleChange = (field: keyof MenuItemSelection, value: string) => {
    const newSelection = { ...selection, [field]: value };
    setSelection(newSelection);
    
    if (isSelected) {
      onSelect(item, newSelection);
    }
  };

  const handleClick = () => {
    onSelect(item, selection);
  };

  if (item.type === "Galão de Água 25L" && item.available === false) {
    return null;
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-md border transition-all text-center">
        <div className="p-6 flex flex-col items-center">
          <div className="mb-4 text-center w-full">
            <h3 className="text-xl font-semibold">
              {item.type}
            </h3>
            <span className="font-bold text-green-dark mt-2 block">
              R$ {item.price.toFixed(2)}
            </span>
          </div>

          {item.type.includes("Marmita") && (
            <div className="space-y-6 mt-4 w-full flex flex-col items-center">
              {item.proteins && item.proteins.length > 0 && (
                <div className="flex flex-col items-center w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                    Proteína:
                  </label>
                  <select 
                    className="w-full max-w-xs rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-center mx-auto"
                    value={selection.protein}
                    onChange={(e) => handleChange('protein', e.target.value)}
                    disabled={!isSelected}
                  >
                    {item.proteins.map((protein) => (
                      <option key={protein} value={protein}>{protein}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {item.sides && item.sides.length > 0 && (
                <div className="flex flex-col items-center w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                    Acompanhamento:
                  </label>
                  <select
                    className="w-full max-w-xs rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-center mx-auto"
                    value={selection.side}
                    onChange={(e) => handleChange('side', e.target.value)}
                    disabled={!isSelected}
                  >
                    {item.sides.map((side) => (
                      <option key={side} value={side}>{side}</option>
                    ))}
                  </select>
                </div>
              )}
              
              {item.salads && item.salads.length > 0 && (
                <div className="flex flex-col items-center w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                    Salada:
                  </label>
                  <select
                    className="w-full max-w-xs rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-center mx-auto"
                    value={selection.salad}
                    onChange={(e) => handleChange('salad', e.target.value)}
                    disabled={!isSelected}
                  >
                    {item.salads.map((salad) => (
                      <option key={salad} value={salad}>{salad}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-6 w-full flex justify-center">
            <button 
              onClick={handleClick}
              className={`w-full max-w-xs flex items-center justify-center rounded-md px-4 py-3 font-medium transition-colors ${
                isSelected 
                  ? 'bg-mostarda text-brown-dark hover:bg-amber-400 focus:ring-mostarda' 
                  : 'bg-green text-white hover:bg-green-dark focus:ring-green'
              } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
            >
              {isSelected ? (
                <>
                  <Check className="mr-1.5 h-4 w-4" /> Selecionado
                </>
              ) : (
                <>
                  <Plus className="mr-1.5 h-4 w-4" /> Adicionar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
