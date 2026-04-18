import { Routes } from '@angular/router';
import { PatientListComponent } from './components/patient-list/patient-list';

export const routes: Routes = [
  { path: '', redirectTo: 'patients', pathMatch: 'full' },
  { path: 'patients', component: PatientListComponent }
];