
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

  const handleChangeTipo = (value: string) => {
    setTipoMarmita(value);
    onSelect(value, quantidade, value === 'media' ? precoMedia : precoGrande);
  };

  const handleChangeQuantidade = (event: React.ChangeEvent<HTMLInputElement>) => {
    const novaQuantidade = parseInt(event.target.value) || 1;
    setQuantidade(novaQuantidade);
    onSelect(tipoMarmita, novaQuantidade, tipoMarmita === 'media' ? precoMedia : precoGrande);
  };

  return (
    <Card className="p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">Escolha sua marmita</h3>
      
      <RadioGroup 
        defaultValue="media" 
        className="grid grid-cols-2 gap-4 mb-4"
        onValueChange={handleChangeTipo}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center">
            <RadioGroupItem value="media" id="marmita-media" />
            <Label htmlFor="marmita-media" className="ml-2">Marmita Média</Label>
          </div>
          <span className="text-sm text-muted-foreground">1 proteína</span>
          <span className="font-semibold">R$ {precoMedia.toFixed(2)}</span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center">
            <RadioGroupItem value="grande" id="marmita-grande" />
            <Label htmlFor="marmita-grande" className="ml-2">Marmita Grande</Label>
          </div>
          <span className="text-sm text-muted-foreground">2 proteínas</span>
          <span className="font-semibold">R$ {precoGrande.toFixed(2)}</span>
        </div>
      </RadioGroup>
      
      <Separator className="my-4" />
      
      <div className="mt-4">
        <Label htmlFor="quantidade" className="block mb-2">Quantidade:</Label>
        <Input 
          id="quantidade"
          type="number" 
          min="1" 
          value={quantidade} 
          onChange={handleChangeQuantidade}
          className="w-full" 
        />
      </div>
    </Card>
  );
};

export default MarmitaSelector;
