import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { AuthFacade } from '../../features/auth/auth.facade';
import { MessageFacade } from '../../features/message/message.facade';
import { User } from '../../features/user/user.entity';
import { UserFacade } from '../../features/user/user.facade';
import { ActionBarComponent } from '../action-bar/action-bar.component';
import { MessageComponent } from '../message/message.component';
import { OptionSelectComponent } from '../option-select/option-select.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    CommonModule,
    OptionSelectComponent,
    ActionBarComponent,
    MessageComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  userFacade: UserFacade = inject(UserFacade);
  messageFacade: MessageFacade = inject(MessageFacade);
  authFacade: AuthFacade = inject(AuthFacade);

  filteredMessages$;
  numMessages$;
  isAuthProfile$;
  currentUser$;
  mode$;

  filters = ['twats', 'comments', 'retwats', 'likes'];

  ngOnInit() {
    this.userFacade.loadUser(Number(this.route.snapshot.params['id']) ?? -1);
  }

  ngOnDestroy(): void {
    this.userFacade.unloadUser();
  }

  constructor() {
    this.currentUser$ = this.userFacade.user$;
    this.mode$ = this.messageFacade.filter$;
    this.filteredMessages$ = this.messageFacade.filteredMessages$;

    this.numMessages$ = combineLatest([
      this.userFacade.user$,
      this.messageFacade.allMessages$,
    ]).pipe(
      map(
        ([user, messages]) =>
          messages.filter((m) => m.author == (user ? user.id : -1)).length
      )
    );

    this.isAuthProfile$ = combineLatest([
      this.authFacade.user$,
      this.userFacade.user$,
    ]).pipe(map(([id, userId]) => id == userId));
  }

  goBack() {
    this.router.navigate(['home', 'messages']);
  }

  changeFilter($event: string, user: User) {
    this.messageFacade.applyFilter($event);
    if ($event == 'twats') {
      this.router.navigate(['home', 'profile', user.id]);
    } else {
      this.router.navigate(['home', 'profile', user.id, $event]);
    }
  }
}
