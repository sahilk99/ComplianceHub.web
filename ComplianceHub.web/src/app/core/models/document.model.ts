export type DocumentStatus = "Compliant" | "ExpiringSoon" | "Overdue" | "UnderReview";

export interface Document {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  uploadedByName: string;
  departmentName: string;
  expiryDate: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocument {
  title: string;
  category: string;
  fileUrl: string;
  departmentId: string;
  expiryDate: string;
}
