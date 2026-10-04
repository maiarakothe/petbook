import type { Metadata } from "next";
import "./globals.css";
import HeaderConditional from "@/components/Header/HeaderConditional";
import { SnackbarProvider } from "@/components/Feedback/SnackbarProvider";

export const metadata: Metadata = {
  title: "PetBook",
  description: "Uma rede social para pets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <SnackbarProvider>
          <HeaderConditional />
          {children}
        </SnackbarProvider>
      </body>
    </html>
  );
}