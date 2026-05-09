export default function WordToken({ word, showTranslit, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(isActive ? null : word)}
      className={`flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg transition-all cursor-pointer select-none ${
        isActive
          ? 'bg-amber-100 ring-1 ring-amber-400'
          : 'hover:bg-green-50 active:bg-green-100'
      }`}
      aria-pressed={isActive}
      aria-label={word.gloss || word.text_ar}
    >
      <span className="font-arabic text-3xl leading-loose text-gray-900">
        {word.text_ar}
      </span>
      {showTranslit && word.transliteration && (
        <span className="text-[10px] text-gray-400 font-normal leading-none" dir="ltr">
          {word.transliteration}
        </span>
      )}
    </button>
  );
}
