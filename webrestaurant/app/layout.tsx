
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { CartProvider } from "./CartProvider";
import GlobalLoader from "./GlobalLoader";
import { restaurantConfig, themePresets } from "./restaurant-config";

const theme = themePresets[restaurantConfig.branding.theme];
const themeStyle = {
  "--background": theme.colors.background,
  "--surface": theme.colors.surface,
  "--foreground": theme.colors.foreground,
  "--muted": theme.colors.muted,
  "--border": theme.colors.border,
  "--primary": theme.colors.primary,
  "--primary-hover": theme.colors.primaryHover,
  "--accent": theme.colors.accent,
  "--success": theme.colors.success,
  "--danger": theme.colors.danger,
  "--disabled-background": theme.colors.disabledBackground,
  "--disabled-text": theme.colors.disabledText,
  "--font-family-sans": theme.typography.fontFamily,
  "--font-size-body": theme.typography.bodySize,
  "--button-font-size": theme.typography.buttonSize,
  "--button-height": theme.buttons.height,
  "--button-padding-x": theme.buttons.paddingX,
  "--button-font-weight": theme.buttons.fontWeight,
  "--button-radius": theme.buttons.radius,
} as CSSProperties;

export const metadata: Metadata = {
  title: "Restaurant | Order Online",
  description: "Browse the menu and order your favourite food.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme={restaurantConfig.branding.theme}
      data-scroll-behavior="smooth"
    >
      <body style={themeStyle}>
        <CartProvider>
          <GlobalLoader />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
