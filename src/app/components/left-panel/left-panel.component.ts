import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthFacade } from '../../features/auth/auth.facade';
import { ProfileBadgeComponent } from '../profile-badge/profile-badge.component';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [NgIf, CommonModule, ProfileBadgeComponent],
  templateUrl: './left-panel.component.html',
  styleUrl: './left-panel.component.scss',
})
export class LeftPanelComponent {
  authFacade: AuthFacade = inject(AuthFacade);
  user$ = this.authFacade.user$;
}
