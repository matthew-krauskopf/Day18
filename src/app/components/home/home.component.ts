import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { RouterOutlet } from '@angular/router';
import { LeftPanelComponent } from '../left-panel/left-panel.component';
import { UserFacade } from '../../services/user.facade';
import { MessageFacade } from '../../services/message.facade';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopBarComponent, RouterOutlet, LeftPanelComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  userFacade: UserFacade = inject(UserFacade);
  messageFacade: MessageFacade = inject(MessageFacade);
  user$;

  constructor() {
    this.user$ = this.userFacade.watchUser();
  }

  ngOnInit() {
    this.messageFacade.loadMessages();
    this.messageFacade.openMessage(null);
  }

  ngOnDestroy() {
    this.messageFacade.unloadMessages();
  }
}
