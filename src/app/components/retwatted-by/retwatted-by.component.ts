import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { User } from '../../features/user/user.entity';

@Component({
  selector: 'app-retwatted-by',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './retwatted-by.component.html',
  styleUrl: './retwatted-by.component.scss',
})
export class RetwattedByComponent {
  @Input() user?: User;
  router: Router = inject(Router);

  goToProfile(user: User) {
    if (!user.deleted) {
      this.router.navigate(['home', 'profile', user.id]);
    }
  }
}
