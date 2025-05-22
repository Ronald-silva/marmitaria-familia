
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface OrderSummaryProps {
  tipoMarmita: string;
  quantidade: number;
  precoMarmita: number;
  proteinas: string[];
  acompanhamentos: string[];
  saladas: string[];
  agua: boolean;
  precoAgua: number;
  formaPagamento: 'pix' | 'dinheiro';
  troco?: {
    valor: number;
    para: number;
  };
  endereco: string;
  taxaEntrega: number;
  telefoneWhatsapp: string;
  onSubmit: () => void;
  isFormValid: boolean;
}

const OrderSummary = ({
  tipoMarmita,
  quantidade,
  precoMarmita,
  proteinas,
  acompanhamentos,
  saladas,
  agua,
  precoAgua,
  formaPagamento,
  troco,
  endereco,
  taxaEntrega,
  telefoneWhatsapp,
  onSubmit,
  isFormValid
}: OrderSummaryProps) => {
  const subtotal = (precoMarmita * quantidade) + (agua ? precoAgua : 0);
  const total = subtotal + taxaEntrega;
  
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-center mb-4">Resumo do Pedido</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Marmita {tipoMarmita === 'media' ? 'Média' : 'Grande'} x{quantidade}</h3>
            <p className="text-sm text-gray-600">R$ {precoMarmita.toFixed(2)} x {quantidade} = R$ {(precoMarmita * quantidade).toFixed(2)}</p>
          </div>
          
          <div>
            <h4 className="font-medium">Proteínas:</h4>
            {proteinas.length > 0 ? (
              <ul className="list-disc list-inside text-sm">
                {proteinas.map((proteina, index) => (
                  <li key={index}>{proteina}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-red-500">Selecione as proteínas</p>
            )}
          </div>
          
          <div>
            <h4 className="font-medium">Acompanhamentos:</h4>
            {acompanhamentos.length > 0 ? (
              <ul className="list-disc list-inside text-sm">
                {acompanhamentos.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Nenhum selecionado</p>
            )}
          </div>
          
          <div>
            <h4 className="font-medium">Saladas:</h4>
            {saladas.length > 0 ? (
              <ul className="list-disc list-inside text-sm">
                {saladas.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Nenhuma selecionada</p>
            )}
          </div>
          
          {agua && (
            <div>
              <h4 className="font-medium">Galão de Água:</h4>
              <p className="text-sm">R$ {precoAgua.toFixed(2)}</p>
            </div>
          )}
          
          <Separator />
          
          <div>
            <h4 className="font-medium">Forma de pagamento:</h4>
            <p className="text-sm">{formaPagamento === 'pix' ? 'PIX' : 'Dinheiro'}</p>
            {formaPagamento === 'dinheiro' && troco && troco.valor > 0 && (
              <p className="text-sm">Troco para R$ {troco.para.toFixed(2)}: R$ {troco.valor.toFixed(2)}</p>
            )}
          </div>
          
          <div>
            <h4 className="font-medium">Endereço:</h4>
            {endereco ? (
              <p className="text-sm">{endereco}</p>
            ) : (
              <p className="text-sm text-red-500">Informe o endereço</p>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de entrega:</span>
              <span>R$ {taxaEntrega.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
          onClick={onSubmit}
          disabled={!isFormValid}
        >
          <MessageSquare className="h-5 w-5" />
          Enviar Pedido pelo WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;
