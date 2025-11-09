import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../model/Patient';
import { switchMap, tap } from 'rxjs';
import { A11yModule } from "@angular/cdk/a11y";

@Component({
  selector: 'app-patient-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    A11yModule
  ],
  templateUrl: './patient-edit.component.html',
  styleUrl: './patient-edit.component.css',
})
export class PatientEditComponent {

  protected form: FormGroup;
  private id: number;
  private isEdit: boolean;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly patientService = inject(PatientService);

  ngOnInit(): void {
    this.form = new FormGroup({
      idPatient: new FormControl(),
      firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(70)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(70)]),
      dni: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
      address: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      phone: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(15), Validators.pattern('^[0-9]+$')]),
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.isEdit = params['id'] != null;
      this.initForm();
    });

  }

  private initForm() {
    if (this.isEdit) {
      this.patientService.findById(this.id).subscribe(data => this.form.patchValue(data));
    }
  }

  operate() {
    if (this.form.invalid) {
      return;
    }

    const patient: Patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];
    patient.firstName = this.form.value['firstName'];
    //const x = this.form.controls['firstName'].value;
    //const y = this.form.get('firstName').value;
    patient.lastName = this.form.value['lastName'];
    patient.dni = this.form.value['dni'];
    patient.address = this.form.value['address'];
    patient.phone = this.form.value['phone'];
    patient.email = this.form.value['email'];

    if (this.isEdit) {
      //UPDATE
      //PRACTICA COMUN, NO IDEAL
      this.patientService.update(this.id, patient).subscribe(() => {
        this.patientService.findAll().subscribe(data => {
          this.patientService.setPatientChange(data);
          this.patientService.setMessageChange('UPDATED SUCCESSFULLY');
          this.router.navigate(['/pages/patient']);
        });
      });
    } else {
      //SAVE
      this.patientService.save(patient)
        .pipe(
          switchMap(() => this.patientService.findAll()),
          tap(data => this.patientService.setPatientChange(data)),
          tap(() => this.patientService.setMessageChange('SAVED SUCCESSFULLY'))
        )
        .subscribe(() => {
          this.router.navigate(['/pages/patient']);
        });
    }
  }

  get f() {
    return this.form.controls;
  }
}
