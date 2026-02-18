
export interface TransportInfo {
  mode: 'Flight' | 'Train' | 'Subway' | 'Walk' | 'Bus' | 'Taxi' | 'Rapit' | 'Haruka';
  detail: string;
  duration: string;
  note?: string;
}

export interface Flight {
  id: string;
  type: 'Outbound' | 'Inbound';
  airline: string;
  flightNo: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  terminal: string;
  seat?: string;
}

export interface ScheduleItem {
  id: string;
  time?: string;
  title: string;
  duration?: string;
  location?: string;
  description?: string;
  note?: string;
  photo?: string;
  transportAfter?: TransportInfo;
  isOptional?: boolean;
}

export interface WeatherData {
  tempRange: string;
  condition: string;
  clothing: string;
  tips: string[];
}

export interface DayItinerary {
  id: number;
  date: string;
  title: string;
  location: 'Kyoto' | 'Osaka';
  hotel?: string;
  weather: WeatherData;
  items: ScheduleItem[];
}

export interface Coupon {
  id: string;
  title: string;
  description: string;
  url: string;
  expiryDate?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  brand: string;
  type: string;
  photo?: string;
  isBought: boolean;
  note?: string;
}

export interface Accommodation {
  id: string;
  name: string;
  nameJp: string;
  address: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  price: string;
  amenities: string[];
  notes: string[];
  intro: string;
  gps: { lat: string; lng: string };
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  amountJpy: number;
  amountTwd: number;
  description: string;
}
