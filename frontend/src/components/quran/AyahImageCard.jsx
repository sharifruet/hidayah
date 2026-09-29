import { useRef, useEffect, useState } from 'react';
import { tr, fmt } from '../../i18n/translations.js';
import { localDigits } from '../../utils/format.js';

const CARD_W = 1080;
const SQUARE_H = 1080;
const STORY_H  = 1920;
const RTL_TEXT = /[\u0590-\u08FF]/;

/**
 * Wraps `text` into lines that fit within `maxWidth` pixels using `ctx` metrics.
 */
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawCard(canvas, { arabicText, translationText, reference, watermark, theme, format }) {
  const ctx = canvas.getContext('2d');
  const CARD_H = format === 'story' ? STORY_H : SQUARE_H;
  canvas.width  = CARD_W;
  canvas.height = CARD_H;

  const PAD = format === 'story' ? 100 : 80;
  const W   = CARD_W - PAD * 2;

  // Background
  if (theme === 'dark') {
    ctx.fillStyle = '#1a2e1a';
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    // subtle inner glow
    const grad = ctx.createRadialGradient(CARD_W / 2, CARD_H / 2, 100, CARD_W / 2, CARD_H / 2, 600);
    grad.addColorStop(0, 'rgba(34,197,94,0.08)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
  } else {
    // Cream / parchment
    ctx.fillStyle = '#fdfbf5';
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    const grad = ctx.createRadialGradient(CARD_W / 2, CARD_H / 2, 100, CARD_W / 2, CARD_H / 2, 700);
    grad.addColorStop(0, 'rgba(34,197,94,0.04)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
  }

  const textColor      = theme === 'dark' ? '#f0fdf4' : '#1a2e1a';
  const mutedColor     = theme === 'dark' ? 'rgba(240,253,244,0.55)' : 'rgba(26,46,26,0.5)';
  const accentColor    = theme === 'dark' ? '#4ade80' : '#16a34a';
  const borderColor    = theme === 'dark' ? 'rgba(74,222,128,0.25)' : 'rgba(22,163,74,0.2)';

  // Decorative border
  const BRD = 28;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2;
  roundRect(ctx, BRD, BRD, CARD_W - BRD * 2, CARD_H - BRD * 2, 24);
  ctx.stroke();

  // Corner ornaments
  drawOrnament(ctx, BRD + 12, BRD + 12, accentColor);
  drawOrnament(ctx, CARD_W - BRD - 12, BRD + 12, accentColor);
  drawOrnament(ctx, BRD + 12, CARD_H - BRD - 12, accentColor);
  drawOrnament(ctx, CARD_W - BRD - 12, CARD_H - BRD - 12, accentColor);

  // Top divider line
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD, 110);
  ctx.lineTo(CARD_W - PAD, 110);
  ctx.stroke();

  // Bismillah / header label
  ctx.font = `500 28px 'Segoe UI', sans-serif`;
  ctx.fillStyle = mutedColor;
  ctx.textAlign = 'center';
  ctx.fillText('﷽', CARD_W / 2, 90);

  // Arabic text (right-to-left, large)
  const arabicFontBase = format === 'story' ? 90 : 72;
  const arabicFontSize = arabicText.length > 100
    ? arabicFontBase - 20
    : arabicText.length > 50
    ? arabicFontBase - 10
    : arabicFontBase;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'right';

  // Draw Arabic centered block (simulate RTL centering)
  ctx.font = `${arabicFontSize}px serif`;
  const arabicLines = wrapTextRTL(ctx, arabicText, W);
  const arabicLineH = arabicFontSize * 1.6;
  const arabicBlockH = arabicLines.length * arabicLineH;
  const arabicY = format === 'story' ? CARD_H * 0.25 : 200;

  arabicLines.forEach((line, i) => {
    ctx.fillText(line, CARD_W - PAD, arabicY + i * arabicLineH);
  });

  // Horizontal divider after Arabic
  const divY = arabicY + arabicBlockH + 36;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PAD + 40, divY);
  ctx.lineTo(CARD_W - PAD - 40, divY);
  ctx.stroke();

  // Translation text
  if (translationText) {
    const transFontBase = format === 'story' ? 44 : 36;
    const transFontSize = translationText.length > 200 ? transFontBase - 8 : translationText.length > 100 ? transFontBase - 4 : transFontBase;
    // Translations may be in an RTL script (e.g. Urdu) — lay them out right-aligned.
    const rtl = RTL_TEXT.test(translationText);
    ctx.font = `italic ${transFontSize}px 'Georgia', serif`;
    ctx.fillStyle = textColor;
    ctx.direction = rtl ? 'rtl' : 'ltr';
    ctx.textAlign = rtl ? 'right' : 'left';

    const transLines = wrapText(ctx, translationText, W);
    const transLineH = transFontSize * 1.55;
    const transY = divY + 48;

    transLines.forEach((line, i) => {
      ctx.fillText(line, rtl ? CARD_W - PAD : PAD, transY + i * transLineH);
    });
    ctx.direction = 'ltr';
  }

  const refFontSize = format === 'story' ? 38 : 30;
  // Bottom: reference
  ctx.font = `600 ${refFontSize}px 'Segoe UI', sans-serif`;
  ctx.fillStyle = accentColor;
  ctx.textAlign = 'center';
  ctx.fillText(`— ${reference}`, CARD_W / 2, CARD_H - 90);

  // Bottom line
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD, CARD_H - 110);
  ctx.lineTo(CARD_W - PAD, CARD_H - 110);
  ctx.stroke();

  // Watermark
  ctx.font = `400 ${format === 'story' ? 28 : 22}px 'Segoe UI', sans-serif`;
  ctx.fillStyle = mutedColor;
  ctx.fillText(watermark, CARD_W / 2, CARD_H - 52);
}

function wrapTextRTL(ctx, text, maxWidth) {
  // Split on spaces and wrap into lines; canvas will render RTL
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawOrnament(ctx, cx, cy, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();
}

// ─── Modal component ─────────────────────────────────────────────────────────

export default function AyahImageCard({ ayah, surahName, surahNumber, language, onClose }) {
  const canvasRef  = useRef(null);
  const [theme, setTheme]   = useState('light');
  const [format, setFormat] = useState('square'); // 'square' | 'story'

  const reference = `${surahName} (${localDigits(`${surahNumber}:${ayah.number}`, language)})`;
  const watermark = tr('app_name', language);
  const visibleTranslation = (ayah.translations || [])[0]?.text || '';

  useEffect(() => {
    if (canvasRef.current) {
      drawCard(canvasRef.current, {
        arabicText:      ayah.text_ar,
        translationText: visibleTranslation,
        reference,
        watermark,
        theme,
        format,
      });
    }
  }, [ayah, theme, format, visibleTranslation, reference, watermark]);

  function handleDownload() {
    const link = document.createElement('a');
    link.download = `ayah-${surahNumber}-${ayah.number}-${format}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              {tr('qb_card_title', language)}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label={tr('qb_close', language)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Canvas preview */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-auto" style={{ maxHeight: '360px' }}>
            <canvas
              ref={canvasRef}
              className="rounded-lg shadow-md"
              style={{
                maxWidth: '100%',
                maxHeight: '340px',
                objectFit: 'contain',
                aspectRatio: format === 'story' ? '9/16' : '1/1',
              }}
            />
          </div>

          {/* Controls */}
          <div className="px-5 py-4 space-y-3">
            {/* Format picker */}
            <div className="flex gap-2">
              <button
                onClick={() => setFormat('square')}
                className={`flex-1 py-2 text-sm rounded-lg border font-medium transition-colors ${
                  format === 'square'
                    ? 'bg-blue-50 border-blue-400 text-blue-800'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                }`}
              >
                {fmt('qb_card_square', language, { ratio: localDigits('1:1', language) })}
              </button>
              <button
                onClick={() => setFormat('story')}
                className={`flex-1 py-2 text-sm rounded-lg border font-medium transition-colors ${
                  format === 'story'
                    ? 'bg-purple-50 border-purple-400 text-purple-800'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                }`}
              >
                {fmt('qb_card_story', language, { ratio: localDigits('9:16', language) })}
              </button>
            </div>

            {/* Theme picker */}
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 py-2 text-sm rounded-lg border font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-amber-50 border-amber-400 text-amber-800'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                }`}
              >
                {tr('qb_card_light', language)}
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 py-2 text-sm rounded-lg border font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-green-400'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                }`}
              >
                {tr('qb_card_dark', language)}
              </button>
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {tr('qb_card_download', language)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
