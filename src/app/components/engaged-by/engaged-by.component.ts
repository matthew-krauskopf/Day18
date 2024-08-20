import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { Message } from '../../features/message/message.entity';
import { MessageFacade } from '../../features/message/message.facade';
import { UserFacade } from '../../features/user/user.facade';

@Component({
  selector: 'app-engaged-by',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgIf, CommonModule, NgClass],
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

  mode: string | undefined = undefined;

  ngOnInit(): void {
    this.messageFacade.loadMessage(this.route.snapshot.params['id']);
    this.mode = this.route.snapshot.routeConfig?.path;
  }

  constructor() {
    this.users$ = this.userFacade.users$;
    this.message$ = this.messageFacade.message$;

    this.engagedBy$ = combineLatest([this.users$, this.message$]).pipe(
      map(([users, message]) => {
        return users.filter((u) =>
          this.mode == 'retwattedBy'
            ? message?.retwattedBy?.includes(u.id)
            : message?.likedBy?.includes(u.id)
        );
      })
    );
  }

  goBack(message: Message) {
    this.router.navigate(['home', 'messages', message.uuid]);
  }

  goToLikes(message: Message) {
    this.router.navigate(['home', 'messages', message.uuid, 'likedBy']);
  }

  goToRetwats(message: Message) {
    this.router.navigate(['home', 'messages', message.uuid, 'retwattedBy']);
  }
}
