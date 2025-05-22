
import { supabase } from '@/integrations/supabase/client';

// Tipos para os dados de menu
export interface MenuItem {
  id?: string;
  type: string;
  price: number;
  proteins?: string[];
  salads?: string[];
  sides?: string[];
  available?: boolean;
}

export interface MenuData {
  id?: string;
  date: string;
  items: MenuItem[];
}

// Menu padrão quando não há dados disponíveis para hoje
export const defaultMenu: MenuData = {
  date: new Date().toISOString().split('T')[0],
  items: [
    {
      type: "Marmita Grande",
      price: 14,
      proteins: ["Frango", "Carne"],
      salads: ["Alface", "Tomate"],
      sides: ["Arroz", "Feijão"]
    },
    {
      type: "Marmita Média",
      price: 12,
      proteins: ["Frango"],
      salads: ["Alface"],
      sides: ["Arroz", "Feijão"]
    },
    {
      type: "Galão de Água 25L",
      price: 5,
      available: true
    }
  ]
};

// Função para buscar menu para uma data específica
export async function fetchMenuByDate(date: string): Promise<MenuData> {
  try {
    // Buscar o menu pela data
    const { data: menuData, error: menuError } = await supabase
      .from('menus')
      .select('id, date')
      .eq('date', date)
      .single();
    
    if (menuError) {
      console.error('Erro ao buscar menu:', menuError);
      return {
        ...defaultMenu,
        date
      };
    }
    
    if (!menuData) {
      return {
        ...defaultMenu,
        date
      };
    }
    
    // Buscar os itens do menu
    const { data: menuItems, error: itemsError } = await supabase
      .from('menu_items')
      .select('id, type, price, available')
      .eq('menu_id', menuData.id);
      
    if (itemsError) {
      console.error('Erro ao buscar itens do menu:', itemsError);
      return {
        ...defaultMenu,
        date
      };
    }
    
    // Para cada item, buscar proteínas, saladas e acompanhamentos
    const itemsWithDetails = await Promise.all(menuItems.map(async (item) => {
      // Buscar proteínas
      const { data: proteins, error: proteinsError } = await supabase
        .from('menu_item_proteins')
        .select('name')
        .eq('menu_item_id', item.id);
        
      if (proteinsError) {
        console.error(`Erro ao buscar proteínas para item ${item.id}:`, proteinsError);
      }
      
      // Buscar saladas
      const { data: salads, error: saladsError } = await supabase
        .from('menu_item_salads')
        .select('name')
        .eq('menu_item_id', item.id);
        
      if (saladsError) {
        console.error(`Erro ao buscar saladas para item ${item.id}:`, saladsError);
      }
      
      // Buscar acompanhamentos
      const { data: sides, error: sidesError } = await supabase
        .from('menu_item_sides')
        .select('name')
        .eq('menu_item_id', item.id);
        
      if (sidesError) {
        console.error(`Erro ao buscar acompanhamentos para item ${item.id}:`, sidesError);
      }
      
      // Transformar os arrays para o formato esperado
      const proteinsArray = proteins ? proteins.map(p => p.name) : undefined;
      const saladsArray = salads ? salads.map(s => s.name) : undefined;
      const sidesArray = sides ? sides.map(s => s.name) : undefined;
      
      return {
        id: item.id,
        type: item.type,
        price: item.price,
        available: item.available,
        proteins: proteinsArray,
        salads: saladsArray,
        sides: sidesArray
      };
    }));
    
    return {
      id: menuData.id,
      date: menuData.date,
      items: itemsWithDetails
    };
  } catch (error) {
    console.error('Exceção ao buscar menu:', error);
    return {
      ...defaultMenu,
      date
    };
  }
}

// Função para salvar menu para uma data específica
export async function saveMenu(menu: MenuData): Promise<{ success: boolean; message: string }> {
  try {
    let menuId = menu.id;
    
    // Se não tiver ID, verificar se já existe menu para esta data
    if (!menuId) {
      const { data: existingMenu } = await supabase
        .from('menus')
        .select('id')
        .eq('date', menu.date)
        .single();
        
      if (existingMenu) {
        menuId = existingMenu.id;
      }
    }
    
    // Criar novo menu ou atualizar existente
    if (menuId) {
      // Atualizar menu existente
      await supabase
        .from('menus')
        .update({ date: menu.date })
        .eq('id', menuId);
    } else {
      // Criar novo menu
      const { data: newMenu, error: menuError } = await supabase
        .from('menus')
        .insert({ date: menu.date })
        .select('id')
        .single();
        
      if (menuError) {
        throw menuError;
      }
      
      menuId = newMenu.id;
    }
    
    // Remover todos os itens e componentes antigos do menu
    const { error: deleteItemsError } = await supabase
      .from('menu_items')
      .delete()
      .eq('menu_id', menuId);
      
    if (deleteItemsError) {
      throw deleteItemsError;
    }
    
    // Adicionar novos itens do menu
    for (const item of menu.items) {
      const { data: newItem, error: itemError } = await supabase
        .from('menu_items')
        .insert({
          menu_id: menuId,
          type: item.type,
          price: item.price,
          available: item.available ?? true
        })
        .select('id')
        .single();
        
      if (itemError) {
        throw itemError;
      }
      
      const itemId = newItem.id;
      
      // Adicionar proteínas
      if (item.proteins && item.proteins.length > 0) {
        const proteinsToInsert = item.proteins.map(name => ({
          menu_item_id: itemId,
          name
        }));
        
        const { error: proteinsError } = await supabase
          .from('menu_item_proteins')
          .insert(proteinsToInsert);
          
        if (proteinsError) {
          throw proteinsError;
        }
      }
      
      // Adicionar saladas
      if (item.salads && item.salads.length > 0) {
        const saladsToInsert = item.salads.map(name => ({
          menu_item_id: itemId,
          name
        }));
        
        const { error: saladsError } = await supabase
          .from('menu_item_salads')
          .insert(saladsToInsert);
          
        if (saladsError) {
          throw saladsError;
        }
      }
      
      // Adicionar acompanhamentos
      if (item.sides && item.sides.length > 0) {
        const sidesToInsert = item.sides.map(name => ({
          menu_item_id: itemId,
          name
        }));
        
        const { error: sidesError } = await supabase
          .from('menu_item_sides')
          .insert(sidesToInsert);
          
        if (sidesError) {
          throw sidesError;
        }
      }
    }
    
    return { success: true, message: 'Menu salvo com sucesso!' };
  } catch (error) {
    console.error('Erro ao salvar menu:', error);
    return { 
      success: false, 
      message: `Erro ao salvar menu: ${(error as Error).message}` 
    };
  }
}

// Função para remover menu por data (útil para administração)
export async function removeMenuByDate(date: string): Promise<{ success: boolean; message: string }> {
  try {
    const { data: menuData, error: findError } = await supabase
      .from('menus')
      .select('id')
      .eq('date', date)
      .single();
      
    if (findError) {
      throw findError;
    }
    
    if (!menuData) {
      return { success: false, message: 'Menu não encontrado para esta data.' };
    }
    
    const { error: deleteError } = await supabase
      .from('menus')
      .delete()
      .eq('id', menuData.id);
      
    if (deleteError) {
      throw deleteError;
    }

    return { success: true, message: 'Menu removido com sucesso!' };
  } catch (error) {
    console.error('Erro ao remover menu:', error);
    return { 
      success: false, 
      message: `Erro ao remover menu: ${(error as Error).message}` 
    };
  }
}

// Função para listar todos os menus (útil para administração)
export async function listAllMenus(): Promise<MenuData[]> {
  try {
    const { data: menus, error: menusError } = await supabase
      .from('menus')
      .select('id, date')
      .order('date', { ascending: false });
      
    if (menusError) {
      throw menusError;
    }
    
    if (!menus || menus.length === 0) {
      return [];
    }
    
    const menusWithItems = await Promise.all(menus.map(async (menu) => {
      try {
        return await fetchMenuByDate(menu.date);
      } catch (error) {
        console.error(`Erro ao buscar detalhes do menu ${menu.id}:`, error);
        return {
          id: menu.id,
          date: menu.date,
          items: []
        };
      }
    }));
    
    return menusWithItems;
  } catch (error) {
    console.error('Erro ao listar menus:', error);
    return [];
  }
}
