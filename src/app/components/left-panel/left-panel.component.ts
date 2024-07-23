import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

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
