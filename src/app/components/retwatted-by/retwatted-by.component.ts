import { Component, inject, Input } from '@angular/core';
import { map } from 'rxjs';
import { UserFacade } from '../../features/user/user.facade';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-retwatted-by',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './retwatted-by.component.html',
  styleUrl: './retwatted-by.component.scss',
})
export class RetwattedByComponent {
  @Input() userId?: number;

  userFacade: UserFacade = inject(UserFacade);
  user$;

  constructor() {
    this.user$ = this.userFacade.users$.pipe(
      map((users) => users.find((u) => u.id == this.userId))
    );
  }
}
