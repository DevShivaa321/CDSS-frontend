// src/app/services/medical-history.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicalHistory } from '../models/medical-history.model';

@Injectable({ providedIn: 'root' })
export class MedicalHistoryService {

  private baseUrl = 'http://localhost:8081/medical-history';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MedicalHistory[]> {
    return this.http.get<MedicalHistory[]>(this.baseUrl);
  }

  getById(id: number): Observable<MedicalHistory> {
    return this.http.get<MedicalHistory>(`${this.baseUrl}/${id}`);
  }

  add(payload: Partial<MedicalHistory>): Observable<MedicalHistory> {
  return this.http.post<MedicalHistory>(this.baseUrl, payload);
}
}