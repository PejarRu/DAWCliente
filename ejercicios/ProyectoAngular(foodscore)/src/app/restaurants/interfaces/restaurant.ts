export interface Restaurant {
  id?: number;
  name: string;
  description: string;
  cuisine: string;
  daysOpen: string[];
  image: string;
  phone: string;
  creator?: number;
  mine?: boolean;
  distance?: number;
  commented?: boolean;
  stars?: number;
  address: string;
  lat: number;
  lng: number;
}
