// Static map avoids Tailwind JIT purging dynamic class strings
const TOPIC_CLASSES = {
  hadith:       'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  seerah:       'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  fiqh:         'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  aqeedah:      'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
  tafsir:       'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  spirituality: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  history:      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  children:     'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  dawah:        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
};

const DEFAULT_CLASSES = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';

export default function TopicBadge({ topic }) {
  const classes = TOPIC_CLASSES[topic] || DEFAULT_CLASSES;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${classes}`}>
      {topic}
    </span>
  );
}
