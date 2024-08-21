import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, ReplaySubject } from 'rxjs';
import { Message } from '../../features/message/message.entity';
import { MessageFacade } from '../../features/message/message.facade';
import { UserFacade } from '../../features/user/user.facade';
import { OptionSelectComponent } from '../option-select/option-select.component';

@Component({
  selector: 'app-engaged-by',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    NgIf,
    CommonModule,
    NgClass,
    OptionSelectComponent,
  ],
  templateUrl: './engaged-by.component.html',
  styleUrl: './engaged-by.component.scss',
})
export class EngagedByComponent implements OnInit {
  userFacade: UserFacade = inject(UserFacade);
  messageFacade: MessageFacade = inject(MessageFacade);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  users$;
  message$;
  engagedBy$;

  mode$: ReplaySubject<string> = new ReplaySubject(1);

  modes = ['retwats', 'likes'];

  ngOnInit(): void {
    this.messageFacade.loadMessage(this.route.snapshot.params['id']);
    this.mode$.next(this.route.snapshot.routeConfig?.path ?? '');
  }

  constructor() {
    this.users$ = this.userFacade.users$;
    this.message$ = this.messageFacade.message$;

    this.engagedBy$ = combineLatest([
      this.users$,
      this.message$,
      this.mode$,
    ]).pipe(
      map(([users, message, mode]) => {
        return users.filter((u) =>
          mode == 'retwats'
            ? message?.retwattedBy?.includes(u.id)
            : message?.likedBy?.includes(u.id)
        );
      })
    );
  }

  goBack(message: Message) {
    this.router.navigate(['home', 'messages', message.uuid]);
  }

  changeMode(mode: string, message: Message) {
    this.router.navigate(['home', 'messages', message.uuid, mode]);
  }
}
