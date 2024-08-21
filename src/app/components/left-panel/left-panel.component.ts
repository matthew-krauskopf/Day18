import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthFacade } from '../../features/auth/auth.facade';
import { Router } from '@angular/router';
import { User } from '../../features/user/user.entity';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './left-panel.component.html',
  styleUrl: './left-panel.component.scss',
})
export class LeftPanelComponent {
  authFacade: AuthFacade = inject(AuthFacade);
  router: Router = inject(Router);

  user$ = this.authFacade.user$;

  goToProfile(user: User) {
    this.router.navigate(['home', 'profile', user.id]);
  }
}
