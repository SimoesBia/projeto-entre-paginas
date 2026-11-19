
import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDestaque]',
  standalone: true
})
export class DestaqueDirective {

  @HostBinding('style.border')
  borda = '2px solid #3b1865';

  @HostBinding('style.boxShadow')
  sombra = '0 5px 15px rgba(167, 206, 210, 0.2)';
}
