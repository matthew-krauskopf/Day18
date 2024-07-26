import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Message } from '../../models/message';
import { MessageFacade } from '../../services/facades/message.facade';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss',
})
export class ThreadComponent implements OnInit, OnDestroy {
  messageFacade: MessageFacade = inject(MessageFacade);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  message$: Observable<Message | null>;

  constructor() {
    this.message$ = this.messageFacade.watchMessage();
  }

  goBack() {
    this.router.navigate(['home', 'messages']);
  }

  ngOnInit(): void {
    this.messageFacade.loadMessage(this.route.snapshot.params['id']);
  }

  ngOnDestroy() {
    this.messageFacade.unloadMessage();
  }
}
