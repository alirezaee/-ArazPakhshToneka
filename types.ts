export interface EducationRecord {
  id: string;
  degree: string;
  major: string;
  gpa: string;
  endDate: string;
  universityType: string;
  instituteName: string;
  city: string;
}

export interface WorkExperience {
  id: string;
  organization: string;
  role: string;
  duration: string;
  endDate: string;
  phone: string;
  salary: string;
  reasonForLeaving: string;
}

export interface TrainingCourse {
  id: string;
  name: string;
  institute: string;
  duration: string;
  startDate: string;
  hasCertificate: boolean;
  description: string;
}

export interface Guarantor {
  id: string;
  name: string;
  relation: string;
  job: string;
  address: string;
  phone: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  gender: string;
  relation: string;
  job: string;
  birthDate: string;
  nationalId: string;
  phone: string;
}

export interface FormData {
  // Job
  targetJobTitle: string;

  // Personal Info
  firstName: string;
  lastName: string;
  fatherName: string;
  idNumber: string; // Shomare Shenasname
  birthDate: string;
  nationalId: string; // Code Melli
  issuePlace: string;
  birthPlace: string;
  religion: string;
  maritalStatus: 'single' | 'married' | 'divorced';
  childrenCountDaughter: string;
  childrenCountSon: string;
  healthStatus: 'healthy' | 'unhealthy';
  bloodType: string;
  medicalConditionDescription: string;
  medicationDescription: string;
  medicalHistory: string;
  surgeryHistory: string;

  // Military
  militaryStatus: 'done' | 'not_done' | 'exempt';
  exemptionReason: string;

  // Education
  educationHistory: EducationRecord[];

  // Work
  workHistory: WorkExperience[];

  // Legal/Habits
  criminalRecord: boolean;
  criminalRecordDesc: string;
  smokingDrugs: boolean;

  // Skills
  langEnglishRead: 'weak' | 'medium' | 'good' | 'excellent';
  langEnglishWrite: 'weak' | 'medium' | 'good' | 'excellent';
  langEnglishSpeak: 'weak' | 'medium' | 'good' | 'excellent';
  computerSkills: {
    word: boolean;
    excel: boolean;
    access: boolean;
    powerpoint: boolean;
    internet: boolean;
    type: boolean;
    windows: boolean;
    other: boolean;
  };
  trainingCourses: TrainingCourse[];

  // Job Preferences
  jobTypes: {
    admin: boolean;
    phoneSales: boolean;
    fieldSales: boolean;
    distributor: boolean;
    finance: boolean;
    secretary: boolean;
    service: boolean;
    warehouse: boolean;
    anything: boolean;
    driver: boolean;
  };
  driverLicenseType: string;
  relevantDocs: string;

  // Cooperation Type
  cooperationType: 'full_time' | 'part_time' | 'remote';
  canOvertime: boolean;
  overtimeHours: string;
  canWeekends: boolean;

  // Personality
  teamwork: 'good' | 'medium' | 'weak';
  interests: string;
  personalChallenges: boolean;
  personalChallengesDesc: string;
  introvertExtrovert: string;
  uniqueTraits: string;

  // Marketing Area
  marketingInterest: {
    b2b: boolean;
    retail: boolean;
    restaurant: boolean;
    advertising: boolean;
    internet: boolean;
  };
  canWorkAllZones: boolean;
  restrictedZonesDesc: string;

  // Insurance
  hasInsuranceHistory: boolean;
  insuranceYears: string;
  insuranceNumber: string;

  // Intro
  howDidYouFindUs: string;

  // Guarantors
  guarantors: Guarantor[];
  guaranteeType: 'promissory_govt' | 'promissory_market' | 'other';
  guaranteeTypeOther: string;

  // Current Status
  currentlyEmployed: boolean;
  currentEmploymentDesc: string;

  // Relocation
  willingToRelocate: boolean;

  // Salary
  expectedSalary: string;
  salaryPreference: 'fixed' | 'commission' | 'mixed';

  // Family
  isHeadOfHousehold: boolean;
  familyMembers: FamilyMember[];

  // Address
  homeType: 'owned' | 'rented' | 'parents' | 'other';
  address: string;
  postalCode: string;
  phoneFixed: string;
  mobile: string;
  phoneEmergency: string;
}
