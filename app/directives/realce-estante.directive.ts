import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appRealceEstante]',
  standalone: true,
})
export class RealceEstanteDirective {
  private emDestaque = false;

  @HostBinding('style.boxShadow')
  get sombra(): string {
    return this.emDestaque ? '0 0 0 2px #8b5cf6, 0 8px 22px rgba(80, 40, 130, .12)' : 'none';
  }

  @HostBinding('style.transition')
  readonly transicao = 'box-shadow 180ms ease';

  @HostListener('mouseenter')
  destacar(): void {
    this.emDestaque = true;
  }

  @HostListener('mouseleave')
  retirarDestaque(): void {
    this.emDestaque = false;
  }
}
