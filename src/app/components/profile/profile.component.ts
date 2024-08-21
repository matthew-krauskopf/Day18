import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { AuthFacade } from '../../features/auth/auth.facade';
import { MessageFacade } from '../../features/message/message.facade';
import { UserFacade } from '../../features/user/user.facade';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  userId: number | undefined;
  currentUser$;

  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  userFacade: UserFacade = inject(UserFacade);
  messageFacade: MessageFacade = inject(MessageFacade);
  authFacade: AuthFacade = inject(AuthFacade);

  currentMessages$;
  numMessages$;
  isAuthProfile$;

  ngOnInit() {}

  constructor() {
    this.userId = this.route.snapshot.params['id'];
    this.currentUser$ = this.userFacade.users$.pipe(
      map((users) => users.find((u) => u.id == this.userId))
    );
    this.currentMessages$ = combineLatest([
      this.messageFacade.messages$,
      this.messageFacade.comments$,
    ]).pipe(
      map(([messages, comments]) => {
        console.log(messages);
        console.log(comments);

        return [
          ...messages.filter((m) => m.author == this.userId),
          ...comments.filter((c) => c.author == this.userId),
        ];
      })
    );
    this.numMessages$ = this.currentMessages$.pipe(
      map((messages) => messages.length)
    );
    this.isAuthProfile$ = this.authFacade.userId$.pipe(
      map((id) => id == this.userId)
    );
  }

  goBack() {
    this.router.navigate(['home', 'messages']);
  }
}
