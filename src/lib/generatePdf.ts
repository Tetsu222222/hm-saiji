import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import type { FormData } from '../types';
import { parseDateParts, parseDateTimeParts } from './date';
import { saijiFieldMap, FONT_PATHS } from './pdfFields';

type PDFPage = Awaited<ReturnType<PDFDocument['addPage']>>;
type PDFFont = Awaited<ReturnType<PDFDocument['embedFont']>>;

async function fetchBytes(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`読み込み失敗: ${url} (${res.status})`);
  return res.arrayBuffer();
}

function wrapText(
  text: string,
  maxWidth: number,
  size: number,
  font: PDFFont
): string[] {
  const chars = [...text];
  const lines: string[] = [];
  let current = '';

  for (const char of chars) {
    const test = current + char;
    if (font.widthOfTextAtSize(test, size) <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = char;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  size: number,
  font: PDFFont
): void {
  page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) });
}

function drawCenteredText(
  page: PDFPage,
  text: string,
  centerX: number,
  y: number,
  size: number,
  maxWidth: number,
  font: PDFFont
): void {
  const textWidth = font.widthOfTextAtSize(text, size);
  const x = centerX + (maxWidth - textWidth) / 2;
  drawText(page, text, x, y, size, font);
}

function drawWrappedText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  size: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
  font: PDFFont
): void {
  const lines = wrapText(text, maxWidth, size, font);
  lines.slice(0, maxLines).forEach((line, i) => {
    drawText(page, line, x, y - i * lineHeight, size, font);
  });
}

export async function generatePdf(data: FormData): Promise<Uint8Array> {
  const [templateBytes, fontBytes] = await Promise.all([
    fetchBytes('/saiji.pdf'),
    fetchBytes(FONT_PATHS[data.fontFamily]),
  ]);

  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(fontBytes);

  const pages = pdfDoc.getPages();
  const page1 = pages[0];
  const page2 = pages[1];

  if (!page1 || !page2) throw new Error('テンプレートPDFのページ数が不足しています');

  const m1 = saijiFieldMap.page1;
  const m2 = saijiFieldMap.page2;

  // 届出日
  const date = parseDateParts(data.noticeDate);
  drawText(page1, date.eraYear, m1.noticeDate.eraYear.x, m1.noticeDate.eraYear.y, m1.noticeDate.eraYear.size, font);
  drawText(page1, date.month, m1.noticeDate.month.x, m1.noticeDate.month.y, m1.noticeDate.month.size, font);
  drawText(page1, date.day, m1.noticeDate.day.x, m1.noticeDate.day.y, m1.noticeDate.day.size, font);

  // 住所・所在地
  drawWrappedText(
    page1, data.applicantAddress,
    m1.applicantAddress.x, m1.applicantAddress.y,
    m1.applicantAddress.size, m1.applicantAddress.maxWidth,
    m1.applicantAddress.lineHeight, m1.applicantAddress.maxLines,
    font
  );

  // 法人名・氏名
  drawText(page1, data.companyName, m1.applicantNameBlock.companyName.x, m1.applicantNameBlock.companyName.y, m1.applicantNameBlock.companyName.size, font);

  // 代表者役職・名前
  const repParts = [data.representativeTitle, data.representativeName].filter(Boolean);
  if (repParts.length > 0) {
    drawText(page1, repParts.join('　'), m1.applicantNameBlock.representative.x, m1.applicantNameBlock.representative.y, m1.applicantNameBlock.representative.size, font);
  }

  // 催事開催場所
  drawWrappedText(
    page1, data.eventPlace,
    m1.eventPlace.x, m1.eventPlace.y,
    m1.eventPlace.size, m1.eventPlace.maxWidth,
    m1.eventPlace.lineHeight, m1.eventPlace.maxLines,
    font
  );

  // 催事の名称
  drawText(page1, data.eventName, m1.eventName.x, m1.eventName.y, m1.eventName.size, font);

  // 取扱食品（デフォルトテキストはテンプレートに印刷済みのため重複回避）
  const foodSummaryText = data.foodSummary.trim();
  if (foodSummaryText && foodSummaryText !== m1.foodSummary.defaultText) {
    drawText(page1, foodSummaryText, m1.foodSummary.x, m1.foodSummary.y, m1.foodSummary.size, font);
  }

  // 開催期間 開始
  const start = parseDateTimeParts(data.startDateTime);
  drawText(page1, start.eraYear, m1.startDateTime.eraYear.x, m1.startDateTime.eraYear.y, m1.startDateTime.eraYear.size, font);
  drawText(page1, start.month, m1.startDateTime.month.x, m1.startDateTime.month.y, m1.startDateTime.month.size, font);
  drawText(page1, start.day, m1.startDateTime.day.x, m1.startDateTime.day.y, m1.startDateTime.day.size, font);
  drawText(page1, start.hour, m1.startDateTime.hour.x, m1.startDateTime.hour.y, m1.startDateTime.hour.size, font);
  drawText(page1, start.minute, m1.startDateTime.minute.x, m1.startDateTime.minute.y, m1.startDateTime.minute.size, font);

  // 開催期間 終了
  const end = parseDateTimeParts(data.endDateTime);
  drawText(page1, end.eraYear, m1.endDateTime.eraYear.x, m1.endDateTime.eraYear.y, m1.endDateTime.eraYear.size, font);
  drawText(page1, end.month, m1.endDateTime.month.x, m1.endDateTime.month.y, m1.endDateTime.month.size, font);
  drawText(page1, end.day, m1.endDateTime.day.x, m1.endDateTime.day.y, m1.endDateTime.day.size, font);
  drawText(page1, end.hour, m1.endDateTime.hour.x, m1.endDateTime.hour.y, m1.endDateTime.hour.size, font);
  drawText(page1, end.minute, m1.endDateTime.minute.x, m1.endDateTime.minute.y, m1.endDateTime.minute.size, font);

  // 取扱責任者
  drawText(page1, data.managerName, m1.manager.name.x, m1.manager.name.y, m1.manager.name.size, font);
  drawWrappedText(
    page1, data.managerAddress,
    m1.manager.address.x, m1.manager.address.y,
    m1.manager.address.size, m1.manager.address.maxWidth,
    14, 1,
    font
  );
  drawText(page1, data.managerTel, m1.manager.tel.x, m1.manager.tel.y, m1.manager.tel.size, font);

  // 注意事項チェック
  if (data.confirmNotes) {
    drawText(page1, m1.confirmNotes.check.text, m1.confirmNotes.check.x, m1.confirmNotes.check.y, m1.confirmNotes.check.size, font);
  }

  // ページ2: 一覧表No.
  if (data.listNo.trim()) {
    drawText(page2, data.listNo, m2.listNo.x, m2.listNo.y, m2.listNo.size, font);
  }

  // 食品一覧
  const validItems = data.foodItems.filter((item) => item.name.trim());
  const rows = m2.foodTable.rows;
  const cols = m2.foodTable.columns;
  const maxRows = m2.foodTable.maxRows;

  validItems.slice(0, maxRows).forEach((item, i) => {
    const row = rows[i];
    if (!row) return;

    // 番号 (中央寄せ)
    drawCenteredText(page2, String(i + 1), cols.no.x, row.y, 10, cols.no.maxWidth, font);
    // 食品名
    drawText(page2, item.name, cols.name.x, row.y, 10, font);
    // 予定食数 (中央寄せ)
    drawCenteredText(page2, item.quantity, cols.quantity.x, row.y, 10, cols.quantity.maxWidth, font);
  });

  // 以下余白
  const itemCount = Math.min(validItems.length, maxRows);
  if (itemCount < maxRows && rows[itemCount]) {
    drawText(page2, m2.foodTable.blankText.text, m2.foodTable.blankText.x, rows[itemCount].y, m2.foodTable.blankText.size, font);
  }

  return pdfDoc.save();
}
