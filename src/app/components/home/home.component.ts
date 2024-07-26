import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageFacade } from '../../services/facades/message.facade';
import { UserFacade } from '../../services/facades/user.facade';
import { LeftPanelComponent } from '../left-panel/left-panel.component';
import { TopBarComponent } from '../top-bar/top-bar.component';

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
