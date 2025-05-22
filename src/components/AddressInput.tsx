
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AddressInputProps {
  onChange: (address: string) => void;
  value: string;
}

const AddressInput = ({ onChange, value }: AddressInputProps) => {
  return (
    <Card className="p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">Endereço de Entrega</h3>
      
      <div className="space-y-2">
        <Label htmlFor="address">Endereço completo (rua, número, bairro)</Label>
        <Input
          id="address"
          placeholder="Ex: Rua das Flores, 123, Centro"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Informe o endereço completo para entrega
        </p>
      </div>
    </Card>
  );
};

export default AddressInput;
