import { Component, inject, Input } from '@angular/core';
import { map } from 'rxjs';
import { UserFacade } from '../../features/user/user.facade';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { User } from '../../features/user/user.entity';
import { MessageFacade } from '../../features/message/message.facade';
import { Router } from '@angular/router';

@Component({
  selector: 'app-retwatted-by',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './retwatted-by.component.html',
  styleUrl: './retwatted-by.component.scss',
})
export class RetwattedByComponent {
  @Input() userId?: number;

  userFacade: UserFacade = inject(UserFacade);
  messageFacade: MessageFacade = inject(MessageFacade);
  router: Router = inject(Router);
  user$;

  constructor() {
    this.user$ = this.userFacade.users$.pipe(
      map((users) => users.find((u) => u.id == this.userId))
    );
  }

  goToProfile(user: User) {
    if (!user.deleted) {
      this.messageFacade.applyFilter('twats');
      this.userFacade.loadUser(user.id);
      this.router.navigate(['home', 'profile', user.id]);
    }
  }
}
