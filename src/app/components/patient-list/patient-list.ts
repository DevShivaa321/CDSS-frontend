import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService, Patient } from '../../models/patient.model';

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

import { MedicalHistoryService } from '../../services/medical-history.service';
import { MedicalHistory } from '../../models/medical-history.model';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule,
    CardModule,
    ToolbarModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './patient-list.html',
  styleUrls: ['./patient-list.css'],
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  displayDialog = false;
  isEditMode = false;
  loading = true;
  searchQuery: string = '';
  allPatients: Patient[] = [];

  // --- medical history ---
  displayHistoryDialog: boolean = false;
  patientHistories: MedicalHistory[] = [];
  loadingHistory: boolean = false;
  addingHistory: boolean = false;
  newSugarLevel: number = 0;
  newHasDiabetes: boolean = false;

  selectedPatient: Patient = this.emptyPatient();

  genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  constructor(
    private patientService: PatientService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    
    private medicalHistoryService: MedicalHistoryService  
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
      next: (data) => {
        this.patients = data;
        this.allPatients = data; // keep a full copy
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load patients',
        });
        this.loading = false;
      },
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
      this.patientService
        .updatePatient(this.selectedPatient.patientId, this.selectedPatient)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Patient updated successfully',
            });
            this.displayDialog = false;
            setTimeout(() => this.loadPatients(), 100);
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update patient',
            });
          },
        });
    } else {
      this.patientService.addPatient(this.selectedPatient).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Patient added successfully',
          });
          this.displayDialog = false;
          setTimeout(() => this.loadPatients(), 100);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add patient',
          });
        },
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
              detail: `${patient.firstName} removed successfully`,
            });
            setTimeout(() => this.loadPatients(), 100);
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete patient',
            });
          },
        });
      },
    });
  }
  viewPatient(id: number): void {
    this.patientService.getPatientById(id).subscribe({
      next: (data) => {
        this.selectedPatient = data;
        this.isEditMode = false;
        this.displayDialog = true;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch patient details',
        });
      },
    });
  }

  searchPatients(): void {
    if (!this.searchQuery.trim()) {
      this.patients = this.allPatients;
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();

    // Search by ID if query is a number
    if (!isNaN(Number(query))) {
      this.patients = this.allPatients.filter((p) => p.patientId === Number(query));
    } else {
      // Search by name
      this.patients = this.allPatients.filter(
        (p) =>
          p.firstName.toLowerCase().includes(query) || p.lastName.toLowerCase().includes(query),
      );
    }

    if (this.patients.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Results',
        detail: `No patients found for "${this.searchQuery}"`,
      });
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.patients = this.allPatients;
  }
  
  openHistoryDialog(patient: any) {
  this.selectedPatient = patient;
  this.displayHistoryDialog = true;
  this.loadHistory();
}

loadHistory() {
  this.loadingHistory = true;
  this.medicalHistoryService.getAll().subscribe({
    next: (data) => {
      this.patientHistories = data.filter(
        h => h.patientId === this.selectedPatient.patientId
      );
      this.loadingHistory = false;
    },
    error: () => this.loadingHistory = false
  });
}

addHistory() {
  if (!this.newSugarLevel) return;
  this.addingHistory = true;

  const payload = {
    patientId: this.selectedPatient.patientId,
    sugarLevel: this.newSugarLevel,
    hasDiabetes: this.newHasDiabetes
  };

  this.medicalHistoryService.add(payload).subscribe({
    next: () => {
      this.newSugarLevel = 0;
      this.newHasDiabetes = false;
      this.addingHistory = false;
      this.loadHistory();       // refresh the table after adding
    },
    error: () => this.addingHistory = false
  });
}

}
