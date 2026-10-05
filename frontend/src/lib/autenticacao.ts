"use client";

import { useSyncExternalStore } from "react";

const chaveAutenticacao = "cardapio-ete-token";
const chaveUsuario = "cardapio-ete-usuario";
const eventoAutenticacao = "cardapio-ete-alteracao-autenticacao";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(eventoAutenticacao, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(eventoAutenticacao, callback);
  };
}

function obterEstadoAutenticacao() {
  return Boolean(window.sessionStorage.getItem(chaveAutenticacao));
}

function getServerSnapshot() {
  return null;
}

export function useAutenticacaoUsuario() {
  return useSyncExternalStore(
    subscribe,
    obterEstadoAutenticacao,
    getServerSnapshot,
  );
}

export type UsuarioAutenticado = {
  id: string;
  nome: string;
  tipo: "administrador" | "cozinha" | "aluno";
};

export function obterUsuarioAutenticado(): UsuarioAutenticado | null {
  const usuario = window.sessionStorage.getItem(chaveUsuario);
  if (!usuario) return null;
  try {
    return JSON.parse(usuario) as UsuarioAutenticado;
  } catch {
    return null;
  }
}

export function autenticarUsuario(token: string, usuario: UsuarioAutenticado) {
  window.sessionStorage.setItem(chaveAutenticacao, token);
  window.sessionStorage.setItem(chaveUsuario, JSON.stringify(usuario));
  window.dispatchEvent(new Event(eventoAutenticacao));
}

export function obterTokenAutenticacao() {
  return window.sessionStorage.getItem(chaveAutenticacao);
}

export function encerrarSessaoUsuario() {
  window.sessionStorage.removeItem(chaveAutenticacao);
  window.sessionStorage.removeItem(chaveUsuario);
  window.dispatchEvent(new Event(eventoAutenticacao));
}
