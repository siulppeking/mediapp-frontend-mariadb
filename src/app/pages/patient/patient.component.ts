import { Component, inject } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../model/Patient';

@Component({
  selector: 'app-patient',
  imports: [],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css',
})
export class PatientComponent {

  private readonly patientService = inject(PatientService);

  protected patients: Patient[] = [];

  ngOnInit(): void {
    this.patientService.findAllPatients().subscribe(data => {
      console.log(data);

      this.patients = data;
    })
  }

} 