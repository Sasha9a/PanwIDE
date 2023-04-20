import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SplitterModule } from 'primeng/splitter';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule, RouterModule, SplitterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
