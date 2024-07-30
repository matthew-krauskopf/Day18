import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../features/user/user.entity';
import { MessageFacade } from '../../features/message/message.facade';
import { UserFacade } from '../../features/user/user.facade';

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
  ],
  templateUrl: './post-message.component.html',
  styleUrl: './post-message.component.scss',
})
export class PostMessageComponent {
  userFacace: UserFacade = inject(UserFacade);
  messageFacade: MessageFacade = inject(MessageFacade);

  user$ = this.userFacace.watchUser();

  newMessageForm = new FormGroup({
    message: new FormControl('', Validators.maxLength(280)),
  });

  addMessage(user: User) {
    this.messageFacade.addMessage(
      this.newMessageForm.value.message ?? '',
      user
    );
    this.newMessageForm.patchValue({ message: '' });
  }
}
