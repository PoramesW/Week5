import React, { useEffect, useRef } from 'react';
import { X, CheckCircle2, Shuffle, Clock, Layers, Sparkles } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const rules = [
    {
      num: 1,
      title: 'เลือกการ์ด 2 ใบ',
      en: 'Choose 2 cards',
      desc: 'คลิกหรือกด Space/Enter บนการ์ดเพื่อเปิดดูสีและสัญลักษณ์',
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
    },
    {
      num: 2,
      title: 'ถ้าสีเหมือนกัน จะจับคู่สำเร็จ',
      en: 'Matching colors stay open',
      desc: 'การ์ดจะค้างอยู่ในสถานะจับคู่สำเร็จ และได้รับคะแนนสะสม',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    },
    {
      num: 3,
      title: 'ถ้าสีไม่เหมือนกัน การ์ดจะถูกปิดกลับ',
      en: 'Mismatched cards flip back',
      desc: 'การ์ดจะแสดงชั่วครู่ให้คุณจำตำแหน่ง แล้วพลิกกลับไปปิดหน้าตามเดิม',
      icon: <Shuffle className="w-5 h-5 text-amber-500" />,
    },
    {
      num: 4,
      title: 'จับคู่ให้ครบก่อนหมดเวลาหรือหมดรอบเปิดไพ่',
      en: 'Match before time or moves run out',
      desc: 'จับคู่ครบทุกคู่เพื่อชนะเกม (You Win!) หากเวลาเหลือ 0 หรือใช้รอบเปิดไพ่จนหมดจะแพ้ทันที',
      icon: <Clock className="w-5 h-5 text-rose-500" />,
    },
    {
      num: 5,
      title: 'เลือก Level เพื่อเพิ่มหรือลดความยาก',
      en: 'Select difficulty level',
      desc: 'Easy (4 คู่, 60 วินาที, สูงสุด 10 รอบ), Medium (6 คู่, 50 วินาที, สูงสุด 15 รอบ), Hard (8 คู่, 45 วินาที, สูงสุด 20 รอบ)',
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
    },
    {
      num: 6,
      title: 'กด Restart เพื่อเริ่มเกมใหม่',
      en: 'Press Restart anytime',
      desc: 'กดปุ่ม Restart เมื่อต้องการสับการ์ดใหม่และรีเซ็ตเวลาทันที',
      icon: <CheckCircle2 className="w-5 h-5 text-blue-500" />,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2
              id="how-to-play-title"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white"
            >
              How to Play · วิธีการเล่น
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              คู่มือและกติกาการเล่นเกม Color Match
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rules List */}
        <div className="py-4 overflow-y-auto space-y-3.5 pr-1">
          {rules.map((rule) => (
            <div
              key={rule.num}
              className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800"
            >
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-xs border border-slate-200/50 dark:border-slate-700 shrink-0">
                {rule.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {rule.num}.
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {rule.title}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            </div>
          ))}

          {/* Accessibility Note */}
          <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-300">
            <span className="font-bold">Accessibility & Accessibility Tips:</span>
            <ul className="mt-1 list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
              <li>ใช้ปุ่ม <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 rounded border text-[10px]">Tab</kbd> เพื่อเลือกการ์ด และกด <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 rounded border text-[10px]">Enter</kbd> หรือ <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 rounded border text-[10px]">Space</kbd> เพื่อเปิดการ์ด</li>
              <li>การ์ดทุกใบมีทั้งสี ชื่อสี และสัญลักษณ์รูปทรง (★, ◆, ▲, ●, ■) รองรับผู้ใช้ที่ตาบอดสีหรือใช้งาน High Contrast mode</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            เข้าใจแล้ว · Start Playing
          </button>
        </div>
      </div>
    </div>
  );
};
