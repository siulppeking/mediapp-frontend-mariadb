import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Patient } from '../model/Patient';

@Injectable({
  providedIn: 'root',
})
export class PatientService {

  private url: string = environment.HOST + '/v1/patients';

  private http = inject(HttpClient);

  findAllPatients() {
    return this.http.get<Patient[]>(this.url);
  }

}
