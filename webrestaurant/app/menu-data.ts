
export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  available: boolean;
  image: string;
};

export const categories = [
  "All",
  "Starters",
  "Main Course",
  "Breads",
  "Drinks",
];

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Paneer Tikka",
    description: "Chargrilled paneer with Indian spices.",
    price: 280,
    category: "Starters",
    isVeg: true,
    available: true,
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    name: "Chicken Tikka",
    description: "Smoky chicken with a traditional marinade.",
    price: 340,
    category: "Starters",
    isVeg: false,
    available: true,
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    name: "Butter Chicken",
    description: "Chicken in a creamy tomato gravy.",
    price: 420,
    category: "Main Course",
    isVeg: false,
    available: true,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    name: "Paneer Butter Masala",
    description: "Paneer in a rich tomato and butter gravy.",
    price: 320,
    category: "Main Course",
    isVeg: true,
    available: true,
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 5,
    name: "Butter Naan",
    description: "Freshly baked naan finished with butter.",
    price: 55,
    category: "Breads",
    isVeg: true,
    available: true,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 6,
    name: "Fresh Lime Soda",
    description: "Fresh lime and chilled soda.",
    price: 100,
    category: "Drinks",
    isVeg: true,
    available: true,
    image:
  "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=700&q=85",
  },
];
