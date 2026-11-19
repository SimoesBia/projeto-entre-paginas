import { Injectable, signal } from '@angular/core';

import type { LivroResumo } from '../models/livro';

const CHAVE = 'entre-paginas:destaque-mensal';

const LIVRO_INICIAL: LivroResumo = {
  id: 'OL66534W',
  titulo: 'Northanger Abbey',
  autores: ['Jane Austen'],
  capaUrl: 'https://covers.openlibrary.org/b/id/12567961-M.jpg',
  anoPrimeiraPublicacao: null,
};

@Injectable({ providedIn: 'root' })
export class DestaqueMensalService {
  private readonly selecionado = signal<LivroResumo>(this.carregar());
  readonly livro = this.selecionado.asReadonly();

  definir(livro: LivroResumo): boolean {
    this.selecionado.set(livro);
    try {
      localStorage.setItem(CHAVE, JSON.stringify(livro));
      return true;
    } catch {
      return false;
    }
  }

  private carregar(): LivroResumo {
    try {
      const valor = localStorage.getItem(CHAVE);
      return valor ? ((JSON.parse(valor) as LivroResumo) ?? LIVRO_INICIAL) : LIVRO_INICIAL;
    } catch {
      return LIVRO_INICIAL;
    }
  }
}
