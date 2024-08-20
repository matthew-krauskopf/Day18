import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthFacade } from '../../features/auth/auth.facade';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './left-panel.component.html',
  styleUrl: './left-panel.component.scss',
})
export class LeftPanelComponent {
  authFacade: AuthFacade = inject(AuthFacade);
  user$ = this.authFacade.user$;
}
