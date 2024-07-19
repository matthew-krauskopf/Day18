import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from '../../models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './left-panel.component.html',
  styleUrl: './left-panel.component.scss',
})
export class LeftPanelComponent {
  @Input() user$?: Observable<User | null>;
}
