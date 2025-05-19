export type DocumentType = "pan" | "aadhar" | "bankStatement" | "form16" | "itr" | "propertyDeed"

export enum LoanType {
  PERSONAL = "Personal Loan",
  HOME = "Home Loan",
  AUTO = "Auto Loan",
  BUSINESS = "Business Loan",
  EDUCATION = "Education Loan",
}

export interface PersonalDetails {
  pan?: string
  aadhar?: string
  address?: string
  phone?: string
  email?: string
  occupation?: string
  employer?: string
  fatherName?: string
  dob?: string
}

export interface Expenses {
  housing: number
  transportation: number
  food: number
  entertainment: number
}

export interface ApplicantDetails {
  dti?: number | null
  income?: number
  debt?: number
  loanAmount?: number
  expenses?: Expenses
  verified?: boolean
  personalDetails?: PersonalDetails
  kycStatus?: string
  remarks?: string
  applicationDate?: string
  loanType?: string
  proposalAmount?: number
  consentGiven?: boolean
  id?: string
  createdAt?: string
  bankerId?: number | string
  kyc_status?: boolean
  dtiStatus?: boolean
  status?: string
  approved_amount?: number
  predicted_amount?: number
  full_name?: string
  pan_number?: string
  loan_type?: string
  proposed_amount?: number | string
}

export interface ApplicantData {
  [key: string]: ApplicantDetails
}

export interface DocumentState {
  pan: boolean
  aadhar: boolean
  bankStatement: boolean
  form16: boolean
  itr: boolean
  propertyDeed?: boolean
}

export interface FileNameState {
  pan: string
  aadhar: string
  bankStatement: string
  form16: string
  itr: string
  propertyDeed?: string
}

export interface NewApplicationState {
  full_name: string
  father_name: string
  pan_number: string
  mobile: string
  dob: string
  loan_type: string
  proposal_amount: string | number
  banker_id: number | null
  consent: boolean
  documents: DocumentState
  fileNames: FileNameState
  address?: string
  email?: string
  occupation?: string
  employer?: string
}

export interface LoanCalculationParams {
  annual_interest_rate: number
  tenure_months: number
  loan_affordability_ratio: number
}

export interface LoanCalculationResult {
  max_loan_amount: number
  monthly_emi: number
  total_interest: number
  total_payment: number
  monthly_income: number
  monthly_expenses: number
  disposable_income: number
  affordable_emi: number
}
