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

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    MatIconModule,
    ActionBarComponent,
    NgIf,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input() message?: Message;

  authFacade: AuthFacade = inject(AuthFacade);
  messageFacade: MessageFacade = inject(MessageFacade);
  userFacade: UserFacade = inject(UserFacade);
  router: Router = inject(Router);

  user$;

  constructor() {
    this.user$ = this.authFacade.user$;
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

  viewLikes(message: Message) {
    this.router.navigate(['home', 'messages', message.uuid, 'likes']);
  }

  viewRetwats(message: Message) {
    this.router.navigate(['home', 'messages', message.uuid, 'retwats']);
  }

  goToProfile(message: Message) {
    this.messageFacade.applyFilter('twats');
    this.userFacade.loadUser(message.author);
    this.router.navigate(['home', 'profile', message.author]);
  }
}
