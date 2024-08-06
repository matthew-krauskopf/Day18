import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Message } from '../../features/message/message.entity';
import { MessageFacade } from '../../features/message/message.facade';
import { PostedMessage } from '../../model/posted-message';
import { ActionBarComponent } from '../action-bar/action-bar.component';
import { ConfirmActionComponent } from '../dialog/confirm-action/confirm-action.component';
import { EditMessageComponent } from '../dialog/edit-message/edit-message.component';
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
  messageFacade: MessageFacade = inject(MessageFacade);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  dialog: MatDialog = inject(MatDialog);

  message$: Observable<Message | null>;
  comments$;

  constructor() {
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
    const dialogRef = this.dialog.open(EditMessageComponent, {
      data: {
        text: comment.text,
      },
    });

    dialogRef.afterClosed().subscribe((form) => {
      if (form) {
        this.messageFacade.editMessage({
          ...comment,
          text: form.value.text,
        });
      }
    });
  }

  deleteComment(comment: Message) {
    const dialogRef = this.dialog.open(ConfirmActionComponent);

    dialogRef.afterClosed().subscribe((action) => {
      if (action && action == true) {
        this.messageFacade.deleteMessage(comment);
      }
    });
  }

  toggleLike(message: Message) {
    this.messageFacade.toggleLike(message);
  }

  toggleRetwat(message: Message) {
    this.messageFacade.toggleRetwat(message);
  }
}
