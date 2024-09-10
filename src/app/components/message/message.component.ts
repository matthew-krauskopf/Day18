import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
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
import { Observable, of } from 'rxjs';

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
export class MessageComponent implements OnInit {
  @Input() message?: Message;

  authFacade: AuthFacade = inject(AuthFacade);
  userFacade: UserFacade = inject(UserFacade);
  messageFacade: MessageFacade = inject(MessageFacade);
  router: Router = inject(Router);

  authUser$;
  author$: Observable<User | undefined> = of(undefined);
  retwatAuthor$: Observable<User | undefined> = of(undefined);

  constructor() {
    this.authUser$ = this.authFacade.user$;
  }

  ngOnInit() {
    this.author$ = this.userFacade.getAuthor(this.message?.author);
    this.retwatAuthor$ = this.userFacade.getAuthor(this.message?.retwatAuthor);
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
