import { useState } from 'react';
import type { FormData, ValidationErrors } from '../types';
import { validate, hasErrors } from '../lib/validation';
import { generatePdf } from '../lib/generatePdf';
import { formatFileDate } from '../lib/date';
import FoodItemsForm from './FoodItemsForm';
import './SaijiForm.css';

const STORAGE_KEY = 'saiji-form-data';

const initialData: FormData = {
  noticeDate: new Date().toISOString().split('T')[0],
  applicantAddress: '宇都宮市上籠谷町3776 星の杜中学校・高等学校',
  companyName: '星の杜中学校・高等学校 保護者の会',
  representativeTitle: '会長',
  representativeName: '平野 明宏',
  eventPlace: '宇都宮市上籠谷町3776 星の杜中学校・高等学校 調理室',
  eventName: '星の杜食堂',
  foodSummary: '裏面一覧表のとおり',
  startDateTime: '2025-10-15T09:00',
  endDateTime: '2025-10-15T15:00',
  managerName: '平野 明宏',
  managerAddress: '宇都宮市上籠谷町3776 星の杜中学校・高等学校',
  managerTel: '028-667-0700',
  confirmNotes: true,
  listNo: '1',
  foodItems: [
    { name: 'カレーライス', quantity: '200' },
  ],
  fontFamily: 'gothic',
};

function loadSavedData(): FormData {
  try {
    const today = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : {};
    return {
      ...initialData,
      ...saved,
      noticeDate: today,
      startDateTime: `${today}T09:00`,
      endDateTime: `${today}T15:00`,
    };
  } catch {
    return initialData;
  }
}

export default function SaijiForm() {
  const [data, setData] = useState<FormData>(loadSavedData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(data);
    if (hasErrors(errs)) {
      setErrors(errs);
      const firstError = document.querySelector('.field-error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setGenerating(true);
    setGenError(null);
    try {
      const bytes = await generatePdf(data);
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `催事届_${formatFileDate(data.noticeDate)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'PDF生成に失敗しました');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* フォント選択 */}
      <section className="form-section">
        <h2 className="section-title">フォント</h2>
        <div className="field-row">
          <label className="field-label">書体</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="fontFamily"
                value="gothic"
                checked={data.fontFamily === 'gothic'}
                onChange={() => set('fontFamily', 'gothic')}
              />
              ゴシック体（Noto Sans JP）
            </label>
            <label>
              <input
                type="radio"
                name="fontFamily"
                value="mincho"
                checked={data.fontFamily === 'mincho'}
                onChange={() => set('fontFamily', 'mincho')}
              />
              明朝体（Noto Serif JP）
            </label>
          </div>
        </div>
      </section>

      {/* 届出日 */}
      <section className="form-section">
        <h2 className="section-title">届出日</h2>
        <div className="field-row">
          <label className="field-label" htmlFor="noticeDate">届出日 <span className="required">*</span></label>
          <div className="field-input">
            <input
              id="noticeDate"
              type="date"
              value={data.noticeDate}
              onChange={(e) => set('noticeDate', e.target.value)}
              className={errors['noticeDate'] ? 'input-error' : ''}
            />
            {errors['noticeDate'] && <p className="field-error">{errors['noticeDate']}</p>}
          </div>
        </div>
      </section>

      {/* 届出者情報 */}
      <section className="form-section">
        <h2 className="section-title">届出者情報</h2>

        <div className="field-row">
          <label className="field-label" htmlFor="applicantAddress">住所・所在地 <span className="required">*</span></label>
          <div className="field-input">
            <textarea
              id="applicantAddress"
              value={data.applicantAddress}
              onChange={(e) => set('applicantAddress', e.target.value)}
              rows={2}
              placeholder="宇都宮市〇〇町..."
              className={errors['applicantAddress'] ? 'input-error' : ''}
            />
            {errors['applicantAddress'] && <p className="field-error">{errors['applicantAddress']}</p>}
          </div>
        </div>

        <div className="field-row">
          <label className="field-label" htmlFor="companyName">法人名・氏名 <span className="required">*</span></label>
          <div className="field-input">
            <input
              id="companyName"
              type="text"
              value={data.companyName}
              onChange={(e) => set('companyName', e.target.value)}
              placeholder="（株）〇〇 または 山田太郎"
              className={errors['companyName'] ? 'input-error' : ''}
            />
            {errors['companyName'] && <p className="field-error">{errors['companyName']}</p>}
          </div>
        </div>

        <div className="field-row">
          <label className="field-label" htmlFor="representativeTitle">代表者役職 <span className="required">*</span></label>
          <div className="field-input">
            <input
              id="representativeTitle"
              type="text"
              value={data.representativeTitle}
              onChange={(e) => set('representativeTitle', e.target.value)}
              placeholder="代表取締役（法人の場合）"
              className={errors['representativeTitle'] ? 'input-error' : ''}
            />
            {errors['representativeTitle'] && <p className="field-error">{errors['representativeTitle']}</p>}
          </div>
        </div>

        <div className="field-row">
          <label className="field-label" htmlFor="representativeName">代表者名 <span className="required">*</span></label>
          <div className="field-input">
            <input
              id="representativeName"
              type="text"
              value={data.representativeName}
              onChange={(e) => set('representativeName', e.target.value)}
              placeholder="氏名（法人の場合）"
              className={errors['representativeName'] ? 'input-error' : ''}
            />
            {errors['representativeName'] && <p className="field-error">{errors['representativeName']}</p>}
          </div>
        </div>
      </section>

      {/* 催事情報 */}
      <section className="form-section">
        <h2 className="section-title">催事情報</h2>

        <div className="field-row">
          <label className="field-label" htmlFor="eventPlace">催事開催場所 <span className="required">*</span></label>
          <div className="field-input">
            <textarea
              id="eventPlace"
              value={data.eventPlace}
              onChange={(e) => set('eventPlace', e.target.value)}
              rows={2}
              placeholder="宇都宮市〇〇町..."
              className={errors['eventPlace'] ? 'input-error' : ''}
            />
            {errors['eventPlace'] && <p className="field-error">{errors['eventPlace']}</p>}
          </div>
        </div>

        <div className="field-row">
          <label className="field-label" htmlFor="eventName">催事の名称 <span className="required">*</span></label>
          <div className="field-input">
            <input
              id="eventName"
              type="text"
              value={data.eventName}
              onChange={(e) => set('eventName', e.target.value)}
              placeholder="〇〇まつり"
              className={errors['eventName'] ? 'input-error' : ''}
            />
            {errors['eventName'] && <p className="field-error">{errors['eventName']}</p>}
          </div>
        </div>

        <div className="field-row">
          <label className="field-label" htmlFor="foodSummary">取扱食品 <span className="required">*</span></label>
          <div className="field-input">
            <input
              id="foodSummary"
              type="text"
              value={data.foodSummary}
              onChange={(e) => set('foodSummary', e.target.value)}
              placeholder="裏面一覧表のとおり"
              className={errors['foodSummary'] ? 'input-error' : ''}
            />
            {errors['foodSummary'] && <p className="field-error">{errors['foodSummary']}</p>}
          </div>
        </div>
      </section>

      {/* 開催期間 */}
      <section className="form-section">
        <h2 className="section-title">開催期間</h2>

        <div className="field-row">
          <label className="field-label" htmlFor="startDateTime">開始日時 <span className="required">*</span></label>
          <div className="field-input">
            <input
              id="startDateTime"
              type="datetime-local"
              value={data.startDateTime}
              onChange={(e) => set('startDateTime', e.target.value)}
              className={errors['startDateTime'] ? 'input-error' : ''}
            />
            {errors['startDateTime'] && <p className="field-error">{errors['startDateTime']}</p>}
          </div>
        </div>

        <div className="field-row">
          <label className="field-label" htmlFor="endDateTime">終了日時 <span className="required">*</span></label>
          <div className="field-input">
            <input
              id="endDateTime"
              type="datetime-local"
              value={data.endDateTime}
              onChange={(e) => set('endDateTime', e.target.value)}
              className={errors['endDateTime'] ? 'input-error' : ''}
            />
            {errors['endDateTime'] && <p className="field-error">{errors['endDateTime']}</p>}
          </div>
        </div>
      </section>

      {/* 取扱責任者 */}
      <section className="form-section">
        <h2 className="section-title">取扱責任者（現場責任者）</h2>

        <div className="field-row">
          <label className="field-label" htmlFor="managerName">氏名 <span className="required">*</span></label>
          <div className="field-input">
            <input
              id="managerName"
              type="text"
              value={data.managerName}
              onChange={(e) => set('managerName', e.target.value)}
              className={errors['managerName'] ? 'input-error' : ''}
            />
            {errors['managerName'] && <p className="field-error">{errors['managerName']}</p>}
          </div>
        </div>

        <div className="field-row">
          <label className="field-label" htmlFor="managerAddress">住所 <span className="required">*</span></label>
          <div className="field-input">
            <input
              id="managerAddress"
              type="text"
              value={data.managerAddress}
              onChange={(e) => set('managerAddress', e.target.value)}
              className={errors['managerAddress'] ? 'input-error' : ''}
            />
            {errors['managerAddress'] && <p className="field-error">{errors['managerAddress']}</p>}
          </div>
        </div>

        <div className="field-row">
          <label className="field-label" htmlFor="managerTel">電話番号 <span className="required">*</span></label>
          <div className="field-input">
            <input
              id="managerTel"
              type="tel"
              value={data.managerTel}
              onChange={(e) => set('managerTel', e.target.value)}
              placeholder="028-000-0000"
              className={errors['managerTel'] ? 'input-error' : ''}
            />
            {errors['managerTel'] && <p className="field-error">{errors['managerTel']}</p>}
          </div>
        </div>
      </section>

      {/* 注意事項確認 */}
      <section className="form-section">
        <h2 className="section-title">注意事項確認</h2>
        <div className="field-row">
          <div className="field-input">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.confirmNotes}
                onChange={(e) => set('confirmNotes', e.target.checked)}
                className={errors['confirmNotes'] ? 'input-error' : ''}
              />
              注意文書の内容を理解し、この範囲内で催事を実施する
            </label>
            {errors['confirmNotes'] && <p className="field-error">{errors['confirmNotes']}</p>}
          </div>
        </div>
      </section>

      {/* 取扱食品一覧 */}
      <section className="form-section">
        <h2 className="section-title">取扱食品一覧</h2>

        <div className="field-row">
          <label className="field-label" htmlFor="listNo">一覧表 No.</label>
          <div className="field-input field-input--short">
            <input
              id="listNo"
              type="text"
              value={data.listNo}
              onChange={(e) => set('listNo', e.target.value)}
              placeholder="1"
            />
          </div>
        </div>

        <FoodItemsForm
          items={data.foodItems}
          errors={errors}
          onChange={(items) => set('foodItems', items)}
        />
      </section>

      {genError && (
        <div className="gen-error">
          <strong>エラー:</strong> {genError}
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn-submit" disabled={generating}>
          {generating ? 'PDF生成中...' : 'PDFをダウンロード'}
        </button>
      </div>

    </form>
  );
}
