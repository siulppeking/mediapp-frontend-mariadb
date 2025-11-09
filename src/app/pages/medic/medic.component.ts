import { Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Medic } from '../../model/Medic';
import { MedicService } from '../../services/medic.service';
//import { MatInputModule } from '@angular/material/input';
//import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '../../material/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MedicDialogComponent } from './medic-dialog/medic-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-medic',
  imports: [
    MaterialModule,
    MatDialogModule
  ],
  templateUrl: './medic.component.html',
  styleUrl: './medic.component.css',
})
export class MedicComponent {

  protected dataSource: MatTableDataSource<Medic>;
  protected displayedColumns: string[] = ['idMedic', 'primaryName', 'surname', 'actions'];

  private readonly medicService = inject(MedicService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.medicService.findAll().subscribe(data => {
      this.dataSource = new MatTableDataSource<Medic>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.medicService.getMedicChange().subscribe(data => this.dataSource.data = data);
    this.medicService.getMessageChange().subscribe(message => this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' }));
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  openDialog(medic?: Medic) {
    this.dialog.open(MedicDialogComponent, {
      width: '650px',
      data: medic,
      disableClose: true
    });
  }

  delete(medic: Medic) {
    this.medicService.delete(medic.idMedic)
      .pipe(
        switchMap(() => this.medicService.findAll()),
        tap(data => this.medicService.setMedicChange(data)),
        tap(() => this.medicService.setMessageChange('DELETED!'))
      )
      .subscribe();
  }
}
