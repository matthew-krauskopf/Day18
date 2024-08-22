import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFacade } from './features/auth/auth.facade';
import { UserFacade } from './features/user/user.facade';
import { MessageFacade } from './features/message/message.facade';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  authFacade: AuthFacade = inject(AuthFacade);
  messageFacade: MessageFacade = inject(MessageFacade);
  userFacade: UserFacade = inject(UserFacade);

  ngOnInit(): void {
    this.authFacade.performCachedLogin();
    this.userFacade.loadUsers();
    this.messageFacade.loadMessages();
  }

  ngOnDestroy() {
    this.userFacade.unloadUsers();
    this.messageFacade.unloadMessages();
  }
}
