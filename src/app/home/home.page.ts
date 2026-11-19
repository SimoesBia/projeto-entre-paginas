
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton
} from '@ionic/angular';

import { CardInterativo } from '../directives/card-interativo';
import { DestaqueDirective } from '../directives/destaque';
import { DestaqueMensalService } from '../services/destaque-mensal.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    RouterLink,
    CardInterativo,
    DestaqueDirective
  ],
})
export class HomePage {
  readonly livroDestaque = inject(DestaqueMensalService).livro;
}
