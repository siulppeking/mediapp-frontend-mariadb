import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Patient } from '../model/Patient';
import { GenericService } from './generic.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService extends GenericService<Patient> {

  protected override url: string = `${environment.HOST}/v1/patients`;
  private patientChange: Subject<Patient[]> = new Subject<Patient[]>();
  private messageChange: Subject<string> = new Subject<string>();

  // get y set
  getPatientChange() {
    return this.patientChange.asObservable();
  }

  setPatientChange(data: Patient[]) {
    this.patientChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

}
