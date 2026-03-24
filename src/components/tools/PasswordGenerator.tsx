import { useState, useCallback, useEffect } from 'react';

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`',
};

function generatePassword(
  length: number,
  options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean },
  excludeAmbiguous: boolean,
  customExclude: string
): string {
  let chars = '';
  if (options.uppercase) chars += CHAR_SETS.uppercase;
  if (options.lowercase) chars += CHAR_SETS.lowercase;
  if (options.numbers) chars += CHAR_SETS.numbers;
  if (options.symbols) chars += CHAR_SETS.symbols;

  if (!chars) return '';

  if (excludeAmbiguous) {
    chars = chars.replace(/[0OIl1|]/g, '');
  }

  if (customExclude) {
    for (const ch of customExclude) {
      chars = chars.split(ch).join('');
    }
  }

  if (!chars) return '';

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, n => chars[n % chars.length]).join('');
}

function calculateStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: 'Nessuna', color: 'bg-gray-600' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (password.length >= 24) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.6) score++;

  if (score <= 2) return { score: Math.min(score * 12, 25), label: 'Debole', color: 'bg-red-500' };
  if (score <= 4)
    return { score: Math.min(score * 10, 50), label: 'Discreta', color: 'bg-gray-500' };
  if (score <= 6)
    return { score: Math.min(score * 12, 75), label: 'Buona', color: 'bg-yellow-500' };
  return { score: Math.min(score * 12, 100), label: 'Fortissima', color: 'bg-green-500' };
}

const cardClass =
  'p-6 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10';
const inputSmClass =
  'w-20 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-center text-gray-900 dark:text-white text-sm focus:border-gray-500 dark:focus:border-white/40 focus:outline-none';
const rowClass =
  'flex items-center justify-between p-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/[0.08] cursor-pointer transition-colors';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [customExclude, setCustomExclude] = useState('');
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);

  const generate = useCallback(() => {
    if (quantity === 1) {
      const pw = generatePassword(length, options, excludeAmbiguous, customExclude);
      setPassword(pw);
      setPasswords([]);
    } else {
      const pws = Array.from({ length: quantity }, () =>
        generatePassword(length, options, excludeAmbiguous, customExclude)
      );
      setPassword(pws[0]);
      setPasswords(pws);
    }
    setCopied(false);
  }, [length, options, excludeAmbiguous, customExclude, quantity]);

  useEffect(() => {
    generate();
  }, []);

  const copyToClipboard = async (text?: string) => {
    try {
      await navigator.clipboard.writeText(text || password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text || password;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyAll = async () => {
    const all = passwords.length > 0 ? passwords.join('\n') : password;
    await copyToClipboard(all);
  };

  const strength = calculateStrength(password);
  const atLeastOne = options.uppercase || options.lowercase || options.numbers || options.symbols;

  const toggleClass = (checked: boolean) =>
    `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-white/10'}`;
  const toggleDot = (checked: boolean) =>
    `inline-block h-4 w-4 transform rounded-full shadow transition-transform ${checked ? 'translate-x-6 bg-white dark:bg-black' : 'translate-x-1 bg-white dark:bg-gray-400'}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className={cardClass}>
        <div className="flex items-center gap-3">
          <div className="flex-1 overflow-hidden">
            <p
              className="font-mono text-xl md:text-2xl text-gray-900 dark:text-white break-all select-all leading-relaxed"
              style={{ wordBreak: 'break-all' }}
            >
              {password || (
                <span className="text-gray-400 dark:text-gray-500">
                  Seleziona almeno un'opzione
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={() => copyToClipboard()}
              disabled={!password}
              className={`p-3 rounded-xl transition-all ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/15 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="Copia"
            >
              {copied ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={generate}
              className="p-3 rounded-xl bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/15 hover:text-gray-900 dark:hover:text-white transition-all"
              title="Rigenera"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Robustezza</span>
            <span
              className={`text-xs font-semibold ${
                strength.label === 'Fortissima'
                  ? 'text-green-500 dark:text-green-400'
                  : strength.label === 'Buona'
                    ? 'text-yellow-500 dark:text-yellow-400'
                    : strength.label === 'Discreta'
                      ? 'text-gray-500'
                      : strength.label === 'Debole'
                        ? 'text-red-500 dark:text-red-400'
                        : 'text-gray-400'
              }`}
            >
              {strength.label}
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
              style={{ width: `${strength.score}%` }}
            />
          </div>
        </div>
      </div>

      <div className={`${cardClass} space-y-6`}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configurazione</h3>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Lunghezza
            </label>
            <input
              type="number"
              min="4"
              max="128"
              value={length}
              onChange={e => setLength(Math.max(4, Math.min(128, Number(e.target.value))))}
              className={inputSmClass}
            />
          </div>
          <input
            type="range"
            min="4"
            max="128"
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-gray-900 dark:accent-white"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>4</span>
            <span>128</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Caratteri inclusi</p>

          {[
            { key: 'uppercase' as const, label: 'Maiuscole', example: 'A-Z' },
            { key: 'lowercase' as const, label: 'Minuscole', example: 'a-z' },
            { key: 'numbers' as const, label: 'Numeri', example: '0-9' },
            { key: 'symbols' as const, label: 'Simboli', example: '!@#$%...' },
          ].map(({ key, label, example }) => (
            <label key={key} className={rowClass}>
              <div>
                <span className="text-sm text-gray-900 dark:text-white">{label}</span>
                <span className="ml-2 text-xs text-gray-400 dark:text-gray-500 font-mono">
                  {example}
                </span>
              </div>
              <button
                onClick={() => setOptions(prev => ({ ...prev, [key]: !prev[key] }))}
                className={toggleClass(options[key])}
                role="switch"
                aria-checked={options[key]}
              >
                <span className={toggleDot(options[key])} />
              </button>
            </label>
          ))}
        </div>

        <details className="group">
          <summary className="text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors list-none flex items-center gap-2">
            <svg
              className="w-4 h-4 transition-transform group-open:rotate-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Opzioni avanzate
          </summary>
          <div className="mt-4 space-y-4">
            <label className={rowClass}>
              <div>
                <span className="text-sm text-gray-900 dark:text-white">
                  Escludi caratteri ambigui
                </span>
                <p className="text-xs text-gray-500 mt-0.5">Rimuove 0, O, I, l, 1, |</p>
              </div>
              <button
                onClick={() => setExcludeAmbiguous(!excludeAmbiguous)}
                className={toggleClass(excludeAmbiguous)}
                role="switch"
                aria-checked={excludeAmbiguous}
              >
                <span className={toggleDot(excludeAmbiguous)} />
              </button>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Escludi caratteri personalizzati
              </label>
              <input
                type="text"
                value={customExclude}
                onChange={e => setCustomExclude(e.target.value)}
                placeholder="Es: {}[]"
                className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-gray-500 dark:focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-white/30 font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quantità password
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, Math.min(50, Number(e.target.value))))}
                  className={inputSmClass}
                />
              </div>
            </div>
          </div>
        </details>

        <button
          onClick={generate}
          disabled={!atLeastOne}
          className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white dark:text-black font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          🔐 Genera Password
        </button>
      </div>

      {passwords.length > 1 && (
        <div className={`${cardClass} space-y-3`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Password generate ({passwords.length})
            </h3>
            <button
              onClick={copyAll}
              className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-white/10 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/15 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Copia tutte
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {passwords.map((pw, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/[0.08] group"
              >
                <span className="text-xs text-gray-400 dark:text-gray-500 w-6">{i + 1}.</span>
                <span className="flex-1 font-mono text-sm text-gray-900 dark:text-white break-all select-all">
                  {pw}
                </span>
                <button
                  onClick={() => copyToClipboard(pw)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shrink-0"
                  title="Copia"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <strong>🔒 Sicurezza:</strong> Le password vengono generate interamente nel tuo browser
          usando l'API{' '}
          <code className="text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 rounded">
            crypto.getRandomValues()
          </code>
          . Nessun dato viene inviato al server.
        </p>
      </div>
    </div>
  );
}
