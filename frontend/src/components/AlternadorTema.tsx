"use client";

import { Moon, Sun } from "lucide-react";
import { alternarTema, useTema } from "@/lib/tema";

export function AlternadorTema() {
  const tema = useTema();
  const ehEscuro = tema === "dark";

  return (
    <button
      type="button"
      onClick={alternarTema}
      className="inline-flex items-center justify-center size-9 border border-borda bg-superficie text-texto-principal transition hover:cursor-pointer hover:bg-borda/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaria"
      aria-label={ehEscuro ? "Alternar para tema claro" : "Alternar para tema escuro"}
      title={ehEscuro ? "Alternar para tema claro" : "Alternar para tema escuro"}
    >
      {ehEscuro ? (
        <Sun size={18} className="text-atencao" aria-hidden="true" />
      ) : (
        <Moon size={18} className="text-primaria" aria-hidden="true" />
      )}
    </button>
  );
}

