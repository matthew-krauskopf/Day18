import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserFacade } from '../../features/user/user.facade';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './left-panel.component.html',
  styleUrl: './left-panel.component.scss',
})
export class LeftPanelComponent {
  userFacade: UserFacade = inject(UserFacade);

  user$ = this.userFacade.user$;
}
