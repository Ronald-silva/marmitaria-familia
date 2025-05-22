
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PaymentSelectorProps {
  total: number;
  chavePix: string;
  onSelect: (method: 'pix' | 'dinheiro', troco?: { valor: number; para: number }) => void;
}

const PaymentSelector = ({ total, chavePix, onSelect }: PaymentSelectorProps) => {
  const [method, setMethod] = useState<'pix' | 'dinheiro'>('pix');
  const [valorPagamento, setValorPagamento] = useState<string>(total.toString());
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const troco = Number(valorPagamento) > total 
    ? { valor: Number(valorPagamento) - total, para: Number(valorPagamento) } 
    : undefined;

  useEffect(() => {
    onSelect(method, troco);
  }, [method, troco, onSelect]);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(chavePix);
    setCopied(true);
    toast({
      title: "Chave PIX copiada!",
      description: "A chave foi copiada para a área de transferência."
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMethodChange = (value: string) => {
    setMethod(value as 'pix' | 'dinheiro');
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permite apenas números e um ponto decimal
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setValorPagamento(value);
    }
  };

  return (
    <Card className="p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">Forma de Pagamento</h3>
      
      <RadioGroup 
        value={method}
        className="space-y-4"
        onValueChange={handleMethodChange}
      >
        <div className="border rounded-md p-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pix" id="payment-pix" />
            <Label htmlFor="payment-pix" className="font-medium">PIX</Label>
          </div>
          
          {method === 'pix' && (
            <div className="mt-4 pl-6">
              <p className="text-sm mb-2">Chave PIX:</p>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 p-2 rounded flex-1 text-sm overflow-x-auto">
                  {chavePix}
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCopyPix}
                  className="flex items-center"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Faça o pagamento e depois envie o comprovante via WhatsApp
              </p>
            </div>
          )}
        </div>

        <div className="border rounded-md p-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dinheiro" id="payment-cash" />
            <Label htmlFor="payment-cash" className="font-medium">Dinheiro</Label>
          </div>
          
          {method === 'dinheiro' && (
            <div className="mt-4 pl-6 space-y-4">
              <div>
                <Label htmlFor="valor-pagamento">Quanto vai pagar?</Label>
                <Input 
                  id="valor-pagamento"
                  type="text"
                  value={valorPagamento}
                  onChange={handleValorChange}
                  className="mt-1"
                />
              </div>
              
              {troco && troco.valor > 0 && (
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-sm font-medium">Troco:</p>
                  <p className="text-lg font-bold">R$ {troco.valor.toFixed(2)}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </RadioGroup>
    </Card>
  );
};

export default PaymentSelector;
