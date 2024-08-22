import { Component, inject, Input } from '@angular/core';
import { Message } from '../../features/message/message.entity';
import { Router } from '@angular/router';
import { MessageFacade } from '../../features/message/message.facade';
import { UserFacade } from '../../features/user/user.facade';
import { User } from '../../features/user/user.entity';
import { combineLatest, map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-badge.component.html',
  styleUrl: './profile-badge.component.scss',
})
export class ProfileBadgeComponent {
  @Input() userId?: number;
  @Input() hideUsername?: boolean;

  user$;

  constructor() {
    this.user$ = this.userFacade.users$.pipe(
      map((users) => users.find((u) => u.id == this.userId))
    );
  }

  messageFacade: MessageFacade = inject(MessageFacade);
  userFacade: UserFacade = inject(UserFacade);
  router: Router = inject(Router);

  goToProfile(user: User) {
    this.messageFacade.applyFilter('twats');
    this.userFacade.loadUser(user.id);
    this.router.navigate(['home', 'profile', user.id]);
  }
}
