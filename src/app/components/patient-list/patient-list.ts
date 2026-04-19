import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService, Patient } from '../../services/patient';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule,
    DialogModule, InputTextModule, SelectModule, ToastModule,
    ConfirmDialogModule, TagModule, CardModule, ToolbarModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './patient-list.html',
  styleUrls: ['./patient-list.css']
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  displayDialog = false;
  isEditMode = false;
  loading = true;

  selectedPatient: Patient = this.emptyPatient();

  genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
];

  constructor(
    private patientService: PatientService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

 emptyPatient(): Patient {
  return { firstName: '', lastName: '', dateOfBirth: '', gender: '' };
}

  loadPatients(): void {
    this.loading = true;
    this.patientService.getAllPatients().subscribe({
      next: (data) => { this.patients = data; this.loading = false; },
      error: () => {
        this.messageService.add({
          severity: 'error', summary: 'Error', detail: 'Failed to load patients'
        });
        this.loading = false;
      }
    });
  }

  openAddDialog(): void {
    this.selectedPatient = this.emptyPatient();
    this.isEditMode = false;
    this.displayDialog = true;
  }

  openEditDialog(patient: Patient): void {
    this.selectedPatient = { ...patient };
    this.isEditMode = true;
    this.displayDialog = true;
  }

  savePatient(): void {
  if (this.isEditMode && this.selectedPatient.patientId) {
    this.patientService.updatePatient(this.selectedPatient.patientId, this.selectedPatient).subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Patient updated successfully' 
        });
        this.loadPatients();
        this.displayDialog = false;
      },
      error: () => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Failed to update patient' 
        });
      }
    });
  } else {
    this.patientService.addPatient(this.selectedPatient).subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Patient added successfully' 
        });
        this.loadPatients();
        this.displayDialog = false;
      },
      error: () => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Failed to add patient' 
        });
      }
    });
  }
}

confirmDelete(patient: Patient): void {
  this.confirmationService.confirm({
    message: `Are you sure you want to delete "${patient.firstName} ${patient.lastName}"?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.patientService.deletePatient(patient.patientId!).subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Deleted', 
            detail: `${patient.firstName} ${patient.lastName} removed successfully` 
          });
          this.loadPatients();
        },
        error: () => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'Failed to delete patient' 
          });
        }
      });
    }
  });
}
}