import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, ReplaySubject } from 'rxjs';
import { AuthFacade } from '../../features/auth/auth.facade';
import { Message } from '../../features/message/message.entity';
import { MessageFacade } from '../../features/message/message.facade';
import { User } from '../../features/user/user.entity';
import { UserFacade } from '../../features/user/user.facade';
import { ActionBarComponent } from '../action-bar/action-bar.component';
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
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  currentUser$;

  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  userFacade: UserFacade = inject(UserFacade);
  messageFacade: MessageFacade = inject(MessageFacade);
  authFacade: AuthFacade = inject(AuthFacade);

  currentMessages$;
  filteredMessages$;
  numMessages$;
  isAuthProfile$;

  modes = ['twats', 'comments', 'retwats', 'likes'];

  userId$: ReplaySubject<number> = new ReplaySubject(1);
  mode$: ReplaySubject<string> = new ReplaySubject(1);

  ngOnInit() {}

  constructor() {
    this.userId$.next(Number(this.route.snapshot.params['id']) ?? -1);
    this.mode$.next(this.router.url.split('/')[4] ?? 'twats');
    this.currentUser$ = combineLatest([
      this.userFacade.users$,
      this.userId$,
    ]).pipe(map(([users, userId]) => users.find((u) => u.id == userId)));

    this.currentMessages$ = combineLatest([
      this.userId$,
      this.messageFacade.messages$,
      this.messageFacade.comments$,
    ]).pipe(
      map(([userId, messages, comments]) => [
        ...messages.filter((m) => m.author == userId),
        ...comments.filter((c) => c.author == userId),
      ])
    );

    this.numMessages$ = this.currentMessages$.pipe(
      map((messages) => messages.length)
    );

    this.filteredMessages$ = combineLatest([
      this.messageFacade.messages$,
      this.messageFacade.comments$,
      this.mode$,
      this.userId$,
    ]).pipe(
      map(([messages, comments, mode, userId]) => {
        switch (mode) {
          case this.modes[0]: //twats
            return messages.filter(
              (m) => m.author == userId && !m.retwatAuthor
            );
          case this.modes[1]: //comments
            return comments.filter((c) => c.author == userId);
          case this.modes[2]: //retwats
            return messages.filter((m) => m.retwattedBy.includes(userId));
          case this.modes[3]: // likes
            return [
              ...messages.filter((m) => m.likedBy.includes(userId)),
              ...comments.filter((c) => c.likedBy.includes(userId)),
            ];
        }
        return messages;
      })
    );

    this.isAuthProfile$ = combineLatest([
      this.authFacade.userId$,
      this.userId$,
    ]).pipe(map(([id, userId]) => id == userId));
  }

  goBack() {
    this.router.navigate(['home', 'messages']);
  }

  changeMode($event: string, user: User) {
    this.mode$.next($event);
    if ($event == 'twats') {
      this.router.navigate(['home', 'profile', user.id]);
    } else {
      this.router.navigate(['home', 'profile', user.id, $event]);
    }
  }

  editMessage($event: Event, message: Message) {
    $event.stopPropagation();
    this.messageFacade.editMessage(message);
  }

  deleteMessage($event: Event, message: Message) {
    $event.stopPropagation();
    this.messageFacade.confirmDeleteMessage(message);
  }

  openThread(message: Message) {
    this.messageFacade.openMessage(message);
    this.router.navigate(['home', 'messages', message.uuid]);
  }

  toggleLike(user: User, message: Message) {
    if (user.likedMessages.includes(message.uuid)) {
      this.messageFacade.removeLike(user, message);
    } else {
      this.messageFacade.addLike(user, message);
    }
  }

  toggleRetwat(user: User, message: Message) {
    if (user.retwats.includes(message.uuid)) {
      return this.messageFacade.removeRetwat(user, message);
    } else {
      return this.messageFacade.addRetwat(user, message);
    }
  }

  viewLikes(message: Message) {
    this.router.navigate(['home', 'messages', message.uuid, 'likedBy']);
  }

  viewRetwats(message: Message) {
    this.router.navigate(['home', 'messages', message.uuid, 'retwattedBy']);
  }

  goToProfile(message: Message) {
    this.userId$.next(message.author);
    this.mode$.next(this.modes[0]);
    this.router.navigate(['home', 'profile', message.author]);
  }
}
