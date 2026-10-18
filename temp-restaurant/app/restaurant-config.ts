
export type PropertyType = "restaurant" | "hotel";

export type ServiceLocation = {
  kind: "table" | "room";
  identifier: string;
  label: string;
};

export const themePresets = {
  "warm-luxury": {
    colors: {
      background: "#F7F3EB",
      surface: "#FFFEFB",
      foreground: "#292B27",
      muted: "#6C706A",
      border: "#DED8CC",
      primary: "#24483D",
      primaryHover: "#1D3D33",
      accent: "#C4A46C",
      success: "#2E6B4A",
      danger: "#A13F35",
      disabledBackground: "#EAE6DE",
      disabledText: "#62635E",
    },
    typography: {
      fontFamily: '"Aptos", "Segoe UI", "Helvetica Neue", sans-serif',
      bodySize: "16px",
      buttonSize: "15px",
    },
    buttons: {
      height: "48px",
      paddingX: "20px",
      fontWeight: "600",
      radius: "2px",
    },
  },
} as const;

export type ThemeName = keyof typeof themePresets;

export const restaurantConfig = {
  name: "The JK Restaurant",
  tagline: "RESTAURANT & KITCHEN",
  city: "Mumbai",
  branchName: "Mumbai Branch",
  address: "Mumbai, Maharashtra",
  openingStatus: "Open Now",
  openingHours: "12:00 PM – 11:00 PM",
  heroTitleLine1: "Good food.",
  heroTitleLine2: "Made with care.",
  heroDescription:
    "Take a look at our menu and find something you love.",
  heroImage:
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
  branding: {
    logoUrl: null as string | null,
    theme: "warm-luxury" as ThemeName,
  },
  property: {
    type: "restaurant" as PropertyType,
    roomServiceEnabled: false,
  },
};
