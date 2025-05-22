
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CardapioItem } from '@/lib/supabaseServices';

interface ProteinsSelectorProps {
  proteins: CardapioItem[];
  maxSelection: number;
  onSelect: (selected: string[]) => void;
}

const ProteinsSelector = ({ proteins, maxSelection, onSelect }: ProteinsSelectorProps) => {
  const [selectedProteins, setSelectedProteins] = useState<string[]>([]);

  const handleToggleProtein = (proteina: string) => {
    setSelectedProteins(prev => {
      // Se já está selecionada, remova
      if (prev.includes(proteina)) {
        const updated = prev.filter(p => p !== proteina);
        onSelect(updated);
        return updated;
      } 
      
      // Se não está selecionada e não excede o máximo, adicione
      if (prev.length < maxSelection) {
        const updated = [...prev, proteina];
        onSelect(updated);
        return updated;
      }
      
      // Se excede o máximo, substitua a primeira seleção
      if (maxSelection === 1) {
        const updated = [proteina];
        onSelect(updated);
        return updated;
      } else {
        const updated = [...prev.slice(1), proteina];
        onSelect(updated);
        return updated;
      }
    });
  };

  // Atualizar seleções quando o máximo mudar
  useEffect(() => {
    // Se o número máximo diminuiu, ajusta a seleção
    if (selectedProteins.length > maxSelection) {
      const adjusted = selectedProteins.slice(0, maxSelection);
      setSelectedProteins(adjusted);
      onSelect(adjusted);
    }
  }, [maxSelection, onSelect]);

  return (
    <Card className="p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-center">
        Escolha {maxSelection === 1 ? 'a proteína' : 'as proteínas'} 
        {maxSelection > 1 && <span className="text-sm ml-2">({selectedProteins.length}/{maxSelection})</span>}
      </h3>
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        {proteins.map((protein) => (
          <div 
            key={protein.id} 
            className="flex items-center space-x-2 border rounded p-2 cursor-pointer hover:bg-gray-50"
            onClick={() => handleToggleProtein(protein.nome)}
          >
            <Checkbox 
              id={`protein-${protein.id}`}
              checked={selectedProteins.includes(protein.nome)}
              onCheckedChange={() => handleToggleProtein(protein.nome)}
              disabled={!selectedProteins.includes(protein.nome) && selectedProteins.length >= maxSelection}
            />
            <Label
              htmlFor={`protein-${protein.id}`}
              className="flex-1 cursor-pointer"
            >
              {protein.nome}
            </Label>
          </div>
        ))}
      </div>
      
      {proteins.length === 0 && (
        <p className="text-center text-muted-foreground mt-4">
          Nenhuma proteína disponível
        </p>
      )}
    </Card>
  );
};

export default ProteinsSelector;
