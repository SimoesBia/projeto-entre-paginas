export interface LivroResumo {
  id: string;
  titulo: string;
  autores: string[];
  capaUrl: string | null;
  anoPrimeiraPublicacao: number | null;
}

export interface LivroDetalhes {
  id: string;
  titulo: string;
  sinopse: string | null;
  capaUrl: string | null;
  assuntos: string[];
}
