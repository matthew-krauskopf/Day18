import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftPanelComponent } from '../left-panel/left-panel.component';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopBarComponent, RouterOutlet, LeftPanelComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
