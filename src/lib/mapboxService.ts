
// Constants
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoicm9uYWxkc2lsdmEiLCJhIjoiY21hYmw5Zm9nMTVqNDJrbzY3cTYycml1ZiJ9.95he3ugQzHAmN--erfh6LQ';
const RESTAURANT_ADDRESS = 'Rua Julio Verne, 321, Parangaba, Fortaleza, CE, Brasil';
const RATE_PER_KM = 1; // R$ 1 per km
const MINIMUM_FEE = 5; // R$ 5 minimum fee

// Interface for geocoding results
interface GeocodeResult {
  center: [number, number];
  place_name: string;
}

// Function to geocode an address to coordinates
export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=br`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.features?.length > 0) {
      return {
        center: data.features[0].center,
        place_name: data.features[0].place_name
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

// Function to calculate distance between two points (in km)
export async function calculateDistance(
  origin: [number, number],
  destination: [number, number]
): Promise<number | null> {
  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?access_token=${MAPBOX_ACCESS_TOKEN}`
    );
    
    if (!response.ok) {
      throw new Error(`Direction API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.routes?.length > 0) {
      // Convert distance from meters to kilometers
      return data.routes[0].distance / 1000;
    }
    
    return null;
  } catch (error) {
    console.error('Error calculating distance:', error);
    return null;
  }
}

// Main function to calculate delivery fee
export async function calculateDeliveryFee(customerAddress: string): Promise<{
  fee: number;
  distance: number | null;
  error?: string;
}> {
  try {
    // Geocode restaurant address
    const restaurantLocation = await geocodeAddress(RESTAURANT_ADDRESS);
    if (!restaurantLocation) {
      return { fee: MINIMUM_FEE, distance: null, error: 'Não foi possível localizar o endereço do restaurante.' };
    }
    
    // Geocode customer address
    const customerLocation = await geocodeAddress(customerAddress);
    if (!customerLocation) {
      return { fee: MINIMUM_FEE, distance: null, error: 'Não foi possível localizar o endereço fornecido.' };
    }
    
    // Calculate distance
    const distance = await calculateDistance(
      restaurantLocation.center,
      customerLocation.center
    );
    
    if (distance === null) {
      return { fee: MINIMUM_FEE, distance: null, error: 'Não foi possível calcular a distância.' };
    }
    
    // Calculate fee (R$1 per km, minimum R$5)
    const calculatedFee = Math.max(Math.ceil(distance * RATE_PER_KM), MINIMUM_FEE);
    
    return { fee: calculatedFee, distance: parseFloat(distance.toFixed(2)) };
  } catch (error) {
    console.error('Error calculating delivery fee:', error);
    return { 
      fee: MINIMUM_FEE, 
      distance: null, 
      error: `Erro ao calcular taxa de entrega: ${(error as Error).message}` 
    };
  }
}
