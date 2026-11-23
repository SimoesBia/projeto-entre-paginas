import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resumoSinopse',
  standalone: true,
})
export class ResumoSinopsePipe implements PipeTransform {
  transform(sinopse?: string | null, limite: number = 220): string {
    if (!sinopse || sinopse.trim() === '') {
      return 'Sinopse não disponível.';
    }

    const textoLimpo = sinopse
      .replace(/<[^>]*>/g, ' ')
      .replace(/\[\d+\]:\s*https?:\/\/\S+/g, '')
      .replace(/-{3,}/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (textoLimpo.length <= limite) {
      return textoLimpo;
    }

    return textoLimpo.substring(0, limite).trim() + '...';
  }
}