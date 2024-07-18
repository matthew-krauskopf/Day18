import { Component, inject, OnInit } from '@angular/core';
import { MessageFacade } from '../../services/message.facade';
import { Observable } from 'rxjs';
import { Message } from '../../models/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnInit {
  messages$: Observable<Message[] | null>;
  messageFacade: MessageFacade = inject(MessageFacade);

  constructor() {
    this.messages$ = this.messageFacade.watchMessages();
  }

  ngOnInit(): void {
    this.messageFacade.loadMessages();
  }
}
