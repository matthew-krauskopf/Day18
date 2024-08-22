import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from '../../features/auth/auth.facade';
import { MessageFacade } from '../../features/message/message.facade';
import { User } from '../../features/user/user.entity';
import { UserFacade } from '../../features/user/user.facade';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './left-panel.component.html',
  styleUrl: './left-panel.component.scss',
})
export class LeftPanelComponent {
  authFacade: AuthFacade = inject(AuthFacade);
  messageFacade: MessageFacade = inject(MessageFacade);
  userFacade: UserFacade = inject(UserFacade);
  router: Router = inject(Router);

  user$ = this.authFacade.user$;

  goToProfile(user: User) {
    this.messageFacade.applyFilter('twats');
    this.userFacade.loadUser(user.id);
    this.router.navigate(['home', 'profile', user.id]);
  }
}
