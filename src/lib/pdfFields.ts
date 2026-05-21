export const PDF_PAGE = {
  width: 595,
  height: 842,
  unit: 'pt',
} as const;

export const PDF_TEXT_STYLE = {
  defaultSize: 10,
  smallSize: 9,
  checkSize: 12,
  lineHeight: 14,
  color: 'black',
} as const;

export const FONT_PATHS: Record<string, string> = {
  gothic: '/fonts/NotoSansJP-Regular.otf',
  mincho: '/fonts/NotoSerifJP-Regular.otf',
};

export const saijiFieldMap = {
  page1: {
    noticeDate: {
      eraYear: { x: 394, y: 712, size: 10 },
      month: { x: 433, y: 712, size: 10 },
      day: { x: 465, y: 712, size: 10 },
    },

    applicantAddress: {
      x: 274,
      y: 616,
      size: 10,
      maxWidth: 250,
      lineHeight: 14,
      maxLines: 2,
    },

    applicantNameBlock: {
      companyName: { x: 273, y: 577, size: 10, maxWidth: 250 },
      representative: { x: 281, y: 565, size: 10, maxWidth: 250 },
    },

    eventPlace: {
      x: 108,
      y: 428,
      size: 10,
      maxWidth: 360,
      lineHeight: 14,
      maxLines: 2,
    },

    eventName: {
      x: 105,
      y: 390,
      size: 10,
      maxWidth: 360,
      lineHeight: 14,
      maxLines: 1,
    },

    foodSummary: {
      x: 105,
      y: 370,
      size: 10,
      maxWidth: 360,
      lineHeight: 14,
      maxLines: 1,
      defaultText: '裏面一覧表のとおり',
    },

    startDateTime: {
      eraYear: { x: 136, y: 316, size: 10 },
      month: { x: 167, y: 316, size: 10 },
      day: { x: 193, y: 316, size: 10 },
      hour: { x: 226, y: 316, size: 10 },
      minute: { x: 262, y: 316, size: 10 },
    },

    endDateTime: {
      eraYear: { x: 136, y: 296, size: 10 },
      month: { x: 167, y: 296, size: 10 },
      day: { x: 193, y: 296, size: 10 },
      hour: { x: 226, y: 296, size: 10 },
      minute: { x: 262, y: 296, size: 10 },
    },

    manager: {
      name: { x: 136, y: 244, size: 10, maxWidth: 160 },
      address: { x: 137, y: 226, size: 8, maxWidth: 260 },
      tel: { x: 397, y: 226, size: 10, maxWidth: 110 },
    },

    confirmNotes: {
      check: { x: 389, y: 173, size: 12, text: '✓' },
    },
  },

  page2: {
    listNo: {
      x: 472,
      y: 744,
      size: 10,
      maxWidth: 35,
    },

    foodTable: {
      maxRows: 18,

      columns: {
        no: {
          x: 100,
          maxWidth: 25,
          align: 'center' as const,
        },
        name: {
          x: 153,
          maxWidth: 250,
          align: 'left' as const,
        },
        quantity: {
          x: 455,
          maxWidth: 45,
          align: 'center' as const,
        },
      },

      rows: [
        { row: 1, y: 693 },
        { row: 2, y: 661 },
        { row: 3, y: 629 },
        { row: 4, y: 597 },
        { row: 5, y: 565 },
        { row: 6, y: 533 },
        { row: 7, y: 501 },
        { row: 8, y: 469 },
        { row: 9, y: 437 },
        { row: 10, y: 405 },
        { row: 11, y: 373 },
        { row: 12, y: 341 },
        { row: 13, y: 309 },
        { row: 14, y: 277 },
        { row: 15, y: 245 },
        { row: 16, y: 213 },
        { row: 17, y: 181 },
        { row: 18, y: 149 },
      ],

      blankText: {
        text: '以下余白',
        x: 153,
        size: 10,
      },
    },
  },
} as const;
