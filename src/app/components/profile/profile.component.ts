import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { UserFacade } from '../../features/user/user.facade';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  userId: number | undefined;
  currentUser$;

  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  userFacade: UserFacade = inject(UserFacade);

  ngOnInit() {}

  constructor() {
    this.userId = this.route.snapshot.params['id'];
    this.currentUser$ = this.userFacade.users$.pipe(
      map((users) => users.find((u) => u.id == this.userId))
    );
  }

  goBack() {
    this.router.navigate(['home', 'messages']);
  }
}
