export interface FoodItem {
  name: string;
  quantity: string;
}

export type FontFamily = 'gothic' | 'mincho';

export interface FormData {
  noticeDate: string;
  applicantAddress: string;
  companyName: string;
  representativeTitle: string;
  representativeName: string;
  eventPlace: string;
  eventName: string;
  foodSummary: string;
  startDateTime: string;
  endDateTime: string;
  managerName: string;
  managerAddress: string;
  managerTel: string;
  confirmNotes: boolean;
  listNo: string;
  foodItems: FoodItem[];
  fontFamily: FontFamily;
}

export interface ValidationErrors {
  [key: string]: string;
}
