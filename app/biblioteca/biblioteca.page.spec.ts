import type { HttpRequest } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { LivroService } from '../services/livro.service';

import { BibliotecaPage } from './biblioteca.page';

describe('BibliotecaPage', () => {
  let component: BibliotecaPage;
  let fixture: ComponentFixture<BibliotecaPage>;

  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(BibliotecaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    http.expectOne('https://openlibrary.org/subjects/fantasy.json?limit=20').flush({
      works: [{ key: '/works/OL66534W', title: 'Livro de teste' }],
    });
  });

  afterEach(() => http.verify());

  it('mostra os livros da categoria inicial', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Livro de teste');
  });

  it('salva o livro escolhido na Biblioteca como destaque', () => {
    const chave = 'entre-paginas:destaque-mensal';
    try {
      fixture.detectChanges();
      component.termo = 'Jane Austen';
      component.buscar();
      http
        .expectOne((requisicao) => requisicao.url.endsWith('/search.json'))
        .flush({
          docs: [{ key: '/works/OL123W', title: 'Emma', author_name: ['Jane Austen'] }],
        });
      fixture.detectChanges();

      const botao: HTMLButtonElement = fixture.nativeElement.querySelector('.botao-destaque');
      botao.click();
      fixture.detectChanges();

      expect(component.livroDestaque().titulo).toBe('Emma');
      expect(botao.disabled).toBe(true);
      expect(localStorage.getItem(chave)).toContain('OL123W');
    } finally {
      localStorage.removeItem(chave);
    }
  });

  it('trata erro na busca e permite repetir a consulta', () => {
    component.termo = 'Jane Austen';
    component.buscar();
    expect(component.estado().tipo).toBe('carregando');
    const busca = (requisicao: HttpRequest<unknown>) =>
      requisicao.url === 'https://openlibrary.org/search.json' && requisicao.params.get('q') === 'Jane Austen';
    http.expectOne(busca).flush(null, { status: 503, statusText: 'Service Unavailable' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Tentar de novo');

    component.tentarNovamente();
    http.expectOne(busca).flush({ docs: [] });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Nenhum livro encontrado');
  });

  it('consulta detalhes usando o identificador obtido na categoria', () => {
    TestBed.inject(LivroService)
      .obterDetalhes('OL66534W')
      .subscribe((livro) => {
        expect(livro.sinopse).toBe('Sinopse da obra');
      });
    http.expectOne('https://openlibrary.org/works/OL66534W.json').flush({
      title: 'Livro de teste',
      description: { value: 'Sinopse da obra' },
    });
  });
});
