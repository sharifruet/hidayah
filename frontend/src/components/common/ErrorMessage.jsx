import { useAppLocale } from '../../context/AppContext.jsx';
import { tr } from '../../i18n/translations.js';
import { userErrorMessage } from '../../utils/errors.js';

/**
 * Localized error box. `error` may be a normalized API error / Error (mapped to a friendly
 * message via `userErrorMessage`) or an already-localized string.
 *
 * variant:
 *  - 'box'    (default) red bordered panel with a title
 *  - 'inline' compact one-liner for use inside cards
 *  - 'onDark' light-on-dark one-liner for coloured hero cards
 */
export default function ErrorMessage({ error, onRetry = null, title = null, variant = 'box', className = '' }) {
  const { language } = useAppLocale();
  if (!error) return null;

  const message = userErrorMessage(error, language);
  const retryLabel = tr('retry', language);

  if (variant === 'inline' || variant === 'onDark') {
    const onDark = variant === 'onDark';
    return (
      <div
        role="alert"
        className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ${
          onDark ? 'text-white/90' : 'text-red-700 dark:text-red-300'
        } ${className}`}
      >
        <span>{message}</span>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={`font-semibold underline underline-offset-2 ${
              onDark ? 'text-white hover:text-white/80' : 'text-red-800 hover:text-red-900 dark:text-red-200'
            }`}
          >
            {retryLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div role="alert" className={`bg-red-50 border border-red-200 rounded-lg p-4 dark:bg-red-950/40 dark:border-red-900 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ms-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{title || tr('error_title', language)}</h3>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">{message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline dark:text-red-200"
            >
              {retryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
