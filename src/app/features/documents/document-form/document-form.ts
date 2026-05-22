import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DocumentService } from '../../../core/services/document.service';
import { NotificationService } from '../../../core/services/notification.service';

function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selectedDate = new Date(control.value);
  const now = new Date();
  now.setHours(0, 0, 0, 0); // compare dates only
  return selectedDate > now ? null : { futureDate: true };
}

@Component({
  selector: 'app-document-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './document-form.html',
  styleUrls: ['./document-form.css']
})
export class DocumentForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private documentService = inject(DocumentService);
  private notificationService = inject(NotificationService);
  private http = inject(HttpClient);

  documentForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    category: ['', Validators.required],
    fileUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
    departmentId: ['', Validators.required],
    expiryDate: ['', [Validators.required, futureDateValidator]]
  });

  isEditMode = false;
  documentId: string | null = null;
  isSubmitting = false;
  
  categories = ['Policy', 'Certificate', 'Contract', 'License'];
  departments: any[] = []; // Assuming { id, name } structure

  ngOnInit(): void {
    this.loadDepartments();
    this.documentId = this.route.snapshot.paramMap.get('id');
    if (this.documentId) {
      this.isEditMode = true;
      this.loadDocumentForEdit(this.documentId);
    }
  }

  loadDepartments(): void {
    this.http.get<any[]>('https://localhost:7123/api/departments').subscribe({
      next: (deps) => this.departments = deps,
      error: () => console.warn('Failed to load departments, form might be broken')
    });
  }

  loadDocumentForEdit(id: string): void {
    this.documentService.getDocument(id).subscribe({
      next: (doc) => {
        // Find department ID if doc has departmentName. This is tricky.
        // Assuming the getDocument returns document details. The form needs departmentId.
        // For now, if the API doesn't return departmentId, we'll patch what we can.
        this.documentForm.patchValue({
          title: doc.title,
          category: doc.category,
          fileUrl: doc.fileUrl,
          // document object has departmentName, not departmentId in the interface,
          // but we'll assume the real API returns departmentId or we can match it.
          // Since we don't have it explicitly, we'll leave it empty unless matched.
          departmentId: this.departments.find(d => d.name === doc.departmentName)?.id || '',
          expiryDate: doc.expiryDate ? new Date(doc.expiryDate).toISOString().substring(0, 10) : ''
        });
      },
      error: () => this.notificationService.showError('Failed to load document for edit')
    });
  }

  onSubmit(): void {
    if (this.documentForm.invalid) {
      this.documentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.documentForm.value;
    
    // Construct payload
    const payload = {
      title: formValue.title!,
      category: formValue.category!,
      fileUrl: formValue.fileUrl!,
      departmentId: formValue.departmentId!,
      expiryDate: new Date(formValue.expiryDate!).toISOString()
    };

    if (this.isEditMode && this.documentId) {
      this.documentService.updateDocument(this.documentId, payload).subscribe({
        next: () => {
          this.notificationService.showSuccess('Document updated successfully');
          this.router.navigate(['/documents', this.documentId]);
        },
        error: () => {
          this.notificationService.showError('Failed to update document');
          this.isSubmitting = false;
        }
      });
    } else {
      this.documentService.createDocument(payload).subscribe({
        next: () => {
          this.notificationService.showSuccess('Document created successfully');
          this.router.navigate(['/documents']);
        },
        error: () => {
          this.notificationService.showError('Failed to create document');
          this.isSubmitting = false;
        }
      });
    }
  }

  // Helper for template
  get f() { return this.documentForm.controls; }
}
