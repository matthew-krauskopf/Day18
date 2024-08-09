import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageFacade } from '../../features/message/message.facade';
import { UserFacade } from '../../features/user/user.facade';
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
  messageFacade: MessageFacade = inject(MessageFacade);
  userFacade: UserFacade = inject(UserFacade);

  ngOnInit() {
    this.userFacade.loadUsers();
    this.messageFacade.loadMessages();
  }

  ngOnDestroy() {
    //this.userFacade.unloadUsers();
    this.messageFacade.unloadMessages();
  }
}
