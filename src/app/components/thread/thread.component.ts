import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthFacade } from '../../features/auth/auth.facade';
import { Message } from '../../features/message/message.entity';
import { MessageFacade } from '../../features/message/message.facade';
import { User } from '../../features/user/user.entity';
import { PostedMessage } from '../../model/posted-message';
import { ActionBarComponent } from '../action-bar/action-bar.component';
import { MessageComponent } from '../message/message.component';
import { PostMessageComponent } from '../post-message/post-message.component';
import { ProfileBadgeComponent } from '../profile-badge/profile-badge.component';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ActionBarComponent,
    PostMessageComponent,
    MessageComponent,
    ProfileBadgeComponent,
  ],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss',
})
export class ThreadComponent implements OnInit, OnDestroy {
  authFacade: AuthFacade = inject(AuthFacade);
  messageFacade: MessageFacade = inject(MessageFacade);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  user$;
  message$: Observable<Message | null>;
  comments$;

  constructor() {
    this.user$ = this.authFacade.user$;
    this.message$ = this.messageFacade.message$;
    this.comments$ = this.messageFacade.comments$;
  }

  goBack(message: Message) {
    if (message.parent) {
      this.messageFacade.unloadMessage();
      this.messageFacade.loadMessage(message.parent);
      this.router.navigate(['home', 'messages', message.parent]);
    } else {
      this.router.navigate(['home', 'messages']);
    }
  }

  ngOnInit(): void {
    this.messageFacade.loadMessage(this.route.snapshot.params['id']);
  }

  ngOnDestroy() {
    this.messageFacade.unloadMessage();
  }

  addComment($event: PostedMessage, parent: Message) {
    this.messageFacade.addComment(parent, $event.text, $event.user);
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
      this.messageFacade.removeRetwat(user, message);
    } else {
      this.messageFacade.addRetwat(user, message);
    }
  }
}
