import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { MessageFacade } from '../../features/message/message.facade';
import { User } from '../../features/user/user.entity';
import { UserFacade } from '../../features/user/user.facade';

@Component({
  selector: 'app-profile-badge',
  standalone: true,
  imports: [CommonModule, NgClass],
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
    if (!user.deleted) {
      this.messageFacade.applyFilter('twats');
      this.userFacade.loadUser(user.id);
      this.router.navigate(['home', 'profile', user.id]);
    }
  }
}
