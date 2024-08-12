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
  userFacade: UserFacade = inject(UserFacade);
  messageFacade: MessageFacade = inject(MessageFacade);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  user$;
  message$: Observable<Message | null>;
  comments$;

  constructor() {
    this.user$ = this.userFacade.user$;
    this.message$ = this.messageFacade.message$;
    this.comments$ = this.messageFacade.comments$;
  }

  goBack() {
    this.router.navigate(['home', 'messages']);
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

  editComment(comment: Message) {
    this.messageFacade.editMessage(comment);
  }

  deleteComment(comment: Message) {
    this.messageFacade.confirmDeleteMessage(comment);
  }

  toggleLike(user: User, message: Message) {
    this.messageFacade.toggleLike(user, message);
  }

  toggleRetwat(user: User, message: Message) {
    this.messageFacade.toggleRetwat(user, message);
  }
}
