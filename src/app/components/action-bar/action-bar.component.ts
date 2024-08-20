import { CommonModule, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Message } from '../../features/message/message.entity';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgStyle, CommonModule],
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss',
})
export class ActionBarComponent {
  @Input() message?: Message;
  @Input() isLikedSignal?: boolean;
  @Input() isRetwattedSignal?: boolean;

  @Output() retwatEmitter: EventEmitter<void> = new EventEmitter();
  @Output() likeEmitter: EventEmitter<void> = new EventEmitter();
  @Output() viewLikesEmitter: EventEmitter<void> = new EventEmitter();
  @Output() viewRetwatsEmitter: EventEmitter<void> = new EventEmitter();

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

  openLikedBy() {
    this.viewLikesEmitter.emit();
  }

  openRetwattedBy() {
    this.viewRetwatsEmitter.emit();
  }
}
