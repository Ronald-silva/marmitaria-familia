
import React, { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { calculateDeliveryFee } from '../lib/mapboxService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface DeliveryFormProps {
  onFeeCalculated: (fee: number, address: string) => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ onFeeCalculated }) => {
  const [address, setAddress] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleCalculateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      toast({
        title: "Endereço obrigatório",
        description: "Por favor, digite seu endereço completo para calcular a taxa de entrega.",
        variant: "destructive"
      });
      return;
    }
    
    setIsCalculating(true);
    
    try {
      const result = await calculateDeliveryFee(address);
      
      if (result.error) {
        toast({
          title: "Erro no cálculo",
          description: result.error,
          variant: "destructive"
        });
        return;
      }
      
      // Format the success message with distance information
      const distanceInfo = result.distance 
        ? `Distância: ${result.distance} km` 
        : "Distância não disponível";
        
      toast({
        title: "Taxa de entrega calculada",
        description: `R$ ${result.fee.toFixed(2)} (${distanceInfo})`,
      });
      
      onFeeCalculated(result.fee, address);
      
    } catch (error) {
      toast({
        title: "Erro no cálculo",
        description: `Ocorreu um erro ao calcular a taxa de entrega: ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="marmita-card">
      <h3 className="text-lg font-semibold mb-3">Cálculo de Taxa de Entrega</h3>
      
      <form onSubmit={handleCalculateFee}>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-grow relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder="Digite seu endereço completo"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button 
            type="submit" 
            className="marmita-btn-primary whitespace-nowrap"
            disabled={isCalculating}
          >
            {isCalculating ? (
              "Calculando..."
            ) : (
              <>
                Calcular Taxa <ArrowRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          <p>
            Ex: Av. Washington Soares, 123, Fortaleza, CE
          </p>
          <p className="mt-1">
            O restaurante está localizado na Rua Julio Verne, 321, Parangaba, Fortaleza, CE
          </p>
        </div>
      </form>
    </div>
  );
};

export default DeliveryForm;
