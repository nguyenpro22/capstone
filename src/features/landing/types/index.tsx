export interface IClinicRegistrationRequest {
  Name: string;
  Email: string;
  PhoneNumber: string;
  Address: string;
  TaxCode: string;
  BusinessLicense: string;
  OperatingLicense: string;
  OperatingLicenseExpiryDate: string;
  ProfilePictureUrl: string;
}
export interface SurveyItem {
  id: string;
  name: string;
  description: string;
  categoryName: string | null;
  questions: SurveyQuestion[];
}

export interface SurveyQuestion {
  id: string;
  question: string;
  questionType: string;
  options: SurveyOption[];
}

export interface SurveyOption {
  option: string;
}
export interface SubmitSurveyAnswerPayload {
  surveyId: string;
  surveyAnswers: {
    answer: string;
    surveyQuestionId: string;
  }[];
}
