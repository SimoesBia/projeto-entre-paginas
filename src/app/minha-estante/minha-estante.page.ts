import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { RealceEstanteDirective } from '../directives/realce-estante.directive';
import { StatusLeituraDirective } from '../directives/status-leitura.directive';
import type { LivroResumo } from '../models/livro';
import { BibliotecaService, type StatusLeitura } from '../services/biblioteca.service';

import { DatePipe, UpperCasePipe } from '@angular/common';
import { AutoresFormatadosPipe } from '../pipes/autores-formatados.pipe';

@Component({
  selector: 'app-minha-estante',
  templateUrl: './minha-estante.page.html',
  styleUrls: ['./minha-estante.page.scss'],
  imports: [
    FormsModule,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    RealceEstanteDirective,
    StatusLeituraDirective,
    DatePipe,
    UpperCasePipe,
    AutoresFormatadosPipe,
  ],
})
export class MinhaEstantePage {
  private readonly biblioteca = inject(BibliotecaService);
  readonly livros = this.biblioteca.livros;
  readonly statusDisponiveis: StatusLeitura[] = ['Quero ler', 'Estou lendo', 'Concluídos'];

  titulo = '';
  autor = '';
  statusNovo: StatusLeitura = 'Quero ler';
  mensagem = '';

  livrosPorStatus(status: StatusLeitura) {
    return this.livros().filter((livro) => livro.status === status);
  }

  adicionarLivro(): void {
    const titulo = this.titulo.trim();
    if (!titulo) {
      this.mensagem = 'Informe o título do livro para adicionar.';
      return;
    }

    const novoLivro: LivroResumo = {
      id: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      titulo,
      autores: this.autor.trim() ? [this.autor.trim()] : [],
      capaUrl: null,
      anoPrimeiraPublicacao: null,
    };

    this.mensagem = this.biblioteca.adicionar(novoLivro, this.statusNovo)
      ? `${titulo} foi adicionado à sua estante!`
      : 'Esse livro já está na sua estante.';

    if (this.mensagem.includes('adicionado')) {
      this.titulo = '';
      this.autor = '';
      this.statusNovo = 'Quero ler';
    }
  }

  atualizarStatus(id: string, status: StatusLeitura): void {
    this.biblioteca.atualizarStatus(id, status);
  }

  removerLivro(id: string): void {
    this.biblioteca.remover(id);
    this.mensagem = 'Livro removido da sua estante.';
  }
}
