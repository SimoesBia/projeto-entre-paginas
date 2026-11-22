import { Directive, HostBinding, input } from '@angular/core';

import type { StatusLeitura } from '../services/biblioteca.service';

@Directive({
  selector: '[appStatusLeitura]',
  standalone: true,
})
export class StatusLeituraDirective {
  readonly appStatusLeitura = input<StatusLeitura>('Quero ler');

  @HostBinding('style.borderLeft')
  get bordaStatus(): string {
    const cores: Record<StatusLeitura, string> = {
      'Quero ler': '#8b5cf6',
      'Estou lendo': '#0d9488',
      Concluídos: '#16a34a',
    };
    return `5px solid ${cores[this.appStatusLeitura()]}`;
  }

  @HostBinding('style.backgroundColor')
  get fundoStatus(): string {
    const fundos: Record<StatusLeitura, string> = {
      'Quero ler': '#f5f0ff',
      'Estou lendo': '#e8f7f5',
      Concluídos: '#edf8ef',
    };
    return fundos[this.appStatusLeitura()];
  }
}
