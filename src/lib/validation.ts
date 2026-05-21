import type { FormData, ValidationErrors } from '../types';

export function validate(data: FormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.noticeDate) errors['noticeDate'] = '届出日を入力してください';
  if (!data.applicantAddress.trim()) errors['applicantAddress'] = '住所を入力してください';
  if (!data.companyName.trim()) errors['companyName'] = '法人名・氏名を入力してください';
  if (!data.representativeTitle.trim()) errors['representativeTitle'] = '代表者役職を入力してください';
  if (!data.representativeName.trim()) errors['representativeName'] = '代表者名を入力してください';
  if (!data.eventPlace.trim()) errors['eventPlace'] = '催事開催場所を入力してください';
  if (!data.eventName.trim()) errors['eventName'] = '催事の名称を入力してください';
  if (!data.foodSummary.trim()) errors['foodSummary'] = '取扱食品を入力してください';
  if (!data.startDateTime) errors['startDateTime'] = '開催開始日時を入力してください';
  if (!data.endDateTime) errors['endDateTime'] = '開催終了日時を入力してください';
  if (
    data.startDateTime &&
    data.endDateTime &&
    data.startDateTime >= data.endDateTime
  ) {
    errors['endDateTime'] = '終了日時は開始日時より後にしてください';
  }
  if (!data.managerName.trim()) errors['managerName'] = '取扱責任者氏名を入力してください';
  if (!data.managerAddress.trim()) errors['managerAddress'] = '取扱責任者住所を入力してください';
  if (!data.managerTel.trim()) errors['managerTel'] = '電話番号を入力してください';
  if (!data.confirmNotes) errors['confirmNotes'] = '注意事項を確認してチェックしてください';

  if (!data.foodItems[0]?.name.trim()) errors['foodItems[0].name'] = '食品名を入力してください';
  if (!data.foodItems[0]?.quantity.trim()) errors['foodItems[0].quantity'] = '予定食数を入力してください';

  data.foodItems.slice(1).forEach((item, i) => {
    const idx = i + 1;
    if (item.name.trim() && !item.quantity.trim()) {
      errors[`foodItems[${idx}].quantity`] = `食品${idx + 1}の予定食数を入力してください`;
    }
    if (!item.name.trim() && item.quantity.trim()) {
      errors[`foodItems[${idx}].name`] = `食品${idx + 1}の食品名を入力してください`;
    }
  });

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
