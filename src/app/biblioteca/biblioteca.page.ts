import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons } from '@ionic/angular';
import { BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';

import type { LivroResumo } from '../models/livro';
import { DestaqueMensalService } from '../services/destaque-mensal.service';
import { LivroService } from '../services/livro.service';

import { AutoresFormatadosPipe } from '../pipes/autores-formatados.pipe';

type Consulta = { tipo: 'assunto' | 'busca'; valor: string };
type Estado = { tipo: 'carregando' | 'erro' } | { tipo: 'resultado'; livros: LivroResumo[] };

@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.page.html',
  styleUrls: ['./biblioteca.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, FormsModule, AutoresFormatadosPipe, RouterLink,],
})
export class BibliotecaPage {
  private readonly destaqueMensal = inject(DestaqueMensalService);
  readonly livroDestaque = this.destaqueMensal.livro;
  readonly mensagemDestaque = signal('');

  definirDestaque(livro: LivroResumo): void {
    const persistido = this.destaqueMensal.definir(livro);
    this.mensagemDestaque.set(
      persistido
        ? `${livro.titulo} agora é o destaque da Home.`
        : `${livro.titulo} foi destacado nesta sessão. O navegador não salvou a escolha.`,
    );
  }

  private readonly livroService = inject(LivroService);
  private readonly consultas = new BehaviorSubject<Consulta>({ tipo: 'assunto', valor: 'fantasy' });

  readonly categorias = [
    { nome: 'Fantasia', assunto: 'fantasy' },
    { nome: 'Mistério', assunto: 'mystery' },
    { nome: 'Romance', assunto: 'romance' },
    { nome: 'Ficção científica', assunto: 'science_fiction' },
  ];
  readonly categoriaAtiva = signal<string | null>('fantasy');
  readonly estado = signal<Estado>({ tipo: 'carregando' });
  termo = '';

  constructor() {
    this.consultas
      .pipe(
        switchMap(({ tipo, valor }) => {
          const livros =
            tipo === 'busca' ? this.livroService.buscarLivros(valor) : this.livroService.buscarPorAssunto(valor);

          return livros.pipe(
            map((resultado): Estado => ({ tipo: 'resultado', livros: resultado })),
            startWith({ tipo: 'carregando' } satisfies Estado),
            catchError(() => of({ tipo: 'erro' } satisfies Estado)),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((estado) => this.estado.set(estado));
  }

  buscar(): void {
    const termo = this.termo.trim();
    if (termo) {
      this.categoriaAtiva.set(null);
      this.consultas.next({ tipo: 'busca', valor: termo });
    }
  }

  selecionarCategoria(assunto: string): void {
    this.termo = '';
    this.categoriaAtiva.set(assunto);
    this.consultas.next({ tipo: 'assunto', valor: assunto });
  }

  tentarNovamente(): void {
    this.consultas.next(this.consultas.value);
  }

  ocultarCapa(evento: Event): void {
    if (evento.target instanceof HTMLImageElement) {
      evento.target.hidden = true;
    }
  }
}
