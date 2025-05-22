import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface MarmitaSelectorProps {
  precoMedia: number;
  precoGrande: number;
  onSelect: (tipo: string, quantidade: number, precoUnitario: number) => void;
}

const MarmitaSelector = ({ precoMedia, precoGrande, onSelect }: MarmitaSelectorProps) => {
  const [tipoMarmita, setTipoMarmita] = useState<string>('media');
  const [quantidade, setQuantidade] = useState<number>(1);

  // Handles para comportamentos dos componentes
  const handleChangeTipo = (value: string) => {
    setTipoMarmita(value);
    onSelect(value, quantidade, value === 'media' ? precoMedia : precoGrande);
  };
  const handleChangeQuantidade = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const novaQuantidade = value === '' ? 0 : parseInt(value);
    setQuantidade(novaQuantidade);
    onSelect(tipoMarmita, novaQuantidade, tipoMarmita === 'media' ? precoMedia : precoGrande);
  };

  return (
    <Card className="p-3 sm:p-4 shadow-sm w-full bg-white/80 backdrop-blur-sm">
      <h3 className="text-base sm:text-lg font-medium mb-3 text-center text-green-800">Escolha sua marmita</h3>
      <RadioGroup 
        defaultValue="media" 
        className="grid grid-cols-2 gap-3 mb-3"
        onValueChange={handleChangeTipo}
      >
        <div className="flex flex-col items-center gap-1.5 p-2 border rounded-md hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-center">
            <RadioGroupItem value="media" id="marmita-media" className="mr-2" />
            <Label htmlFor="marmita-media" className="text-sm sm:text-base">Marmita Média</Label>
          </div>
          <span className="text-xs text-muted-foreground">1 proteína</span>
          <span className="text-sm font-medium">R$ {precoMedia.toFixed(2)}</span>
        </div>

        <div className="flex flex-col items-center gap-1.5 p-2 border rounded-md hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-center">
            <RadioGroupItem value="grande" id="marmita-grande" className="mr-2" />
            <Label htmlFor="marmita-grande" className="text-sm sm:text-base">Marmita Grande</Label>
          </div>
          <span className="text-xs text-muted-foreground">2 proteínas</span>
          <span className="text-sm font-medium">R$ {precoGrande.toFixed(2)}</span>
        </div>
      </RadioGroup>
      
      <Separator className="my-3" />
      
      <div>
        <Label htmlFor="quantidade" className="text-sm mb-1.5 block">Quantidade:</Label>
        <Input 
          id="quantidade"
          type="number" 
          min="1"
          placeholder="Digite a quantidade" 
          value={quantidade || ''} 
          onChange={handleChangeQuantidade}
          className="w-full text-sm h-9" 
        />
      </div>
    </Card>
  );
};

export default MarmitaSelector;
