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
  return this.http.post(
    this.apiUrl, 
    patient, 
    { responseType: 'text' }
  );
}

updatePatient(id: number, patient: Patient): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/${id}`, 
    patient, 
    { responseType: 'text' }
  );
}

deletePatient(id: number): Observable<any> {
  return this.http.delete(
    `${this.apiUrl}/${id}`, 
    { responseType: 'text' }
  );
}

getPatientById(id: number): Observable<Patient> {
  return this.http.get<Patient>(`${this.apiUrl}/${id}`);
}

searchPatients(name: string): Observable<Patient[]> {
  return this.http.get<Patient[]>(`${this.apiUrl}/search?name=${name}`);
}

}