import { Component, inject } from '@angular/core';
import { Medic } from '../../../model/Medic';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MedicService } from '../../../services/medic.service';
import { switchMap, tap } from 'rxjs';
import { SpecialtyService } from '../../../services/specialty.service';
import { Specialty } from '../../../model/Specialty';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-medic-dialog',
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './medic-dialog.component.html',
  styleUrl: './medic-dialog.component.css',
})
export class MedicDialogComponent {

  protected medic: Medic;
  protected specialties: Specialty[];

  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<MedicDialogComponent>);
  private readonly medicService = inject(MedicService);
  private readonly specialtyService = inject(SpecialtyService);

  ngOnInit(): void {
    // Spread operator: crea una copia superficial del objeto
    this.medic = { ... this.data };

    // Esto solo crea una referencia (no recomendado)
    //this.medic = this.data;

    // Copia manual de propiedades (verboso)
    /*this.medic = new Medic();
    this.medic.idMedic = this.data.idMedic;
    this.medic.primaryName = this.data.primaryName;
    this.medic.surname = this.data.surname;
    this.medic.cmpMedic = this.data.cmpMedic;
    this.medic.photo = this.data.photo;
    this.medic.idSpecialty = this.data.idSpecialty;*/

    this.specialtyService.findAll().subscribe(data => this.specialties = data)
  }

  close() {
    this.dialogRef.close();
  }

  operate() {
    if (this.medic != null && this.medic.idMedic > 0) {
      //UPDATE
      this.medicService.update(this.medic.idMedic, this.medic)
        .pipe(
          switchMap(() => this.medicService.findAll()),
          tap(data => this.medicService.setMedicChange(data)),
          tap(() => this.medicService.setMessageChange('Medic updated'))
        )
        .subscribe(() => this.close());
    } else {
      //SAVE
      this.medicService.save(this.medic)
        .pipe(
          switchMap(() => this.medicService.findAll()),
          tap(data => this.medicService.setMedicChange(data)),
          tap(() => this.medicService.setMessageChange('Medic created'))
        )
        .subscribe(() => this.close());
    }
  }
}
