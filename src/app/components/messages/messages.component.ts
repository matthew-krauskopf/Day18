import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Message } from '../../features/message/message.entity';
import { MessageFacade } from '../../features/message/message.facade';
import { PostedMessage } from '../../model/posted-message';
import { ActionBarComponent } from '../action-bar/action-bar.component';
import { MessageComponent } from '../message/message.component';
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
    MessageComponent,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent {
  messages$;
  messageFacade: MessageFacade = inject(MessageFacade);
  router: Router = inject(Router);

  constructor() {
    this.messages$ = this.messageFacade.messages$;
  }

  openThread(message: Message) {
    this.messageFacade.openMessage(message);
    this.router.navigate(['home', 'messages', message.uuid]);
  }

  addMessage($event: PostedMessage) {
    this.messageFacade.addMessage($event.text, $event.user);
  }

  goToProfile(message: Message) {
    this.router.navigate(['home', 'profile', message.author]);
  }
}
