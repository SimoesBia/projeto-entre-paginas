import { Injectable, signal } from '@angular/core';

import type { LivroResumo } from '../models/livro';

export type StatusLeitura = 'Quero ler' | 'Estou lendo' | 'Concluídos';

export interface LivroEstante extends LivroResumo {
  status: StatusLeitura;
  adicionadoEm: string;
}

const CHAVE_ESTANTE = 'entre-paginas:minha-estante';

@Injectable({ providedIn: 'root' })
export class BibliotecaService {
  private readonly livrosState = signal<LivroEstante[]>(this.carregar());
  readonly livros = this.livrosState.asReadonly();

  adicionar(livro: LivroResumo, status: StatusLeitura = 'Quero ler'): boolean {
    if (this.livrosState().some((item) => item.id === livro.id)) return false;

    this.livrosState.update((atuais) => [
      ...atuais,
      { ...livro, status, adicionadoEm: new Date().toISOString() },
    ]);
    this.salvar();
    return true;
  }

  atualizarStatus(id: string, status: StatusLeitura): void {
    this.livrosState.update((atuais) =>
      atuais.map((livro) => (livro.id === id ? { ...livro, status } : livro)),
    );
    this.salvar();
  }

  remover(id: string): void {
    this.livrosState.update((atuais) => atuais.filter((livro) => livro.id !== id));
    this.salvar();
  }

  private carregar(): LivroEstante[] {
    try {
      const dados = localStorage.getItem(CHAVE_ESTANTE);
      if (!dados) return [];
      const livros: unknown = JSON.parse(dados);
      return Array.isArray(livros) ? (livros as LivroEstante[]) : [];
    } catch {
      return [];
    }
  }

  private salvar(): void {
    try {
      localStorage.setItem(CHAVE_ESTANTE, JSON.stringify(this.livrosState()));
    } catch {
      // A estante continua disponível durante a sessão caso o navegador bloqueie o armazenamento.
    }
  }
}
