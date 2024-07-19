import { Component, inject } from '@angular/core';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { RouterOutlet } from '@angular/router';
import { LeftPanelComponent } from '../left-panel/left-panel.component';
import { UserFacade } from '../../services/user.facade';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopBarComponent, RouterOutlet, LeftPanelComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  userFacade: UserFacade = inject(UserFacade);
  user$;

  constructor() {
    this.user$ = this.userFacade.watchUser();
  }
}
