
import { supabase } from '@/integrations/supabase/client';

// Tipos para os dados do cardápio
export interface CardapioItem {
  id: string;
  tipo: 'proteina' | 'acompanhamento' | 'salada';
  nome: string;
  ativo: boolean;
}

// Tipo para configurações
export interface Configuracao {
  chave: string;
  valor: string;
}

// Função para buscar itens do cardápio por tipo
export async function fetchCardapioByTipo(tipo: string): Promise<CardapioItem[]> {
  try {
    const { data, error } = await supabase
      .from('cardapio')
      .select('*')
      .eq('tipo', tipo)
      .eq('ativo', true);
    
    if (error) {
      console.error('Erro ao buscar cardápio:', error);
      return [];
    }
    
    return data as CardapioItem[] || [];
  } catch (error) {
    console.error('Exceção ao buscar cardápio:', error);
    return [];
  }
}

// Função para buscar todas as configurações
export async function fetchConfiguracoes(): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('chave, valor');
    
    if (error) {
      console.error('Erro ao buscar configurações:', error);
      return {};
    }
    
    // Converter array de configurações para um objeto
    const configObj: Record<string, string> = {};
    if (data) {
      data.forEach(config => {
        configObj[config.chave] = config.valor;
      });
    }
    
    return configObj;
  } catch (error) {
    console.error('Exceção ao buscar configurações:', error);
    return {};
  }
}

// Função para salvar um pedido no banco
export async function savePedido(pedidoData: {
  detalhes: any;
  cliente: string;
  endereco: string;
  forma_pagamento: string;
  total: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('pedidos')
      .insert([pedidoData]);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

// Função para adicionar ou atualizar item do cardápio
export async function saveCardapioItem(item: Omit<CardapioItem, 'id'>): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const { data, error } = await supabase
      .from('cardapio')
      .insert([item])
      .select();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, id: data[0].id };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

// Função para atualizar status de um item do cardápio
export async function updateCardapioItemStatus(id: string, ativo: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('cardapio')
      .update({ ativo })
      .eq('id', id);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

// Função para remover item do cardápio
export async function removeCardapioItem(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('cardapio')
      .delete()
      .eq('id', id);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

// Função para atualizar uma configuração
export async function updateConfiguracao(chave: string, valor: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Verificar se a configuração já existe
    const { data, error: selectError } = await supabase
      .from('configuracoes')
      .select('*')
      .eq('chave', chave)
      .single();
    
    if (selectError && selectError.code !== 'PGRST116') { // Código para "no rows found"
      return { success: false, error: selectError.message };
    }
    
    if (data) {
      // Atualizar configuração existente
      const { error: updateError } = await supabase
        .from('configuracoes')
        .update({ valor })
        .eq('chave', chave);
      
      if (updateError) {
        return { success: false, error: updateError.message };
      }
    } else {
      // Inserir nova configuração
      const { error: insertError } = await supabase
        .from('configuracoes')
        .insert([{ chave, valor }]);
      
      if (insertError) {
        return { success: false, error: insertError.message };
      }
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

// Função para buscar todos os itens do cardápio
export async function fetchAllCardapio(): Promise<CardapioItem[]> {
  try {
    const { data, error } = await supabase
      .from('cardapio')
      .select('*')
      .order('tipo, nome');
    
    if (error) {
      console.error('Erro ao buscar cardápio completo:', error);
      return [];
    }
    
    return data as CardapioItem[] || [];
  } catch (error) {
    console.error('Exceção ao buscar cardápio completo:', error);
    return [];
  }
}
