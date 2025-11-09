import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GenericService } from './generic.service';
import { Specialty } from '../model/Specialty';

@Injectable({
  providedIn: 'root',
})
export class SpecialtyService extends GenericService<Specialty> {

  protected override url: string = `${environment.HOST}/v1/specialties`;

}
