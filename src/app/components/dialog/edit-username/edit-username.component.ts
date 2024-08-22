import { CommonModule, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-username',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    NgIf,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
  ],
  templateUrl: './edit-username.component.html',
  styleUrl: './edit-username.component.scss',
})
export class EditUsernameComponent {
  usernameForm: FormGroup = new FormGroup({
    text: new FormControl(this.dialogData.text, [
      Validators.required,
      Validators.maxLength(12),
    ]),
  });

  constructor(
    public dialogRef: MatDialogRef<EditUsernameComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogInput
  ) {}

  onNoClick() {
    console.log(this.usernameForm.controls['text'].errors);
    this.dialogRef.close();
  }
}

interface DialogInput {
  text: string;
}
