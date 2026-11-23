import { Component, computed, inject, signal } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';

import { DestaqueMensalService } from '../services/destaque-mensal.service';

interface Desafio {
  id: number;
  titulo: string;
  descricao: string;
  meta: string;
  concluido: boolean;
}

@Component({
  selector: 'app-clube',
  templateUrl: './clube.page.html',
  styleUrls: ['./clube.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons],
})
export class ClubePage {
  private readonly destaqueMensal = inject(DestaqueMensalService);
  readonly livroDoMes = this.destaqueMensal.livro;

  readonly desafios = signal<Desafio[]>([
    {
      id: 1,
      titulo: 'Comece uma nova leitura',
      descricao: 'Escolha um livro da biblioteca e dê o primeiro passo.',
      meta: 'Meta: iniciar 1 livro',
      concluido: false,
    },
    {
      id: 2,
      titulo: 'Reserve um momento para ler',
      descricao: 'Separe alguns minutos do seu dia para aproveitar a leitura.',
      meta: 'Meta: ler por 20 minutos',
      concluido: false,
    },
    {
      id: 3,
      titulo: 'Compartilhe sua experiência',
      descricao: 'Converse com alguém sobre uma história que você gostou.',
      meta: 'Meta: compartilhar 1 indicação',
      concluido: false,
    },
  ]);

  readonly totalConcluidos = computed(() => this.desafios().filter((desafio) => desafio.concluido).length);
  readonly porcentagemConcluida = computed(() =>
    this.desafios().length ? (this.totalConcluidos() / this.desafios().length) * 100 : 0,
  );
  readonly porcentagemTexto = computed(() => Math.round(this.porcentagemConcluida()));

  alternarDesafio(id: number): void {
    this.desafios.update((lista) =>
      lista.map((desafio) =>
        desafio.id === id ? { ...desafio, concluido: !desafio.concluido } : desafio,
      ),
    );
  }
}
