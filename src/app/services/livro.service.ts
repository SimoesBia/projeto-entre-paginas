import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';

import type { LivroDetalhes, LivroResumo } from '../models/livro';

interface Obra {
  key: string;
  title: string;
  first_publish_year?: number;
}

interface ResultadoBusca extends Obra {
  author_name?: string[];
  cover_i?: number;
}

interface ResultadoAssunto extends Obra {
  authors?: { name: string }[];
  cover_id?: number;
}

interface DetalhesObra {
  title: string;
  description?: string | { value: string };
  covers?: number[];
  subjects?: string[];
}

@Injectable({ providedIn: 'root' })
export class LivroService {
  private readonly http = inject(HttpClient);
  private readonly api = 'https://openlibrary.org';

  buscarLivros(termo: string): Observable<LivroResumo[]> {
    return this.http
      .get<{ docs: ResultadoBusca[] }>(`${this.api}/search.json`, {
        params: {
          q: termo.trim(),
          fields: 'key,title,author_name,cover_i,first_publish_year',
          limit: 20,
        },
      })
      .pipe(map(({ docs }) => docs.map((obra) => this.resumir(obra, obra.author_name ?? [], obra.cover_i))));
  }

  buscarPorAssunto(assunto: string): Observable<LivroResumo[]> {
    return this.http
      .get<{ works: ResultadoAssunto[] }>(`${this.api}/subjects/${encodeURIComponent(assunto)}.json`, {
        params: { limit: 20 },
      })
      .pipe(
        map(({ works }) =>
          works.map((obra) => this.resumir(obra, obra.authors?.map((autor) => autor.name) ?? [], obra.cover_id)),
        ),
      );
  }

  obterDetalhes(id: string): Observable<LivroDetalhes> {
    return this.http.get<DetalhesObra>(`${this.api}/works/${encodeURIComponent(id)}.json`).pipe(
      map((obra) => ({
        id,
        titulo: obra.title,
        sinopse: (typeof obra.description === 'string' ? obra.description : obra.description?.value) ?? null,
        capaUrl: this.urlCapa(
          obra.covers?.find((capa) => capa > 0),
          'L',
        ),
        assuntos: obra.subjects ?? [],
      })),
    );
  }

  private resumir(obra: Obra, autores: string[], capa?: number): LivroResumo {
    return {
      id: obra.key.replace(/^\/works\//, ''),
      titulo: obra.title,
      autores,
      capaUrl: this.urlCapa(capa, 'M'),
      anoPrimeiraPublicacao: obra.first_publish_year ?? null,
    };
  }

  private urlCapa(id: number | undefined, tamanho: 'M' | 'L'): string | null {
    return id && id > 0 ? `https://covers.openlibrary.org/b/id/${id}-${tamanho}.jpg?default=false` : null;
  }
}
