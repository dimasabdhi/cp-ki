import { useState, useEffect } from "react";

// --- Asset URLs (you can replace these with local files in /public later) ---
const LOGO_URL =
  "https://s3.ap-southeast-1.amazonaws.com/cdn.e-ujian.com/lembaga-logo/blob_6565_phpwBeewG_1633082792.png"; // Transparent PNG logo

const GALLERY = [
  {
    src: "https://www.kiyokuni.com/images/gur_in01.png",
    alt: "Factory exterior – EJIP",
    cat: "Factory",
  },
  {
    src: "https://www.kiyokuni.com/images/gur_in02.png",
    alt: "Factory exterior – Entrance",
    cat: "Factory",
  },
  {
    src: "/photos/wh-forklift.jpeg",
    alt: "Press machine group",
    cat: "Press",
  },
  {
    src: "/photos/factory-depan.jpeg",
    alt: "Factory",
    cat: "Tooling",
  },
  {
    src: "/photos/press-group-ok.jpeg",
    alt: "Press machine group",
    cat: "Press",
  },
  {
    src: "/photos/press-group-activity-part.jpeg",
    alt: "Press machine group",
    cat: "Press",
  },
  {
    src: "/photos/press-group-activity.jpeg",
    alt: "Press machine group",
    cat: "Press",
  },
  {
    src: "/photos/press-forklift-dies.jpeg",
    alt: "Press machine group",
    cat: "Press",
  },
  {
    src: "/photos/welding-press.jpeg",
    alt: "Press machine group",
    cat: "Press",
  },
  // Add more items here, e.g. { src: "/photos/press-line.jpg", alt: "Press Line", cat: "Tooling" }
];

const FILTERS = ["All", "Factory", "Tooling", "Assembly", "Office", "Press", "Assembly", ];

// Simple reveal-on-scroll wrapper
function Reveal({ children, className = "", delay = 0 }) {
  const [visible, setVisible] = useState(false);
  const [node, setNode] = useState(null);

  useEffect(() => {
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [node]);

  return (
    <div
      ref={setNode}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform-gpu transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Typewriter effect for small phrases
function Typewriter({ words = [], speed = 80, pause = 1200, className = "" }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [dir, setDir] = useState(1); // 1 typing, -1 deleting

  useEffect(() => {
    if (!words.length) return;
    const current = words[i];
    let t;
    if (dir === 1) {
      if (text.length < current.length) {
        t = setTimeout(() => setText(current.slice(0, text.length + 1)), speed);
      } else {
        t = setTimeout(() => setDir(-1), pause);
      }
    } else {
      if (text.length > 0) {
        t = setTimeout(
          () => setText(current.slice(0, text.length - 1)),
          Math.max(40, speed * 0.7)
        );
      } else {
        setDir(1);
        setI((i + 1) % words.length);
      }
    }
    return () => clearTimeout(t);
  }, [text, dir, i, words, speed, pause]);

  return (
    <span className={`whitespace-nowrap ${className}`}>
      {text}
      <span className="inline-block w-px h-5 align-[-2px] ml-1 bg-slate-400 animate-pulse" />
    </span>
  );
}

// Subtle dotted mesh background SVG
function MeshDots() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.08]" aria-hidden>
      <defs>
        <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#0ea5e9" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

// Image card with skeleton + hover overlay (works with masonry columns)
function ImageCard({ item, onClick, delay = 0 }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Reveal delay={delay} className="break-inside-avoid">
      <button
        onClick={onClick}
        className="group relative block w-full overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-shadow"
        aria-label={`Open image ${item.alt}`}
      >
        {!loaded && (
          <div className="aspect-[4/3] w-full animate-pulse bg-slate-200" />
        )}
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-auto transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-3 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          {item.alt}
        </div>
      </button>
    </Reveal>
  );
}

// Full-screen section wrapper
function FullSection({ id, className = "", children }) {
  return (
    <section
      id={id}
      className={`relative snap-start scroll-mt-20 min-h-[100svh] flex items-center ${className}`}
    >
      {children}
    </section>
  );
}

// Global keyframes/styles used by animated backgrounds
function GlobalStyles() {
  return (
    <style>{`
      @keyframes floatSlow { 0% { transform: translate3d(0,0,0) } 50% { transform: translate3d(12px,-10px,0) } 100% { transform: translate3d(0,0,0) } }
      @keyframes floatSlow2 { 0% { transform: translate3d(0,0,0) } 50% { transform: translate3d(-10px,8px,0) } 100% { transform: translate3d(0,0,0) } }
      @keyframes panBg { 0% { background-position: 0% 0% } 100% { background-position: 200% 0% } }
      .animate-float-slow { animation: floatSlow 18s ease-in-out infinite }
      .animate-float-slow2 { animation: floatSlow2 22s ease-in-out infinite }
      .animate-pan-slower { animation: panBg 60s linear infinite }
      /* Accessibility + manual toggle to disable/enable motion */
      @media (prefers-reduced-motion: reduce) {
        .animate-float-slow, .animate-float-slow2, .animate-pan-slower, .animate-pulse { animation: none !important }
        /* allow manual override when user toggles Motion ON */
        .motion-on .animate-float-slow { animation: floatSlow 18s ease-in-out infinite !important }
        .motion-on .animate-float-slow2 { animation: floatSlow2 22s ease-in-out infinite !important }
        .motion-on .animate-pan-slower { animation: panBg 60s linear infinite !important }
      }
      .motion-off .animate-float-slow,
      .motion-off .animate-float-slow2,
      .motion-off .animate-pan-slower,
      .motion-off .animate-pulse { animation: none !important }
    `}</style>
  );
}

// Per-section animated backgrounds
function SectionBackdrop({ variant = "default" }) {
  if (variant === "hero") return null; // hero already has its own bg
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* base soft gradient per section */}
      {variant === "gallery" && (
        <>
          {/* smooth moving gradient orbs only */}
          <div className="absolute -top-24 -left-24 w-[38rem] h-[38rem] rounded-full bg-sky-300/30 blur-3xl animate-float-slow" />
          <div className="absolute -bottom-24 -right-24 w-[32rem] h-[32rem] rounded-full bg-cyan-300/25 blur-3xl animate-float-slow2" />
        </>
      )}
      {variant === "about" && (
        <div className="absolute inset-0 bg-gradient-to-tr from-white to-sky-50" />
      )}
      {variant === "services" && (
        <>
          {/* orbs only (no stripes) */}
          <div className="absolute -top-16 right-[-6rem] w-[32rem] h-[32rem] rounded-full bg-sky-300/30 blur-3xl animate-float-slow2" />
          <div className="absolute bottom-[-6rem] left-[-6rem] w-[26rem] h-[26rem] rounded-full bg-cyan-200/30 blur-3xl animate-float-slow" />
        </>
      )}
      {variant === "certs" && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
      )}
      {variant === "contact" && (
        <>
          {/* orbs only (no stripes) */}
          <div className="absolute top-1/4 right-[-8rem] w-[34rem] h-[34rem] rounded-full bg-sky-200/35 blur-3xl animate-float-slow" />
          <div className="absolute bottom-[-8rem] left-[-8rem] w-[28rem] h-[28rem] rounded-full bg-emerald-200/30 blur-3xl animate-float-slow2" />
        </>
      )}

      {/* dotted texture */}
      <svg className="absolute inset-0 h-full w-full opacity-10" aria-hidden>
        <defs>
          <pattern
            id="dots2"
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="#0ea5e9" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots2)" />
      </svg>

      {/* floating blobs + subtle stripes (inline style to avoid Tailwind purge issues) */}
      {variant === "gallery" && (
        <>
          <div className="absolute -top-24 -left-24 w-[38rem] h-[38rem] rounded-full bg-sky-300/30 blur-3xl animate-float-slow" />
          <div className="absolute -bottom-24 -right-24 w-[32rem] h-[32rem] rounded-full bg-cyan-300/25 blur-3xl animate-float-slow2" />
          <div
            className="absolute inset-0 animate-pan-slower"
            style={{
              opacity: 0.12,
              backgroundSize: "200% 100%",
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(14,165,233,.22) 0 2px, transparent 2px 26px)",
            }}
          />
        </>
      )}
      {variant === "about" && (
        <>
          <div className="absolute top-1/3 -left-20 w-[28rem] h-[28rem] rounded-full bg-sky-200/35 blur-3xl animate-float-slow" />
          <div className="absolute -top-24 right-1/4 w-[22rem] h-[22rem] rounded-full bg-indigo-200/30 blur-3xl animate-float-slow2" />
        </>
      )}
      {variant === "services" && (
        <>
          <div
            className="absolute inset-0 animate-pan-slower"
            style={{
              opacity: 0.1,
              backgroundSize: "200% 100%",
              backgroundImage:
                "repeating-linear-gradient(120deg, rgba(2,132,199,.25) 0 2px, transparent 2px 22px)",
            }}
          />
          <div className="absolute -top-20 right-[-6rem] w-[30rem] h-[30rem] rounded-full bg-sky-300/30 blur-3xl animate-float-slow2" />
        </>
      )}
      {variant === "certs" && (
        <>
          <div className="absolute -bottom-24 left-[-6rem] w-[30rem] h-[30rem] rounded-full bg-emerald-200/30 blur-3xl animate-float-slow" />
        </>
      )}
      {variant === "contact" && (
        <>
          <div
            className="absolute inset-0 animate-pan-slower"
            style={{
              opacity: 0.1,
              backgroundSize: "200% 100%",
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(14,165,233,.22) 0 2px, transparent 2px 24px)",
            }}
          />
          <div className="absolute top-1/4 right-[-8rem] w-[34rem] h-[34rem] rounded-full bg-sky-200/35 blur-3xl animate-float-slow" />
        </>
      )}
    </div>
  );
}

const MAP_EJIP =
  "https://www.google.com/maps?q=PT.%20Kiyokuni%20Indonesia%20EJIP%20Plot%203K&output=embed";

export default function App() {
  const [open, setOpen] = useState(false);
  const [lightbox, setLightbox] = useState({ open: false, index: 0, seq: [] });
  const [activeCat, setActiveCat] = useState("All");
  const [motion, setMotion] = useState(true);

  // Respect user OS setting for reduced motion
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) setMotion(false);
    const handler = (e) => setMotion(!e.matches);
    if (media.addEventListener) media.addEventListener("change", handler);
    else media.addListener(handler);
    return () => {
      if (media.removeEventListener)
        media.removeEventListener("change", handler);
      else media.removeListener(handler);
    };
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightbox.open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox((s) => ({ ...s, open: false }));
      if (e.key === "ArrowRight")
        setLightbox((s) => ({
          ...s,
          index: (s.index + 1) % (s.seq?.length || 1),
        }));
      if (e.key === "ArrowLeft")
        setLightbox((s) => ({
          ...s,
          index: (s.index - 1 + (s.seq?.length || 1)) % (s.seq?.length || 1),
        }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox.open]);

  // smooth scroll helper (works even without CSS scroll-behavior)
  const smoothScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-800 scroll-smooth ${
        motion ? "motion-on" : "motion-off"
      }`}
    >
      <GlobalStyles />
      {/* Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          <a
            href="#home"
            className="flex items-center shrink-0"
            onClick={(e) => {
              e.preventDefault();
              smoothScroll("home");
            }}
          >
            <img
              src={LOGO_URL}
              alt="PT. Kiyokuni Indonesia logo"
              className="h-12 md:h-32 w-auto"
            />
          </a>
          <button
            className="md:hidden inline-flex items-center rounded-xl border px-3 py-2 text-sm"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a
              className="hover:text-sky-700"
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                smoothScroll("about");
              }}
            >
              About
            </a>
            <a
              className="hover:text-sky-700"
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                smoothScroll("services");
              }}
            >
              Capabilities
            </a>
            <a
              className="hover:text-sky-700"
              href="#certs"
              onClick={(e) => {
                e.preventDefault();
                smoothScroll("certs");
              }}
            >
              Certifications
            </a>
            <a
              className="hover:text-sky-700"
              href="#gallery"
              onClick={(e) => {
                e.preventDefault();
                smoothScroll("gallery");
              }}
            >
              Gallery
            </a>
            <a
              className="hover:text-sky-700"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                smoothScroll("contact");
              }}
            >
              Contact
            </a>
            <div className="h-6 w-px bg-slate-200" />
            <button
              type="button"
              onClick={() => setMotion((m) => !m)}
              aria-pressed={motion}
              aria-label="Toggle motion"
              className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
                motion
                  ? "bg-sky-600 border-sky-600"
                  : "bg-white border-slate-300"
              }`}
              title={motion ? "Motion: On" : "Motion: Off"}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition ${
                  motion ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </nav>
        </div>
        {/* mobile menu */}
        {open && (
          <div className="md:hidden border-t bg-white/90">
            <nav className="max-w-7xl mx-auto px-4 py-3 grid gap-2 text-sm">
              {[
                ["About", "#about"],
                ["Capabilities", "#services"],
                ["Certifications", "#certs"],
                ["Gallery", "#gallery"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  className="py-2"
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    smoothScroll(href.replace("#", ""));
                  }}
                >
                  {label}
                </a>
              ))}
              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <span className="text-slate-500">Motion</span>
                <button
                  type="button"
                  onClick={() => setMotion((m) => !m)}
                  aria-pressed={motion}
                  aria-label="Toggle motion"
                  className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
                    motion
                      ? "bg-sky-600 border-sky-600"
                      : "bg-white border-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition ${
                      motion ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="md:snap-y md:snap-mandatory">
        {/* Hero */}
        <FullSection id="home" className="overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-white to-sky-50" />
          {/* Decorative glow orb */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-[-8rem] w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-sky-300/40 via-cyan-300/20 to-transparent blur-3xl"
          />
          <MeshDots />
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-28">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-3 py-1 border text-xs mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-600 animate-pulse" />
                <span>Metal Stamping • Tooling • Assembly</span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-slate-900 to-sky-700 bg-clip-text text-transparent">
                  Precision Metal Stamping
                </span>
                <span> &amp; Tooling Solutions</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-4 text-slate-600 max-w-prose">
                Delivering high‑quality stamped parts and assemblies for office
                automation and automotive components, supported by in‑house
                tooling and a continuous improvement culture.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-2 text-slate-500 text-sm">
                Engineering for{" "}
                <Typewriter
                  words={["Office Automation", "Automotive"]}
                  className="font-medium text-slate-700"
                />
              </p>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScroll("contact");
                  }}
                  className="inline-flex items-center rounded-xl bg-sky-600 px-5 py-3 text-white font-medium shadow hover:bg-sky-700"
                >
                  Contact Us
                </a>
                <a
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScroll("services");
                  }}
                  className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 font-medium bg-white hover:bg-slate-50"
                >
                  Explore Capabilities
                </a>
              </div>
            </Reveal>
          </div>
        </FullSection>

        {/* Gallery */}
        <FullSection
          id="gallery"
          className="py-16 md:py-20 bg-white items-start"
        >
          <SectionBackdrop variant="gallery" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
            <div className="flex items-end justify-between gap-6">
              <h2 className="text-2xl md:text-3xl font-bold">Photo Gallery</h2>
              <a
                href={LOGO_URL}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-sky-700 hover:underline"
              >
                Download logo
              </a>
            </div>

            {/* Filter pills */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {FILTERS.map((cat) => {
                const count =
                  cat === "All"
                    ? GALLERY.length
                    : GALLERY.filter((g) => g.cat === cat).length;
                const active = activeCat === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                      active
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                    <span
                      className={`rounded-full text-[11px] px-1.5 ${
                        active ? "bg-white/20" : "bg-slate-100"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Masonry grid */}
            {(() => {
              const filtered = GALLERY.filter(
                (g) => activeCat === "All" || g.cat === activeCat
              );
              return (
                <div className="mt-6 columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
                  {filtered.map((item, i) => (
                    <ImageCard
                      key={`${item.src}-${i}`}
                      item={item}
                      delay={i * 70}
                      onClick={() =>
                        setLightbox({
                          open: true,
                          index: i,
                          seq: filtered.map((x) => x.src),
                        })
                      }
                    />
                  ))}
                </div>
              );
            })()}
          </div>
        </FullSection>

        {/* About */}
        <FullSection id="about" className="py-20 items-start">
          <SectionBackdrop variant="about" />
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-10 items-start">
              <div className="md:col-span-2">
                <Reveal>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    About the Company
                  </h2>
                </Reveal>
                <Reveal delay={100}>
                  <p className="mt-4 text-slate-700 leading-relaxed">
                    PT. Kiyokuni Indonesia is an affiliate of Kiyokuni Industry
                    Co., Ltd. (Japan). The company was legally established in
                    1995 and began commercial operations in May 1996. It
                    specializes in moulds and metal pressing for office
                    automation parts, and has since expanded to serve
                    multinational customers in Indonesia.
                  </p>
                </Reveal>
                <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                  {[
                    {
                      label: "Established",
                      value: "1995 (operations since May 1996)",
                    },
                    {
                      label: "Business",
                      value: "Metal Stamping, Tooling, Assembly",
                    },
                    { label: "Group", value: "Kiyokuni Group (Japan)" },
                    {
                      label: "Headcount",
                      value: "2,000+ across plants (group figures)",
                    },
                  ].map((it) => (
                    <li
                      key={it.label}
                      className="flex items-center gap-3 rounded-xl bg-white border p-4 shadow-sm"
                    >
                      <span className="text-sky-700 font-semibold w-28">
                        {it.label}
                      </span>
                      <span className="text-slate-700">{it.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-1">
                <div className="rounded-2xl bg-gradient-to-br from-sky-600 to-sky-500 text-white p-6 shadow-xl">
                  <h3 className="text-lg font-semibold">Quick Facts</h3>
                  <ul className="mt-4 space-y-3 text-sky-50/90">
                    <li>In‑house design & manufacture of dies/tooling</li>
                    <li>Progressive & tandem press lines</li>
                    <li>Assembly lines for OA & automotive components</li>
                    <li>On‑time delivery focus with quality-first mindset</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </FullSection>

        {/* Capabilities / Services */}
        <FullSection id="services" className="py-20 bg-white items-start">
          <SectionBackdrop variant="services" />
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold">
                Core Capabilities
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-3 text-slate-600 max-w-prose">
                End‑to‑end production from die design to stamping and assembly.
              </p>
            </Reveal>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Stamping Parts",
                  desc: "Small to medium‑large precision parts with progressive & tandem presses.",
                },
                {
                  title: "Assembly Units",
                  desc: "Manual & semi‑automated assembly lines for OA and automotive components.",
                },
                {
                  title: "Dies & Tooling",
                  desc: "In‑house design, manufacture and maintenance of tooling for quality assurance.",
                },
              ].map((card) => (
                <article
                  key={card.title}
                  className="group rounded-2xl border bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="h-12 w-12 rounded-xl bg-sky-100 border flex items-center justify-center mb-4">
                    <span className="text-xl">⚙️</span>
                  </div>
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="mt-2 text-slate-600">{card.desc}</p>
                  <div className="mt-4 text-sm text-sky-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more →
                  </div>
                </article>
              ))}
            </div>
          </div>
        </FullSection>

        {/* Certifications */}
        <FullSection id="certs" className="py-20 bg-slate-50 items-start">
          <SectionBackdrop variant="certs" />
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold">Certifications</h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-3 text-slate-600 max-w-prose">
                Certified management systems across quality and environment,
                with automotive scope in the group.
              </p>
            </Reveal>
            <div className="mt-6 flex flex-wrap gap-3">
              {["ISO 9001", "ISO 14001", "TS/IATF 16949 (Group)"]?.map(
                (tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-white border px-4 py-2 text-sm shadow-sm"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </FullSection>

        {/* Contact */}
        <FullSection id="contact" className="py-20 bg-white items-start">
          <SectionBackdrop variant="contact" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-10">
            <div>
              <Reveal>
                <h2 className="text-2xl md:text-3xl font-bold">Contact</h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="mt-3 text-slate-600 max-w-prose">
                  We operate from EJIP Industrial Park, Cikarang (Bekasi) and
                  Suryacipta City of Industry, Karawang.
                </p>
              </Reveal>
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border p-4 bg-slate-50">
                  <div className="font-semibold">Factory 1 – EJIP (Bekasi)</div>
                  <div className="text-slate-700">
                    Jl. Citanduy 1, Plot 3K, Cikarang Selatan, Bekasi 17550
                  </div>
                </div>
                <div className="rounded-xl border p-4 bg-slate-50">
                  <div className="font-semibold">
                    Engineering Division – EJIP (Bekasi)
                  </div>
                  <div className="text-slate-700">
                    Jalan Citanduy 5, Plot 8M-1, Cikarang Selatan, Bekasi 17550
                  </div>
                </div>
                <div className="rounded-xl border p-4 bg-slate-50">
                  <div className="font-semibold">Karawang – Suryacipta</div>
                  <div className="text-slate-700">
                    Jl. Surya Madya Kav. I-15D, Karawang 41361
                  </div>
                </div>
                <div className="rounded-xl border p-4">
                  <div className="text-slate-700">Phone: +62-21-897-0721</div>
                  <div className="text-slate-700">
                    Email:{" "}
                    <a
                      className="text-sky-700 hover:underline"
                      href="mailto:information@kiyokuni.co.id"
                    >
                      information@kiyokuni.co.id
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border shadow-sm">
              <iframe
                title="Map to PT. Kiyokuni Indonesia"
                src={MAP_EJIP}
                className="w-full h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </FullSection>
      </main>

      {lightbox.open && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox({ ...lightbox, open: false })}
        >
          <div
            className="relative max-w-[90vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.seq[lightbox.index]}
              alt={`Preview ${lightbox.index + 1}`}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            />
            <button
              className="absolute -top-4 -right-4 rounded-full bg-white/90 border shadow px-3 py-1 text-sm"
              onClick={() => setLightbox({ ...lightbox, open: false })}
              aria-label="Close"
            >
              ✕
            </button>
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 border shadow rounded-full w-10 h-10 grid place-items-center"
              onClick={() =>
                setLightbox((s) => ({
                  ...s,
                  index:
                    (s.index - 1 + (s.seq?.length || 1)) % (s.seq?.length || 1),
                }))
              }
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 border shadow rounded-full w-10 h-10 grid place-items-center"
              onClick={() =>
                setLightbox((s) => ({
                  ...s,
                  index: (s.index + 1) % (s.seq?.length || 1),
                }))
              }
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      )}

      <footer className="border-t bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-10 text-sm text-slate-500 flex flex-wrap items-center gap-3 justify-between">
          <div>© {new Date().getFullYear()} PT. Kiyokuni Indonesia</div>
          <div className="flex items-center gap-4">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                smoothScroll("home");
              }}
              className="hover:text-slate-700"
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
