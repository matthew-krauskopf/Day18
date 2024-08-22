import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthFacade } from '../../features/auth/auth.facade';
import { Message } from '../../features/message/message.entity';
import { MessageFacade } from '../../features/message/message.facade';
import { User } from '../../features/user/user.entity';
import { UserFacade } from '../../features/user/user.facade';
import { PostedMessage } from '../../model/posted-message';
import { ActionBarComponent } from '../action-bar/action-bar.component';
import { ProfileBadgeComponent } from '../profile-badge/profile-badge.component';
import { RetwattedByComponent } from '../retwatted-by/retwatted-by.component';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    MatIconModule,
    ActionBarComponent,
    NgIf,
    CommonModule,
    MatButtonModule,
    ProfileBadgeComponent,
    RetwattedByComponent,
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input() message?: Message;

  authFacade: AuthFacade = inject(AuthFacade);
  messageFacade: MessageFacade = inject(MessageFacade);
  router: Router = inject(Router);

  authUser$;

  constructor() {
    this.authUser$ = this.authFacade.user$;
  }

  openThread(message: Message) {
    this.messageFacade.openMessage(message);
    this.router.navigate(['home', 'messages', message.uuid]);
  }

  addMessage($event: PostedMessage) {
    this.messageFacade.addMessage($event.text, $event.user);
  }

  editMessage($event: Event, message: Message) {
    $event.stopPropagation();
    this.messageFacade.editMessage(message);
  }

  deleteMessage($event: Event, message: Message) {
    $event.stopPropagation();
    this.messageFacade.confirmDeleteMessage(message);
  }

  toggleLike(user: User, message: Message) {
    if (user.likedMessages.includes(message.uuid)) {
      this.messageFacade.removeLike(user, message);
    } else {
      this.messageFacade.addLike(user, message);
    }
  }

  toggleRetwat(user: User, message: Message) {
    if (user.retwats.includes(message.uuid)) {
      return this.messageFacade.removeRetwat(user, message);
    } else {
      return this.messageFacade.addRetwat(user, message);
    }
  }
}
