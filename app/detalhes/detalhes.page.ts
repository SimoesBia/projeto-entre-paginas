import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

import type { LivroDetalhes } from '../models/livro';
import { LivroService } from '../services/livro.service';

type EstadoDetalhes =
  | { tipo: 'carregando' }
  | { tipo: 'erro' }
  | { tipo: 'resultado'; livro: LivroDetalhes };

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons],
})
export class DetalhesPage {
  private readonly rota = inject(ActivatedRoute);
  private readonly livroService = inject(LivroService);

  readonly estado = signal<EstadoDetalhes>({ tipo: 'carregando' });

  constructor() {
    this.rota.paramMap
      .pipe(
        switchMap((parametros) => {
          const id = parametros.get('id');

          if (!id) {
            return of({ tipo: 'erro' } satisfies EstadoDetalhes);
          }

          return this.livroService.obterDetalhes(id).pipe(
            map((livro): EstadoDetalhes => ({ tipo: 'resultado', livro })),
            startWith({ tipo: 'carregando' } satisfies EstadoDetalhes),
            catchError(() => of({ tipo: 'erro' } satisfies EstadoDetalhes)),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((estado) => this.estado.set(estado));
  }

  ocultarCapa(evento: Event): void {
    if (evento.target instanceof HTMLImageElement) {
      evento.target.hidden = true;
    }
  }
}
