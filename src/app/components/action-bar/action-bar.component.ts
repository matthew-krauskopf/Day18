import { CommonModule, NgStyle } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Message } from '../../features/message/message.entity';
import { Router } from '@angular/router';
import { MessageFacade } from '../../features/message/message.facade';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgStyle, CommonModule],
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss',
})
export class ActionBarComponent {
  messageFacade: MessageFacade = inject(MessageFacade);
  router: Router = inject(Router);

  @Input() message?: Message;
  @Input() isLikedSignal?: boolean;
  @Input() isRetwattedSignal?: boolean;

  @Output() retwatEmitter: EventEmitter<void> = new EventEmitter();
  @Output() likeEmitter: EventEmitter<void> = new EventEmitter();

  addComment($event: Event) {
    $event.stopPropagation();
  }

  toggleRetwat($event: Event) {
    $event.stopPropagation();
    this.retwatEmitter.emit();
  }

  toggleLike($event: Event) {
    $event.stopPropagation();
    this.likeEmitter.emit();
  }

  openLikedBy(message: Message) {
    this.messageFacade.openMessage(message);
    this.router.navigate(['home', 'messages', message.uuid, 'likes']);
  }

  openRetwattedBy(message: Message) {
    this.messageFacade.openMessage(message);
    this.router.navigate(['home', 'messages', message.uuid, 'retwats']);
  }
}
