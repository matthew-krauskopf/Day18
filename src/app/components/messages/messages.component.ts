import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthFacade } from '../../features/auth/auth.facade';
import { Message } from '../../features/message/message.entity';
import { MessageFacade } from '../../features/message/message.facade';
import { User } from '../../features/user/user.entity';
import { PostedMessage } from '../../model/posted-message';
import { ActionBarComponent } from '../action-bar/action-bar.component';
import { PostMessageComponent } from '../post-message/post-message.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    ActionBarComponent,
    PostMessageComponent,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent {
  user$;
  messages$;
  authFacade: AuthFacade = inject(AuthFacade);
  messageFacade: MessageFacade = inject(MessageFacade);
  router: Router = inject(Router);

  constructor() {
    this.user$ = this.authFacade.user$;
    this.messages$ = this.messageFacade.messages$;
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
    this.router.navigate(['home', 'messages', message.uuid, 'likedBy']);
  }

  viewRetwats(message: Message) {
    this.router.navigate(['home', 'messages', message.uuid, 'retwattedBy']);
  }

  goToProfile(message: Message) {
    this.router.navigate(['home', 'profile', message.author]);
  }
}
