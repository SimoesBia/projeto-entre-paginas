import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'autoresFormatados',
  standalone: true,
})
export class AutoresFormatadosPipe implements PipeTransform {
  transform(autores?: string[] | null, limite: number = 2): string {
    if (!autores || autores.length === 0) {
      return 'Autor não informado';
    }

    const exibidos = autores.slice(0, limite).join(', ');
    const restantes = autores.length - limite;

    return restantes > 0 ? `${exibidos} e mais ${restantes}` : exibidos;
  }
}