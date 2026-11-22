
import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appCardInterativo]',
  standalone: true
})
export class CardInterativo {

  pressionado = false;

  @HostBinding('style.transform')
  get movimento(): string {
    return this.pressionado ? 'scale(0.90)' : 'scale(1)';
  }

  @HostBinding('style.transition')
  transicao = 'transform 0.4s ease';

  @HostListener('pointerdown')
  aoPressionar(): void {
    this.pressionado = true;
  }

  @HostListener('pointerup')
  aoSoltar(): void {
    this.pressionado = false;
  }

  @HostListener('pointercancel')
  aoCancelar(): void {
    this.pressionado = false;
  }
}
