import { CommonModule, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthFacade } from '../../features/auth/auth.facade';
import { User } from '../../features/user/user.entity';
import { PostedMessage } from '../../model/posted-message';
import { ProfileBadgeComponent } from '../profile-badge/profile-badge.component';

@Component({
  selector: 'app-post-message',
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    ProfileBadgeComponent,
  ],
  templateUrl: './post-message.component.html',
  styleUrl: './post-message.component.scss',
})
export class PostMessageComponent implements OnInit {
  authFacade: AuthFacade = inject(AuthFacade);
  router: Router = inject(Router);

  @Input() mode?: string;
  @Output() messageEmitter: EventEmitter<PostedMessage> = new EventEmitter();

  placeholder: string = '';

  user$ = this.authFacade.user$;

  ngOnInit(): void {
    this.placeholder =
      this.mode == 'comment' ? 'Leave a comment' : "What's happening?!";
  }

  newMessageForm = new FormGroup({
    message: new FormControl('', Validators.maxLength(280)),
  });

  addMessage(user: User) {
    this.messageEmitter.emit({
      user: user,
      text: this.newMessageForm.value.message ?? '',
    });
    this.newMessageForm.patchValue({ message: '' });
  }
}
