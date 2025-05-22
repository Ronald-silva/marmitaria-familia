
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface WaterOptionProps {
  precoAgua: number;
  onToggle: (selected: boolean, preco: number) => void;
}

const WaterOption = ({ precoAgua, onToggle }: WaterOptionProps) => {
  const [selected, setSelected] = useState(false);

  const handleToggle = (checked: boolean) => {
    setSelected(checked);
    onToggle(checked, precoAgua);
  };

  return (
    <Card className="p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="add-water"
            checked={selected}
            onCheckedChange={(checked) => handleToggle(!!checked)}
          />
          <Label htmlFor="add-water" className="font-medium cursor-pointer">
            Adicionar Galão de Água 25L
          </Label>
        </div>
        <span className="font-semibold">+ R$ {precoAgua.toFixed(2)}</span>
      </div>
    </Card>
  );
};

export default WaterOption;
