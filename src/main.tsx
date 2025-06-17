
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from "@clerk/clerk-react";
import { zhCN } from "@clerk/localizations";
import App from './App.tsx'
import './index.css'

console.log("--- Clerk Localization Diagnosis ---");
console.log("Type of zhCN:", typeof zhCN);
console.log("Content of zhCN:", JSON.stringify(zhCN, null, 2));

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY}
    localization={zhCN}
  >
    <App />
  </ClerkProvider>
);
