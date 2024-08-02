import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Message } from '../../features/message/message.entity';
import { MessageFacade } from '../../features/message/message.facade';
import { ActionBarComponent } from '../action-bar/action-bar.component';
import { PostMessageComponent } from '../post-message/post-message.component';
import { PostedMessage } from '../../model/posted-message';

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
  messageFacade: MessageFacade = inject(MessageFacade);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  message$: Observable<Message | null>;

  constructor() {
    this.message$ = this.messageFacade.watchMessage();
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

  addComment($event: PostedMessage) {
    this.messageFacade.addComment($event.text, $event.user);
  }
}
