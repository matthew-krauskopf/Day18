import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Message } from '../../models/message';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss',
})
export class ActionBarComponent {
  @Input() message?: Message;

  addComment($event: Event) {
    $event.stopPropagation();
  }

  addRepost($event: Event) {
    $event.stopPropagation();
  }

  addLike($event: Event) {
    $event.stopPropagation();
  }
}
