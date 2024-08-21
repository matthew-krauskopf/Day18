import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-option-select',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './option-select.component.html',
  styleUrl: './option-select.component.scss',
})
export class OptionSelectComponent {
  @Input() mode?: string;
  @Input() label?: string;

  @Output() labelEmitter: EventEmitter<string> = new EventEmitter();

  emitLabel() {
    this.labelEmitter.emit(this.label);
  }
}
