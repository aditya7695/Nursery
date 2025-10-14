export interface Plant {
  _id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  careInstructions?: string;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  AdminPanel: undefined;
  PlantDetails: { plant: Plant };
  Favorites: undefined;
  History: undefined;
  Following: undefined;
};

export type TabParamList = {
  Home: undefined;
  Categories: undefined;
  Cart: undefined;
  Alerts: undefined;
  Profile: undefined;
};