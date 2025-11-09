import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Medic } from '../model/Medic';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MedicService extends GenericService<Medic> {

  protected override url: string = `${environment.HOST}/v1/medics`;
  private medicChange: Subject<Medic[]> = new Subject<Medic[]>();
  private messageChange: Subject<string> = new Subject<string>();

  getMedicChange() {
    return this.medicChange.asObservable();
  }

  setMedicChange(medics: Medic[]) {
    this.medicChange.next(medics);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

  setMessageChange(message: string) {
    this.messageChange.next(message);
  }
}
