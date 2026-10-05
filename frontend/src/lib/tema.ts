"use client";

import { useSyncExternalStore } from "react";

export type Tema = "dark" | "light";

const chaveTema = "cardapio-ete-tema";
const eventoTema = "cardapio-ete-alteracao-tema";

function obterTemaDoNavegador(): Tema {
  if (typeof window === "undefined") return "dark";
  const temaSalvo = window.localStorage.getItem(chaveTema);
  if (temaSalvo === "light" || temaSalvo === "dark") {
    return temaSalvo;
  }
  return "dark";
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === chaveTema) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(eventoTema, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(eventoTema, callback);
  };
}

function getServerSnapshot(): Tema {
  return "dark";
}

export function useTema(): Tema {
  return useSyncExternalStore(subscribe, obterTemaDoNavegador, getServerSnapshot);
}

export function definirTema(novoTema: Tema) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(chaveTema, novoTema);
  document.documentElement.setAttribute("data-theme", novoTema);
  window.dispatchEvent(new Event(eventoTema));
}

export function alternarTema() {
  const temaAtual = obterTemaDoNavegador();
  const proximoTema: Tema = temaAtual === "dark" ? "light" : "dark";
  definirTema(proximoTema);
}

