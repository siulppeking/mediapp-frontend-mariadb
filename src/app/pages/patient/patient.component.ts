import { Component, inject, ViewChild } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../model/Patient';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-patient',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
    RouterLink,
    MatSnackBarModule
  ],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css',
})
export class PatientComponent {

  private readonly patientService = inject(PatientService);
  private readonly snackBar = inject(MatSnackBar);

  protected dataSource: MatTableDataSource<Patient>;
  protected displayedColumns: string[] = ['idPatient', 'firstName', 'lastName', 'dni', 'actions'];

  //protected patients: Patient[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.patientService.findAll().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })


    this.patientService.getPatientChange().subscribe(data => this.dataSource.data = data);
    this.patientService.getMessageChange().subscribe(message => this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' }));

  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  delete(idPatient: number) {
    this.patientService.delete(idPatient)
      .pipe(
        switchMap(() => this.patientService.findAll()),
        tap(data => this.patientService.setPatientChange(data)),
        tap(() => this.patientService.setMessageChange('DELETED SUCCESSFULLY'))
      )
      .subscribe();
  }

} 