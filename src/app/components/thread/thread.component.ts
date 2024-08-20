import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Message } from '../../features/message/message.entity';
import { MessageFacade } from '../../features/message/message.facade';
import { User } from '../../features/user/user.entity';
import { UserFacade } from '../../features/user/user.facade';
import { PostedMessage } from '../../model/posted-message';
import { ActionBarComponent } from '../action-bar/action-bar.component';
import { PostMessageComponent } from '../post-message/post-message.component';
import { AuthFacade } from '../../features/auth/auth.facade';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ActionBarComponent,
    PostMessageComponent,
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

  openThread(message: Message) {
    this.messageFacade.unloadMessage();
    this.messageFacade.openMessage(message);
    this.router.navigate(['home', 'messages', message.uuid]);
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

  editComment($event: Event, comment: Message) {
    $event.stopPropagation();
    this.messageFacade.editMessage(comment);
  }

  deleteComment($event: Event, comment: Message) {
    $event.stopPropagation();
    this.messageFacade.confirmDeleteMessage(comment);
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

  viewLikes(message: Message) {
    this.messageFacade.openMessage(message);
    this.router.navigate(['home', 'messages', message.uuid, 'likedBy']);
  }

  viewRetwats(message: Message) {
    this.messageFacade.openMessage(message);
    this.router.navigate(['home', 'messages', message.uuid, 'retwattedBy']);
  }
}
