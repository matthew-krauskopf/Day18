import { Component, inject, Input } from '@angular/core';
import { Message } from '../../features/message/message.entity';
import { Router } from '@angular/router';
import { MessageFacade } from '../../features/message/message.facade';
import { UserFacade } from '../../features/user/user.facade';
import { User } from '../../features/user/user.entity';

@Component({
  selector: 'app-profile-badge',
  standalone: true,
  imports: [],
  templateUrl: './profile-badge.component.html',
  styleUrl: './profile-badge.component.scss',
})
export class ProfileBadgeComponent {
  @Input() pic?: string;
  @Input() userId?: number;

  messageFacade: MessageFacade = inject(MessageFacade);
  userFacade: UserFacade = inject(UserFacade);
  router: Router = inject(Router);

  goToProfile(userId: number) {
    this.messageFacade.applyFilter('twats');
    this.userFacade.loadUser(userId);
    this.router.navigate(['home', 'profile', userId]);
  }
}
