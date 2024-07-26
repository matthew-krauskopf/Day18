import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Message } from '../../models/message';
import { User } from '../../models/user';
import { MessageFacade } from '../../services/facades/message.facade';
import { UserFacade } from '../../services/facades/user.facade';
import { ConfirmActionComponent } from '../dialog/confirm-action/confirm-action.component';
import { EditMessageComponent } from '../dialog/edit-message/edit-message.component';
import { ActionBarComponent } from '../action-bar/action-bar.component';

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
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent {
  user$: Observable<User | null>;
  messages$: Observable<Message[] | null>;
  usersFacade: UserFacade = inject(UserFacade);
  messageFacade: MessageFacade = inject(MessageFacade);
  router: Router = inject(Router);
  dialog: MatDialog = inject(MatDialog);

  newMessageForm = new FormGroup({
    message: new FormControl('', Validators.maxLength(280)),
  });

  constructor() {
    this.user$ = this.usersFacade.watchUser();
    this.messages$ = this.messageFacade.watchMessages();
  }

  openThread(message: Message) {
    this.messageFacade.openMessage(message);
    this.router.navigate(['home', 'thread', message.uuid]);
  }

  addMessage(user: User) {
    this.messageFacade.addMessage(
      this.newMessageForm.value.message ?? '',
      user
    );
    this.newMessageForm.patchValue({ message: '' });
  }

  addComment($event: Event) {
    $event.stopPropagation();
  }

  addRepost($event: Event) {
    $event.stopPropagation();
  }

  addLike($event: Event) {
    $event.stopPropagation();
  }

  editMessage($event: Event, message: Message) {
    $event.stopPropagation();

    const dialogRef = this.dialog.open(EditMessageComponent, {
      data: {
        text: message.text,
      },
    });

    dialogRef.afterClosed().subscribe((form) => {
      if (form) {
        this.messageFacade.editMessage({
          ...message,
          text: form.value.text,
        });
      }
    });
  }

  deleteMessage($event: Event, message: Message) {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmActionComponent);

    dialogRef.afterClosed().subscribe((action) => {
      if (action && action == true) {
        this.messageFacade.deleteMessage(message);
      }
    });
  }
}
