import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PatientComponent } from './pages/patient/patient.component';
import { LayoutComponent } from './pages/layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mediapp-frontend-mariadb');
}
