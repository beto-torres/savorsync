"use client";

import { useState } from "react";
import { QrCode, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const enderecoAcessoCelular = "http://10.206.119.240:3000";

export function AcessoQrCode({ compacto = false }: { compacto?: boolean }) {
  const [aberto, definirAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => definirAberto(true)}
        className={compacto
          ? "inline-flex items-center justify-center gap-2 border border-borda bg-superficie px-2 py-2 text-sm font-semibold text-texto-principal transition hover:cursor-pointer hover:bg-borda/30 sm:px-3"
          : "inline-flex items-center justify-center gap-2 border border-borda bg-superficie px-1 py-2 text-xs font-bold text-texto-principal transition hover:cursor-pointer hover:bg-borda/30 sm:px-3 sm:text-sm"}
        aria-label="Exibir QR Code para acesso pelo celular"
        title="Acessar pelo celular"
      >
        <QrCode size={17} aria-hidden="true" />
        <span className="hidden lg:inline">Acessar no celular</span>
        {!compacto && <span className="lg:hidden">QR Code</span>}
      </button>

      {aberto && (
        <div
          onClick={() => definirAberto(false)}
          className="fixed inset-0 z-30 grid place-items-center bg-black/70 p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qrcode-title"
        >
          <section
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-sm border border-borda bg-superficie p-6 text-center shadow-2xl"
          >
            <button
              type="button"
              onClick={() => definirAberto(false)}
              className="absolute right-3 top-3 grid size-9 place-items-center text-texto-secundario transition hover:text-texto-principal"
              aria-label="Fechar QR Code"
            >
              <X size={20} aria-hidden="true" />
            </button>

            <p className="text-xs font-bold tracking-[0.16em] text-secundaria">ACESSO PELO CELULAR</p>
            <h2 id="qrcode-title" className="mt-2 text-2xl font-semibold text-texto-principal">Escaneie para abrir</h2>
            <p className="mt-2 text-sm leading-6 text-texto-secundario">Conecte o celular à mesma rede do computador e aponte a câmera para o código.</p>

            <div className="mx-auto mt-6 w-fit bg-white p-2">
              <QRCodeSVG
                value={enderecoAcessoCelular}
                size={220}
                level="H"
                marginSize={4}
                title="QR Code para acessar o SavorSync pelo celular"
              />
            </div>

            <a
              href={enderecoAcessoCelular}
              target="_blank"
              rel="noreferrer"
              className="mt-5 block break-all text-sm font-semibold text-secundaria underline-offset-4 hover:underline"
            >
              {enderecoAcessoCelular}
            </a>
          </section>
        </div>
      )}
    </>
  );
}
