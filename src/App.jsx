import React, { useState, useEffect, useRef, useCallback } from "react";

/* =========================================================================
   LANGKAH 1 — DATA
   Semua pilihan dan semua misi didefinisikan di sini sebagai data biasa.
   Warna "aksen" tiap chip kode juga taruh di sini (accentClass), jadi kalau
   mau ganti warna satu chip, cukup ganti satu baris — bukan cari-cari di JSX.
   ========================================================================= */

const BG_OPTIONS = [
  {
    id: "sky",
    label: "Langit Biru",
    emoji: "🌤️",
    swatch: "#5FC6CC",
    css: "linear-gradient(160deg,#8ED8DD,#5FC6CC)",
  },
  {
    id: "sunset",
    label: "Senja Jingga",
    emoji: "🌇",
    swatch: "#FF6B6B",
    css: "linear-gradient(160deg,#FFB199,#FF6B6B)",
  },
  {
    id: "forest",
    label: "Hutan Hijau",
    emoji: "🌳",
    swatch: "#5FCB6C",
    css: "linear-gradient(160deg,#A8E6A1,#5FCB6C)",
  },
  {
    id: "candy",
    label: "Permen Pink",
    emoji: "🍬",
    swatch: "#FF8FC7",
    css: "linear-gradient(160deg,#FFC3E1,#FF8FC7)",
  },
  {
    id: "night",
    label: "Malam Ungu",
    emoji: "🌙",
    swatch: "#4B3AA8",
    css: "linear-gradient(160deg,#8C6EFF,#4B3AA8)",
  },
  {
    id: "lemon",
    label: "Lemon Kuning",
    emoji: "🍋",
    swatch: "#FFC93C",
    css: "linear-gradient(160deg,#FFF2A8,#FFC93C)",
  },
];

const HEADING_OPTIONS = [
  { id: "halo", label: '"Halo! 👋"', text: "Halo! 👋", emoji: "👋" },
  {
    id: "selamat",
    label: '"Selamat Datang! 🎉"',
    text: "Selamat Datang! 🎉",
    emoji: "🎉",
  },
  { id: "hai", label: '"Hai teman! 🌟"', text: "Hai teman! 🌟", emoji: "🌟" },
  { id: "asik", label: '"Ini Asik! 😎"', text: "Ini Asik! 😎", emoji: "😎" },
];

const AVATAR_OPTIONS = [
  { id: "cat", label: "kucing.png", emoji: "🐱" },
  { id: "dog", label: "anjing.png", emoji: "🐶" },
  { id: "robot", label: "robot.png", emoji: "🤖" },
  { id: "dino", label: "dino.png", emoji: "🦖" },
  { id: "star", label: "bintang.png", emoji: "⭐" },
  { id: "unicorn", label: "unicorn.png", emoji: "🦄" },
];

const SHAPE_OPTIONS = [
  { id: "round", label: "kotak bulat", emoji: "◻️" },
  { id: "circle", label: "lingkaran", emoji: "⚪" },
];

const MSG_OPTIONS = [
  {
    id: "msg1",
    label: '"Website buatanku!"',
    text: "🚀 Website buatanku yang keren!",
    emoji: "🚀",
  },
  {
    id: "msg2",
    label: '"Aku belajar koding!"',
    text: "💻 Aku belajar koding hari ini!",
    emoji: "💻",
  },
  {
    id: "msg3",
    label: '"Ayo main lagi!"',
    text: "🎮 Ayo klik-klik lagi, seru!",
    emoji: "🎮",
  },
];

const BTN_OPTIONS = [
  { id: "grape", label: "ungu", color: "#8C6EFF" },
  { id: "coral", label: "merah muda", color: "#FF6B6B" },
  { id: "leaf", label: "hijau", color: "#5FCB6C" },
  { id: "sun", label: "kuning", color: "#FFC93C" },
];

// accentClass = warna chip di code editor. Dipakai sebagai class Tailwind
// statis (bukan inline style) karena warnanya tetap, tidak ikut berubah
// seperti warna latar/tombol yang memang harus dinamis mengikuti pilihan anak.
const FIELD_META = {
  bg: { title: "Pilih warna latar 🎨", options: BG_OPTIONS },
  heading: {
    title: "Pilih judul sapaan ✍️",
    options: HEADING_OPTIONS,
    accentClass: "bg-tag-html",
  },
  avatar: {
    title: "Pilih gambar favoritmu 🖼️",
    options: AVATAR_OPTIONS,
    accentClass: "bg-tag-attr",
  },
  shape: {
    title: "Pilih bentuk bingkai 🔲",
    options: SHAPE_OPTIONS,
    accentClass: "bg-mint-border",
  },
  msg: {
    title: "Pilih pesan di bawah gambar 💬",
    options: MSG_OPTIONS,
    accentClass: "bg-peach",
  },
  btn: {
    title: "Pilih warna tombol 🔘",
    options: BTN_OPTIONS,
    accentClass: "bg-lavender-chip",
  },
};

const MISSIONS = [
  {
    id: "m1",
    text: "Ubah langit jadi malam",
    emoji: "🌙",
    badge: "🌙",
    check: (s) => s.bg === "night",
  },
  {
    id: "m2",
    text: 'Judul jadi "Selamat Datang"',
    emoji: "🎉",
    badge: "🎉",
    check: (s) => s.heading === "selamat",
  },
  {
    id: "m3",
    text: "Ganti gambar jadi robot",
    emoji: "🤖",
    badge: "🤖",
    check: (s) => s.avatar === "robot",
  },
  {
    id: "m4",
    text: "Bingkai jadi lingkaran",
    emoji: "⚪",
    badge: "🏅",
    check: (s) => s.shape === "circle",
  },
  {
    id: "m5",
    text: "Tombol jadi hijau",
    emoji: "🟢",
    badge: "🍀",
    check: (s) => s.btn === "leaf",
  },
];

const PRAISES = [
  "Keren! 🎉",
  "Mantap! 👍",
  "Asik banget! 😄",
  "Kamu jago! 🌟",
  "Terus coba! 🚀",
];

function findOption(field, id) {
  return FIELD_META[field].options.find((o) => o.id === id);
}

/* =========================================================================
   LANGKAH 7 — SUARA & CONFETTI
   Efek "berasa" (bunyi, kertas warna-warni) hidup di custom hook terpisah,
   supaya komponen tampilan tinggal manggil playPop() dsb tanpa tahu detailnya.
   ========================================================================= */

function useSoundEffects() {
  const ctxRef = useRef(null);

  const tone = useCallback((freq, duration, type, vol) => {
    try {
      ctxRef.current =
        ctxRef.current ||
        new (window.AudioContext || window.webkitAudioContext)();
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = vol;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + duration,
      );
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      /* audio tidak tersedia, biarkan senyap */
    }
  }, []);

  const playPop = useCallback(() => {
    tone(700, 0.09, "square", 0.07);
    setTimeout(() => tone(1000, 0.07, "square", 0.05), 50);
  }, [tone]);

  const playMission = useCallback(() => {
    tone(784, 0.12, "sine", 0.09);
    setTimeout(() => tone(1175, 0.18, "sine", 0.11), 110);
  }, [tone]);

  const playAllDone = useCallback(() => {
    [523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => tone(f, 0.16, "triangle", 0.1), i * 90),
    );
  }, [tone]);

  const playClick = useCallback(() => tone(500, 0.09, "square", 0.06), [tone]);

  return { playPop, playMission, playAllDone, playClick };
}

function useConfetti() {
  const [pieces, setPieces] = useState([]);
  const idRef = useRef(0);
  const colors = ["#FFC93C", "#FF6B6B", "#3FC1C9", "#8C6EFF", "#5FCB6C"];

  const burst = useCallback(
    (count = 40) => {
      const fresh = Array.from({ length: count }, () => {
        idRef.current += 1;
        return {
          id: idRef.current,
          left: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 6 + Math.random() * 8,
          duration: 2 + Math.random() * 1.5,
        };
      });
      setPieces((prev) => [...prev, ...fresh]);
      const ids = fresh.map((p) => p.id);
      setTimeout(
        () => setPieces((prev) => prev.filter((p) => !ids.includes(p.id))),
        3800,
      );
    },
    [colors],
  );

  return { pieces, burst };
}

/* =========================================================================
   KOMPONEN KECIL & YANG DIPAKAI BERULANG
   ========================================================================= */

// Bingkai putih dengan border ungu muda + "hard shadow" — dipakai baik oleh
// panel Live Preview maupun Code Editor, jadi cukup ditulis sekali di sini.
function Panel({ children }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-3xl border-[3px] border-lilac bg-white shadow-card">
      {children}
    </div>
  );
}

function PanelHeader({ label, tagClassName, hint }) {
  return (
    <div className="flex flex-shrink-0 flex-wrap items-center gap-2.5 px-5 py-2.5">
      <span
        className={`rounded-full px-3 py-1 text-xs font-extrabold tracking-wide ${tagClassName}`}
      >
        {label}
      </span>
      <small className="text-xs font-semibold text-muted">{hint}</small>
    </div>
  );
}

function StatPill({ tone, children }) {
  const toneClasses = {
    honey: "border-honey-border bg-honey text-honey-text",
    mint: "border-mint-border bg-mint text-mint-text",
  };
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-bold ${toneClasses[tone]}`}
    >
      {children}
    </div>
  );
}

// Tombol "chip" berwarna di code editor. `colorStyle` dipakai kalau warnanya
// harus mengikuti data (mis. warna latar yang lagi dipilih anak), sedangkan
// `colorClassName` dipakai kalau warnanya tetap/dekoratif.
function Chip({ label, colorClassName, colorStyle, onClick }) {
  return (
    <button
      onClick={onClick}
      style={colorStyle}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-extrabold text-inkdeep shadow-chip transition-transform hover:-translate-y-0.5 active:translate-y-0.5 ${colorClassName ?? ""}`}
    >
      {label} <span className="text-xs opacity-70">▾</span>
    </button>
  );
}

function PickerModal({ field, onPick, onClose }) {
  if (!field) return null;
  const meta = FIELD_META[field];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-xl font-extrabold text-ink">{meta.title}</h3>
        <div className="grid grid-cols-3 gap-2.5">
          {meta.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onPick(field, opt.id)}
              className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-lilac p-3 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 hover:border-grape"
            >
              {field === "btn" ? (
                <span
                  className="h-8 w-8 rounded-full"
                  style={{ background: opt.color }}
                />
              ) : (
                <span className="text-2xl">{opt.emoji}</span>
              )}
              {opt.label}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-mist-2 py-2.5 font-extrabold text-grape"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   LANGKAH 3 — LIVE PREVIEW
   Komponen "bodoh": cuma menerima data lewat props dan menampilkannya.
   ========================================================================= */

function LivePreview({ selections, onClickCta }) {
  const bg = findOption("bg", selections.bg);
  const heading = findOption("heading", selections.heading);
  const avatar = findOption("avatar", selections.avatar);
  const msg = findOption("msg", selections.msg);
  const btn = findOption("btn", selections.btn);
  const isCircle = selections.shape === "circle";

  return (
    <Panel>
      <PanelHeader
        label="LIVE PREVIEW"
        tagClassName="bg-sky text-teal-deep"
        hint="Berubah otomatis begitu kamu klik tombol warna-warni"
      />

      <div className="mx-3.5 mt-2 flex flex-shrink-0 items-center gap-2 rounded-lg bg-mist px-3.5 py-1.5 text-xs font-bold text-muted">
        <span className="opacity-60">🔒</span> myawesome.website
      </div>

      {/* Warna latar sengaja tetap inline style: nilainya datang dari data
          (BG_OPTIONS) yang dipilih anak saat itu juga, bukan konstanta desain. */}
      <div
        className="relative m-3 flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl px-5 py-4 transition-colors duration-500"
        style={{ background: bg.css }}
      >
        <div className="absolute -right-[50px] -top-[60px] h-[170px] w-[170px] rounded-full bg-white/25" />
        <div className="absolute -bottom-[40px] -left-[30px] h-[110px] w-[110px] rounded-full bg-white/25" />

        <div className="relative z-10 text-center text-[clamp(22px,3.4vh,34px)] font-extrabold [text-shadow:0_3px_0_rgba(0,0,0,.08)]">
          {heading.text}
        </div>

        <div
          className={`relative z-10 flex h-[clamp(90px,20vh,170px)] w-[clamp(90px,20vh,170px)] items-center justify-center overflow-hidden border-[5px] border-white/85 bg-white text-[clamp(46px,10vh,90px)] shadow-avatar ${
            isCircle ? "rounded-full" : "rounded-[22px]"
          }`}
        >
          {avatar.emoji}
        </div>

        <div className="relative z-10 rounded-full bg-white/90 px-5 py-2 text-center text-sm font-bold shadow-bubble">
          {msg.text}
        </div>

        {/* Warna tombol juga inline: mengikuti pilihan warna tombol anak. */}
        <button
          onClick={onClickCta}
          className="relative z-10 cursor-pointer rounded-2xl px-6 py-2.5 text-[15px] font-extrabold text-white shadow-cta transition-transform active:translate-y-1"
          style={{ background: btn.color }}
        >
          Klik aku!
        </button>
      </div>
    </Panel>
  );
}

/* =========================================================================
   LANGKAH 4 — CODE EDITOR
   Baris kode "palsu" ditulis sekali di JSX, tapi tiap chip warnanya
   mengambil data dari FIELD_META/BG_OPTIONS di atas — bukan angka ajaib.
   ========================================================================= */

function CodeLine({ n, indent = 0, italic = false, children }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 rounded-lg px-3.5 py-[3px] leading-relaxed ${
        italic ? "italic text-code-comment" : ""
      }`}
    >
      <span className="w-[22px] flex-shrink-0 select-none text-xs text-code-linenum">
        {n}
      </span>
      {indent > 0 && <span style={{ paddingLeft: indent * 16 }} />}
      {children}
    </div>
  );
}
function Html({ children }) {
  return <span className="text-tag-html">{children}</span>;
}
function Attr({ children }) {
  return <span className="text-tag-attr">{children}</span>;
}

function CodeEditor({ selections, onOpenPicker }) {
  const bg = findOption("bg", selections.bg);
  const heading = findOption("heading", selections.heading);
  const avatar = findOption("avatar", selections.avatar);
  const shape = findOption("shape", selections.shape);
  const msg = findOption("msg", selections.msg);
  const btn = findOption("btn", selections.btn);

  return (
    <Panel>
      <PanelHeader
        label="CODE EDITOR"
        tagClassName="bg-ink text-lavender-100"
        hint="Klik tombol berwarna untuk mengubah website-mu"
      />

      <div className="m-3 min-h-0 flex-1 overflow-y-auto rounded-2xl bg-code-bg px-2 py-3 font-mono text-sm text-code-text [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <CodeLine n={1} italic>
          &lt;!-- Website kamu sendiri! --&gt;
        </CodeLine>
        <CodeLine n={2}>
          <Html>&lt;!DOCTYPE html&gt;</Html>
        </CodeLine>
        <CodeLine n={3}>
          <Html>&lt;html&gt;</Html>
        </CodeLine>
        <CodeLine n={4} indent={1}>
          <Html>&lt;head&gt;</Html>
        </CodeLine>
        <CodeLine n={5} indent={2}>
          <Html>&lt;title&gt;</Html>Website Keren-ku<Html>&lt;/title&gt;</Html>
        </CodeLine>
        <CodeLine n={6} indent={1}>
          <Html>&lt;/head&gt;</Html>
        </CodeLine>
        <CodeLine n={7} />
        <CodeLine n={8} indent={1}>
          <Html>&lt;body</Html> <Attr>background-color</Attr>="
          <Chip
            label={bg.label}
            colorStyle={{ background: bg.swatch }}
            onClick={() => onOpenPicker("bg")}
          />
          "&gt;
        </CodeLine>
        <CodeLine n={9} />
        <CodeLine n={10} indent={2}>
          <Html>&lt;h1</Html> <Attr>class</Attr>="judul"&gt;
          <Chip
            label={heading.label}
            colorClassName={FIELD_META.heading.accentClass}
            onClick={() => onOpenPicker("heading")}
          />
          <Html>&lt;/h1&gt;</Html>
        </CodeLine>
        <CodeLine n={11} />
        <CodeLine n={12} indent={2}>
          <Html>&lt;img</Html>
        </CodeLine>
        <CodeLine n={13} indent={3}>
          <Attr>src</Attr>="
          <Chip
            label={avatar.label}
            colorClassName={FIELD_META.avatar.accentClass}
            onClick={() => onOpenPicker("avatar")}
          />
          "
        </CodeLine>
        <CodeLine n={14} indent={3}>
          <Attr>bentuk</Attr>="
          <Chip
            label={shape.label}
            colorClassName={FIELD_META.shape.accentClass}
            onClick={() => onOpenPicker("shape")}
          />
          "&gt;
        </CodeLine>
        <CodeLine n={15} />
        <CodeLine n={16} indent={2}>
          <Html>&lt;p&gt;</Html>
          <Chip
            label={msg.label}
            colorClassName={FIELD_META.msg.accentClass}
            onClick={() => onOpenPicker("msg")}
          />
          <Html>&lt;/p&gt;</Html>
        </CodeLine>
        <CodeLine n={17} />
        <CodeLine n={18} indent={2}>
          <Html>&lt;button</Html> <Attr>warna</Attr>="
          <Chip
            label={btn.label}
            colorClassName={FIELD_META.btn.accentClass}
            onClick={() => onOpenPicker("btn")}
          />
          "&gt;
        </CodeLine>
        <CodeLine n={19} indent={1}>
          <Html>&lt;/body&gt;</Html>
        </CodeLine>
        <CodeLine n={20}>
          <Html>&lt;/html&gt;</Html>
        </CodeLine>
      </div>

      <div className="mx-4 mb-3 mt-1 flex flex-shrink-0 items-center gap-1.5 text-xs font-semibold text-muted">
        Coba klik semua tombol warna-warni, lihat apa yang berubah di sebelah
        kiri!
      </div>
    </Panel>
  );
}

/* =========================================================================
   LANGKAH 6 — MISI & LENCANA
   ========================================================================= */

function MissionBar({ completedMissions }) {
  return (
    <div className="flex flex-shrink-0 items-center gap-3 overflow-x-auto rounded-2xl border-[3px] border-lilac bg-white px-3.5 py-2 shadow-card [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-shrink-0 items-center gap-2">
        <span className="flex-shrink-0 whitespace-nowrap text-xs font-extrabold text-muted">
          🎯 MISI
        </span>
        <div className="flex gap-2">
          {MISSIONS.map((m) => {
            const done = !!completedMissions[m.id];
            return (
              <div
                key={m.id}
                className={`flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${
                  done ? "bg-mint text-mint-text" : "bg-mist text-ink"
                }`}
              >
                {done && <span>✅</span>}
                <span>{m.emoji}</span>
                <span className={done ? "opacity-70 line-through" : ""}>
                  {m.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-0.5 flex-shrink-0 self-stretch bg-lilac" />

      <div className="flex flex-shrink-0 items-center gap-2">
        <span className="flex-shrink-0 whitespace-nowrap text-xs font-extrabold text-muted">
          LENCANA
        </span>
        <div className="flex gap-2">
          {MISSIONS.map((m) => {
            const done = !!completedMissions[m.id];
            return (
              <div
                key={m.id}
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-base transition-all duration-300 ${
                  done
                    ? "bg-honey opacity-100"
                    : "bg-mist-2 opacity-[0.35] grayscale"
                }`}
              >
                {done ? m.badge : "?"}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   OVERLAY: TOAST & CONFETTI
   ========================================================================= */

function Toast({ message, visible }) {
  return (
    <div
      className={`fixed left-1/2 top-6 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-ink px-6 py-3.5 text-[15px] font-extrabold text-white shadow-toast transition-transform duration-500 ${
        visible ? "translate-y-0" : "-translate-y-32"
      }`}
    >
      {message}
    </div>
  );
}

function ConfettiLayer({ pieces }) {
  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="fixed top-[-20px] z-[70] animate-fall rounded-sm"
          style={{
            left: `${p.left}vw`,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </>
  );
}

/* =========================================================================
   LANGKAH 2 — APP (state utama + efek)
   ========================================================================= */

export default function App() {
  const [selections, setSelections] = useState({
    bg: "sky",
    heading: "halo",
    avatar: "cat",
    shape: "round",
    msg: "msg1",
    btn: "grape",
  });
  const [completedMissions, setCompletedMissions] = useState({});
  const [pickerField, setPickerField] = useState(null);
  const [toast, setToast] = useState({ message: "", visible: false });

  const { playPop, playMission, playAllDone, playClick } = useSoundEffects();
  const { pieces, burst } = useConfetti();

  const toastTimer = useRef(null);
  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast({ message, visible: true });
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      1300,
    );
  }, []);

  const missionsDoneCount = Object.keys(completedMissions).length;

  // Cek misi otomatis tiap kali pilihan berubah — tidak perlu panggil manual.
  useEffect(() => {
    MISSIONS.forEach((m) => {
      if (!completedMissions[m.id] && m.check(selections)) {
        setCompletedMissions((prev) => {
          const next = { ...prev, [m.id]: true };
          if (Object.keys(next).length === MISSIONS.length) {
            playAllDone();
            showToast("🏆 Semua misi selesai, kamu jagoan kode!");
            burst(50);
          } else {
            playMission();
            showToast(`🎖️ Misi selesai: ${m.text}!`);
            burst(18);
          }
          return next;
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selections]);

  function pick(field, id) {
    setSelections((prev) => ({ ...prev, [field]: id }));
    playPop();
    setPickerField(null);
    showToast(PRAISES[Math.floor(Math.random() * PRAISES.length)]);
  }

  function handleCtaClick() {
    playClick();
    showToast("🎉 Asiiik, tombolnya berhasil diklik!");
    burst(40);
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-cream px-5 py-3.5 font-heading text-ink">
      {/* Header */}
      <div className="mx-auto mb-2.5 flex w-full max-w-[1300px] flex-shrink-0 flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 animate-bob items-center justify-center rounded-2xl bg-gradient-to-br from-grape to-[#6B4FE0] text-2xl shadow-mascot">
            🚀
          </div>
          <div>
            <h1 className="m-0 text-xl font-extrabold">
              Buat Website Sendiri!
            </h1>
            <p className="m-0 text-xs font-medium text-muted">
              Jadi web developer cilik
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <StatPill tone="honey">
            {missionsDoneCount}/{MISSIONS.length} Misi
          </StatPill>
          <StatPill tone="mint">🟢 Online</StatPill>
        </div>
      </div>

      {/* Misi & lencana */}
      <div className="mx-auto mb-2.5 w-full max-w-[1300px] flex-shrink-0">
        <MissionBar completedMissions={completedMissions} />
      </div>

      {/* Grid utama */}
      <div className="mx-auto grid w-full max-w-[1300px] min-h-0 flex-1 grid-cols-[1.05fr_1fr] gap-5">
        <LivePreview selections={selections} onClickCta={handleCtaClick} />
        <CodeEditor selections={selections} onOpenPicker={setPickerField} />
      </div>

      <PickerModal
        field={pickerField}
        onPick={pick}
        onClose={() => setPickerField(null)}
      />
      <Toast message={toast.message} visible={toast.visible} />
      <ConfettiLayer pieces={pieces} />
    </div>
  );
}
