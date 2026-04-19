import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Patient {
  patientId?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = 'http://localhost:8081/patients';

  constructor(private http: HttpClient) {}

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  addPatient(patient: Patient): Observable<any> {
  return this.http.post<any>(this.apiUrl, patient);
}

updatePatient(id: number, patient: Patient): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${id}`, patient);
}

deletePatient(id: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/${id}`);
}
}