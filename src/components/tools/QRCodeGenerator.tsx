import { useState, useRef, useEffect, useCallback } from 'react';
import QRCodeStyling, {
  type DotType,
  type CornerSquareType,
  type CornerDotType,
} from 'qr-code-styling';

const DOT_STYLES: { value: DotType; label: string }[] = [
  { value: 'square', label: 'Quadrato' },
  { value: 'dots', label: 'Puntini' },
  { value: 'rounded', label: 'Arrotondato' },
  { value: 'extra-rounded', label: 'Extra arrotondato' },
  { value: 'classy', label: 'Classico' },
  { value: 'classy-rounded', label: 'Classico arrotondato' },
];

const CORNER_SQUARE_STYLES: { value: CornerSquareType; label: string }[] = [
  { value: 'square', label: 'Quadrato' },
  { value: 'dot', label: 'Cerchio' },
  { value: 'extra-rounded', label: 'Arrotondato' },
];

const CORNER_DOT_STYLES: { value: CornerDotType; label: string }[] = [
  { value: 'square', label: 'Quadrato' },
  { value: 'dot', label: 'Cerchio' },
];

const ERROR_CORRECTION: { value: 'L' | 'M' | 'Q' | 'H'; label: string }[] = [
  { value: 'L', label: 'Bassa (7%)' },
  { value: 'M', label: 'Media (15%)' },
  { value: 'Q', label: 'Alta (25%)' },
  { value: 'H', label: 'Massima (30%)' },
];

export default function QRCodeGenerator() {
  const [data, setData] = useState('https://www.bitora.it');
  const [size, setSize] = useState(300);
  const [dotColor, setDotColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [transparentBg, setTransparentBg] = useState(false);
  const [dotStyle, setDotStyle] = useState<DotType>('square');
  const [cornerSquareStyle, setCornerSquareStyle] = useState<CornerSquareType>('square');
  const [cornerDotStyle, setCornerDotStyle] = useState<CornerDotType>('square');
  const [cornerSquareColor, setCornerSquareColor] = useState('#000000');
  const [cornerDotColor, setCornerDotColor] = useState('#000000');
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(0.4);
  const [margin, setMargin] = useState(10);
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'logo' | 'export'>('content');

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: size,
      height: size,
      data,
      dotsOptions: { color: dotColor, type: dotStyle },
      backgroundOptions: { color: transparentBg ? 'transparent' : bgColor },
      cornersSquareOptions: { color: cornerSquareColor, type: cornerSquareStyle },
      cornersDotOptions: { color: cornerDotColor, type: cornerDotStyle },
      qrOptions: { errorCorrectionLevel: errorCorrection },
      imageOptions: { crossOrigin: 'anonymous', margin: 5, imageSize: logoSize },
      image: logoFile || undefined,
      margin,
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.current.append(qrRef.current);
    }
  }, []);

  const updateQR = useCallback(() => {
    if (!qrCode.current) return;
    qrCode.current.update({
      width: size,
      height: size,
      data: data || 'https://www.bitora.it',
      dotsOptions: { color: dotColor, type: dotStyle },
      backgroundOptions: { color: transparentBg ? 'transparent' : bgColor },
      cornersSquareOptions: { color: cornerSquareColor, type: cornerSquareStyle },
      cornersDotOptions: { color: cornerDotColor, type: cornerDotStyle },
      qrOptions: { errorCorrectionLevel: errorCorrection },
      imageOptions: { crossOrigin: 'anonymous', margin: 5, imageSize: logoSize },
      image: logoFile || undefined,
      margin,
    });
  }, [
    data,
    size,
    dotColor,
    bgColor,
    transparentBg,
    dotStyle,
    cornerSquareStyle,
    cornerDotStyle,
    cornerSquareColor,
    cornerDotColor,
    errorCorrection,
    logoFile,
    logoSize,
    margin,
  ]);

  useEffect(() => {
    updateQR();
  }, [updateQR]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogoFile(reader.result as string);
      if (errorCorrection === 'L' || errorCorrection === 'M') {
        setErrorCorrection('H');
      }
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoFile(null);
  };

  const downloadQR = (format: 'png' | 'jpeg') => {
    if (!qrCode.current) return;

    if (format === 'jpeg' && transparentBg) {
      const tempQR = new QRCodeStyling({
        width: size,
        height: size,
        data: data || 'https://www.bitora.it',
        dotsOptions: { color: dotColor, type: dotStyle },
        backgroundOptions: { color: bgColor },
        cornersSquareOptions: { color: cornerSquareColor, type: cornerSquareStyle },
        cornersDotOptions: { color: cornerDotColor, type: cornerDotStyle },
        qrOptions: { errorCorrectionLevel: errorCorrection },
        imageOptions: { crossOrigin: 'anonymous', margin: 5, imageSize: logoSize },
        image: logoFile || undefined,
        margin,
      });
      tempQR.download({ name: 'qr-code-bitora', extension: 'jpeg' });
    } else if (format === 'png') {
      qrCode.current.download({ name: 'qr-code-bitora', extension: 'png' });
    } else {
      qrCode.current.download({ name: 'qr-code-bitora', extension: 'jpeg' });
    }
  };

  const tabs = [
    { id: 'content' as const, label: 'Contenuto', icon: '📝' },
    { id: 'style' as const, label: 'Stile', icon: '🎨' },
    { id: 'logo' as const, label: 'Logo', icon: '🖼️' },
    { id: 'export' as const, label: 'Esporta', icon: '💾' },
  ];

  const inputClass =
    'w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:border-gray-500 dark:focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-white/30 transition-colors';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2';
  const selectClass =
    'w-full rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-zinc-900 px-4 py-3 text-gray-900 dark:text-white focus:border-gray-500 dark:focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-white/30 transition-colors appearance-none cursor-pointer';
  const cardClass =
    'space-y-5 p-4 sm:p-6 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10';
  const headingClass = 'text-lg font-semibold text-gray-900 dark:text-white';
  const subLabelClass = 'text-sm font-medium text-gray-600 dark:text-gray-300';
  const colorRowClass =
    'flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-100 dark:bg-white/5';
  const colorInputClass =
    'w-20 sm:w-24 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-2 py-1.5 text-xs sm:text-sm text-gray-900 dark:text-white font-mono text-center';

  return (
    <div className="grid lg:grid-cols-[1fr,auto] gap-8 items-start">
      <div className="space-y-6">
        <div className="flex gap-2 p-1 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'content' && (
          <div className={cardClass}>
            <h3 className={headingClass}>Contenuto del QR Code</h3>
            <div>
              <label className={labelClass}>URL o testo</label>
              <input
                type="text"
                value={data}
                onChange={e => setData(e.target.value)}
                placeholder="https://esempio.it o testo libero"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Dimensione: {size}px</label>
              <input
                type="range"
                min="150"
                max="1000"
                step="10"
                value={size}
                onChange={e => setSize(Number(e.target.value))}
                className="w-full accent-gray-900 dark:accent-white"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>150px</span>
                <span>1000px</span>
              </div>
            </div>
            <div>
              <label className={labelClass}>Margine: {margin}px</label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={margin}
                onChange={e => setMargin(Number(e.target.value))}
                className="w-full accent-gray-900 dark:accent-white"
              />
            </div>
            <div>
              <label className={labelClass}>Correzione errori</label>
              <select
                value={errorCorrection}
                onChange={e => setErrorCorrection(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                className={selectClass}
              >
                {ERROR_CORRECTION.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {logoFile && (errorCorrection === 'L' || errorCorrection === 'M') && (
                <p className="mt-2 text-xs text-gray-500">
                  ⚠️ Con un logo, si consiglia correzione "Alta" o "Massima"
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'style' && (
          <div className={cardClass}>
            <h3 className={headingClass}>Personalizzazione stile</h3>

            <div className="space-y-3">
              <p className={subLabelClass}>Colori</p>

              <div className={colorRowClass}>
                <span className="text-sm text-gray-900 dark:text-white shrink-0">Punti</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={dotColor}
                    onChange={e => setDotColor(e.target.value)}
                    className={colorInputClass}
                  />
                  <input
                    type="color"
                    value={dotColor}
                    onChange={e => setDotColor(e.target.value)}
                    className="h-9 w-9 shrink-0 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent cursor-pointer"
                  />
                </div>
              </div>

              <div className={colorRowClass}>
                <div className="shrink-0">
                  <span className="text-sm text-gray-900 dark:text-white">Sfondo</span>
                  <label className="mt-1 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={transparentBg}
                      onChange={e => setTransparentBg(e.target.checked)}
                      className="rounded border-gray-300 dark:border-white/20 accent-gray-900 dark:accent-white w-3.5 h-3.5"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Trasparente</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={transparentBg ? '—' : bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    disabled={transparentBg}
                    className={`${colorInputClass} disabled:opacity-40`}
                  />
                  <input
                    type="color"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    disabled={transparentBg}
                    className="h-9 w-9 shrink-0 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent cursor-pointer disabled:opacity-40"
                  />
                </div>
              </div>

              <div className={colorRowClass}>
                <span className="text-sm text-gray-900 dark:text-white shrink-0">Angoli (ext)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cornerSquareColor}
                    onChange={e => setCornerSquareColor(e.target.value)}
                    className={colorInputClass}
                  />
                  <input
                    type="color"
                    value={cornerSquareColor}
                    onChange={e => setCornerSquareColor(e.target.value)}
                    className="h-9 w-9 shrink-0 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent cursor-pointer"
                  />
                </div>
              </div>

              <div className={colorRowClass}>
                <span className="text-sm text-gray-900 dark:text-white shrink-0">Angoli (int)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cornerDotColor}
                    onChange={e => setCornerDotColor(e.target.value)}
                    className={colorInputClass}
                  />
                  <input
                    type="color"
                    value={cornerDotColor}
                    onChange={e => setCornerDotColor(e.target.value)}
                    className="h-9 w-9 shrink-0 rounded-lg border border-gray-300 dark:border-white/10 bg-transparent cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div>
              <p className={`${subLabelClass} mb-2`}>Stile punti</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DOT_STYLES.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setDotStyle(s.value)}
                    className={`px-2 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                      dotStyle === s.value
                        ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-gray-200 text-white dark:text-black'
                        : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className={`${subLabelClass} mb-2`}>Stile angoli</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                    Esterno
                  </label>
                  <select
                    value={cornerSquareStyle}
                    onChange={e => setCornerSquareStyle(e.target.value as CornerSquareType)}
                    className={selectClass}
                  >
                    {CORNER_SQUARE_STYLES.map(s => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                    Interno
                  </label>
                  <select
                    value={cornerDotStyle}
                    onChange={e => setCornerDotStyle(e.target.value as CornerDotType)}
                    className={selectClass}
                  >
                    {CORNER_DOT_STYLES.map(s => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logo' && (
          <div className={cardClass}>
            <h3 className={headingClass}>Logo al centro</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Carica un'immagine da posizionare al centro del QR code. La correzione errori verrà
              automaticamente aumentata.
            </p>

            <div>
              <label className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                {logoFile ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={logoFile}
                      alt="Logo"
                      className="h-16 w-16 object-contain rounded-lg"
                    />
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Logo caricato ✓
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-3xl">📁</span>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Clicca per caricare un logo
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG, SVG</p>
                  </div>
                )}
              </label>
            </div>

            {logoFile && (
              <>
                <div>
                  <label className={labelClass}>
                    Dimensione logo: {Math.round(logoSize * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.5"
                    step="0.05"
                    value={logoSize}
                    onChange={e => setLogoSize(Number(e.target.value))}
                    className="w-full accent-gray-900 dark:accent-white"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10%</span>
                    <span>50%</span>
                  </div>
                </div>
                <button
                  onClick={removeLogo}
                  className="w-full py-3 rounded-xl border border-red-500/30 text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                >
                  Rimuovi logo
                </button>
              </>
            )}
          </div>
        )}

        {activeTab === 'export' && (
          <div className={cardClass}>
            <h3 className={headingClass}>Esporta il QR Code</h3>

            <div className="space-y-3">
              <button
                onClick={() => downloadQR('png')}
                className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-black font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🖼️</span>
                  <div className="text-left">
                    <p>Scarica PNG</p>
                    <p className="text-xs font-normal text-gray-300 dark:text-gray-500">
                      {transparentBg ? 'Con sfondo trasparente' : 'Con sfondo colorato'}
                    </p>
                  </div>
                </div>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>

              <button
                onClick={() => downloadQR('jpeg')}
                className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-900 dark:text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] border border-gray-200 dark:border-white/10"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📸</span>
                  <div className="text-left">
                    <p>Scarica JPG</p>
                    <p className="text-xs font-normal text-gray-500 dark:text-gray-400">
                      Sempre con sfondo colorato ({bgColor})
                    </p>
                  </div>
                </div>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>💡 Suggerimento:</strong> Usa il formato PNG per sfondi trasparenti (ideale
                per stampe su materiali colorati). Il JPG include sempre uno sfondo pieno — perfetto
                per uso digitale.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-6 order-first lg:order-none">
        <div className="lg:sticky lg:top-28 w-full flex justify-center">
          <div className="p-4 sm:p-6 rounded-3xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 shadow-2xl w-full max-w-xs sm:max-w-sm">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 text-center">
              Anteprima
            </p>
            <div
              ref={qrRef}
              className="flex items-center justify-center rounded-2xl overflow-hidden mx-auto [&>canvas]:!w-full [&>canvas]:!h-auto"
              style={{
                background: transparentBg
                  ? 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 16px 16px'
                  : bgColor,
                maxWidth: '280px',
              }}
            />
            <p className="mt-4 text-xs text-gray-500 text-center truncate">
              {data || 'Inserisci un contenuto'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
