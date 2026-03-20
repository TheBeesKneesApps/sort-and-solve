import { useState, useEffect } from "react";

const COLORS = {
  bg: "#FAFAF8",
  card: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#7A7A72",
  textTertiary: "#AEAEA6",
  border: "#ECECEA",
  tileDefault: "#F0F0EE",
  tileSelected: "#1A1A1A",
  tileSelectedText: "#FFFFFF",
  primary: "#1A1A1A",
  primaryLight: "#F0F0EE",
  category: ["#7B68EE", "#2EAE7B", "#E8723A", "#3B82F6"],
  categoryLight: ["#EEEDFE", "#E1F5EE", "#FAECE7", "#E6F1FB"],
  categoryDark: ["#4A3FB0", "#1B7A53", "#B85425", "#2563EB"],
  accent: "#E8723A",
  danger: "#E24B4A",
  dangerLight: "#FCEBEB",
  success: "#2EAE7B",
  successLight: "#E1F5EE",
  warning: "#D97706",
  warningLight: "#FAEEDA",
};

const PUZZLES = [
  { label: "Shades of red", words: ["CRIMSON", "RUBY", "SCARLET", "CHERRY"], difficulty: 0 },
  { label: "Musical instruments", words: ["VIOLIN", "PIANO", "DRUM", "GUITAR"], difficulty: 1 },
  { label: "Planets", words: ["MARS", "JUPITER", "SATURN", "NEPTUNE"], difficulty: 2 },
  { label: "Types of fish", words: ["SALMON", "TUNA", "BASS", "TROUT"], difficulty: 3 },
];

const ALL_WORDS = PUZZLES.flatMap(c => c.words);

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const Phone = ({ children, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
    <div style={{
      width: 300, minHeight: 620, background: COLORS.bg, borderRadius: 32,
      border: `2px solid ${COLORS.border}`, overflow: "hidden", position: "relative",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        height: 32, display: "flex", alignItems: "center", justifyContent: "center",
        paddingTop: 8,
      }}>
        <div style={{ width: 80, height: 5, borderRadius: 3, background: COLORS.border }} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {children}
      </div>
      <div style={{ height: 20, display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 6 }}>
        <div style={{ width: 100, height: 4, borderRadius: 2, background: COLORS.border }} />
      </div>
    </div>
    {label && <span style={{ fontSize: 12, color: COLORS.textTertiary, fontWeight: 500, letterSpacing: 0.5 }}>{label}</span>}
  </div>
);

const CategoryBar = ({ category, index, style = {} }) => (
  <div style={{
    background: COLORS.category[category.difficulty],
    borderRadius: 10, padding: "10px 14px", ...style,
  }}>
    <div style={{
      fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.95)",
      textTransform: "uppercase", letterSpacing: 1.2,
    }}>{category.label}</div>
    <div style={{
      fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 3, fontWeight: 400,
    }}>{category.words.join("  ·  ")}</div>
  </div>
);

const Tile = ({ word, selected, onClick, hinted }) => (
  <div
    onClick={onClick}
    style={{
      background: selected ? COLORS.tileSelected : hinted ? "#FEF3C7" : COLORS.tileDefault,
      color: selected ? COLORS.tileSelectedText : COLORS.text,
      borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
      height: 44, fontSize: 12, fontWeight: 600, letterSpacing: 0.3,
      cursor: "pointer", userSelect: "none",
      transition: "all 0.15s ease",
      border: hinted ? "1.5px solid #F59E0B" : "1.5px solid transparent",
    }}
  >{word}</div>
);

const LivesDots = ({ remaining, total = 4 }) => (
  <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", padding: "8px 0" }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{
        width: 8, height: 8, borderRadius: 4,
        background: i < remaining ? COLORS.danger : COLORS.border,
        transition: "all 0.3s ease",
      }} />
    ))}
  </div>
);

const Btn = ({ children, primary, warning, small, disabled, onClick, style = {} }) => (
  <div
    onClick={disabled ? undefined : onClick}
    style={{
      padding: small ? "8px 16px" : "12px 20px",
      borderRadius: 10,
      fontSize: small ? 13 : 14,
      fontWeight: 600,
      textAlign: "center",
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.4 : 1,
      background: primary ? COLORS.text : warning ? COLORS.warningLight : "transparent",
      color: primary ? "#FFF" : warning ? "#92400E" : COLORS.text,
      border: primary || warning ? "none" : `1.5px solid ${COLORS.border}`,
      userSelect: "none",
      transition: "all 0.15s ease",
      ...style,
    }}
  >{children}</div>
);

const HomeScreen = () => (
  <div style={{ flex: 1, padding: "12px 18px", display: "flex", flexDirection: "column" }}>
    <div style={{ textAlign: "center", paddingTop: 16, paddingBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: COLORS.textTertiary }}>word puzzle</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.text, marginTop: 2, letterSpacing: -0.5 }}>Sort & Solve</div>
    </div>

    <div style={{
      background: COLORS.text, borderRadius: 14, padding: "18px 16px",
      color: "#FFF", marginBottom: 10, cursor: "pointer",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Daily puzzle</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 3 }}>March 17, 2026</div>
        </div>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 5l5 5-5 5" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>

    <div style={{
      background: COLORS.card, borderRadius: 14, padding: "16px 16px",
      border: `1.5px solid ${COLORS.border}`, marginBottom: 10, cursor: "pointer",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>Free puzzles</div>
          <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 3 }}>23 of 50 completed</div>
        </div>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 5l5 5-5 5" stroke={COLORS.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <div style={{ marginTop: 10, height: 4, borderRadius: 2, background: COLORS.tileDefault }}>
        <div style={{ width: "46%", height: "100%", borderRadius: 2, background: COLORS.success }} />
      </div>
    </div>

    <div style={{
      background: COLORS.card, borderRadius: 14, padding: "16px 16px",
      border: `1.5px solid ${COLORS.border}`, marginBottom: 10, cursor: "pointer",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>Puzzle packs</div>
          <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 3 }}>Music, movies, sports & more</div>
        </div>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 5l5 5-5 5" stroke={COLORS.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>

    <div style={{ flex: 1 }} />

    <div style={{ display: "flex", justifyContent: "center", gap: 28, padding: "12px 0 4px" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>5</div>
        <div style={{ fontSize: 11, color: COLORS.textTertiary, marginTop: 1 }}>streak</div>
      </div>
      <div style={{ width: 1, background: COLORS.border }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>23</div>
        <div style={{ fontSize: 11, color: COLORS.textTertiary, marginTop: 1 }}>solved</div>
      </div>
      <div style={{ width: 1, background: COLORS.border }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>12</div>
        <div style={{ fontSize: 11, color: COLORS.textTertiary, marginTop: 1 }}>best</div>
      </div>
    </div>

    <div style={{
      marginTop: 12, padding: "8px", borderRadius: 8, background: COLORS.tileDefault,
      textAlign: "center", fontSize: 10, color: COLORS.textTertiary,
    }}>Ad banner</div>
  </div>
);

const GameScreen = ({ solved = [], selected = [], lives = 3, words = null }) => {
  const solvedWords = new Set(solved.flatMap(c => c.words));
  const remaining = (words || shuffleArray(ALL_WORDS)).filter(w => !solvedWords.has(w));

  return (
    <div style={{ flex: 1, padding: "8px 14px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 4px 12px" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 5l-5 5 5 5" stroke={COLORS.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>Daily puzzle</div>
        <div style={{
          fontSize: 12, fontWeight: 600, color: COLORS.warning,
          background: COLORS.warningLight, padding: "3px 10px", borderRadius: 20,
        }}>3 hints</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 6 }}>
        {solved.map((cat, i) => (
          <CategoryBar key={i} category={cat} index={i} />
        ))}
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6,
        marginBottom: 6,
      }}>
        {remaining.map((word, i) => (
          <Tile key={word} word={word} selected={selected.includes(word)} />
        ))}
      </div>

      <LivesDots remaining={lives} />

      <div style={{ display: "flex", gap: 8, padding: "4px 0" }}>
        <Btn small style={{ flex: 1 }}>Shuffle</Btn>
        <Btn small style={{ flex: 1 }}>Deselect</Btn>
        <Btn small primary disabled={selected.length < 4} style={{ flex: 1 }}>Submit</Btn>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{
        padding: "8px", borderRadius: 8, background: COLORS.tileDefault,
        textAlign: "center", fontSize: 10, color: COLORS.textTertiary,
      }}>Ad banner</div>
    </div>
  );
};

const WinScreen = () => (
  <div style={{ flex: 1, padding: "8px 14px", display: "flex", flexDirection: "column" }}>
    <div style={{ textAlign: "center", paddingTop: 20, paddingBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: COLORS.success }}>Puzzle complete</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, marginTop: 4, letterSpacing: -0.5 }}>Solved!</div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
      {PUZZLES.map((cat, i) => (
        <CategoryBar key={i} category={cat} index={i} />
      ))}
    </div>

    <div style={{
      display: "flex", gap: 12, justifyContent: "center", padding: "12px 0",
      borderTop: `1.5px solid ${COLORS.border}`, borderBottom: `1.5px solid ${COLORS.border}`,
      marginBottom: 16,
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>3:42</div>
        <div style={{ fontSize: 11, color: COLORS.textTertiary }}>time</div>
      </div>
      <div style={{ width: 1, background: COLORS.border }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>1</div>
        <div style={{ fontSize: 11, color: COLORS.textTertiary }}>mistakes</div>
      </div>
      <div style={{ width: 1, background: COLORS.border }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>0</div>
        <div style={{ fontSize: 11, color: COLORS.textTertiary }}>hints</div>
      </div>
      <div style={{ width: 1, background: COLORS.border }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.accent }}>5</div>
        <div style={{ fontSize: 11, color: COLORS.textTertiary }}>streak</div>
      </div>
    </div>

    <div style={{ display: "flex", gap: 8 }}>
      <Btn primary style={{ flex: 1 }}>Share result</Btn>
      <Btn style={{ flex: 1 }}>Next puzzle</Btn>
    </div>

    <div style={{ flex: 1 }} />
  </div>
);

const LoseScreen = () => (
  <div style={{ flex: 1, padding: "8px 14px", display: "flex", flexDirection: "column" }}>
    <div style={{ textAlign: "center", paddingTop: 20, paddingBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: COLORS.danger }}>out of lives</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, marginTop: 4, letterSpacing: -0.5 }}>So close!</div>
      <div style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4 }}>You found 2 of 4 groups</div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
      {PUZZLES.map((cat, i) => (
        <div key={i} style={{ opacity: i < 2 ? 1 : 0.55 }}>
          <CategoryBar category={cat} index={i} />
        </div>
      ))}
    </div>

    <Btn warning style={{ marginBottom: 8 }}>Watch ad to retry</Btn>

    <div style={{ display: "flex", gap: 8 }}>
      <Btn primary style={{ flex: 1 }}>Share result</Btn>
      <Btn style={{ flex: 1 }}>Next puzzle</Btn>
    </div>

    <div style={{ flex: 1 }} />
  </div>
);

const PacksScreen = () => {
  const categories = [
    {
      name: "General", packs: [
        { name: "Pop Culture", count: 40, price: "$1.99" },
        { name: "Science & Nature", count: 40, price: "$1.99" },
        { name: "Food & Drink", count: 40, price: "$1.99" },
        { name: "Geography", count: 40, price: "$1.99" },
        { name: "Tricky Mix", count: 40, price: "$2.99" },
      ], bundle: "$5.99"
    },
    {
      name: "Music", packs: [
        { name: "Rap & Hip Hop", count: 40, price: "$1.99" },
        { name: "Rock", count: 40, price: "$1.99" },
        { name: "Country", count: 40, price: "$1.99" },
        { name: "80s Music", count: 40, price: "$1.99" },
        { name: "90s Music", count: 40, price: "$1.99" },
      ], bundle: "$5.99"
    },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px 8px" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 5l-5 5 5 5" stroke={COLORS.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.text }}>Puzzle packs</div>
        <div style={{ width: 20 }} />
      </div>

      <div style={{ flex: 1, padding: "6px 14px", overflow: "auto" }}>
        {categories.map((cat, ci) => (
          <div key={ci} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "0 4px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: COLORS.textTertiary }}>{cat.name}</div>
              <div style={{
                fontSize: 11, fontWeight: 600, color: COLORS.categoryDark[ci],
                background: COLORS.categoryLight[ci], padding: "3px 10px", borderRadius: 20,
              }}>Bundle {cat.bundle}</div>
            </div>
            <div style={{
              background: COLORS.card, borderRadius: 12,
              border: `1.5px solid ${COLORS.border}`, overflow: "hidden",
            }}>
              {cat.packs.map((pack, pi) => (
                <div key={pi} style={{
                  display: "flex", alignItems: "center", padding: "11px 14px",
                  borderTop: pi > 0 ? `1px solid ${COLORS.border}` : "none",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: COLORS.categoryLight[ci],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, marginRight: 12,
                    color: COLORS.categoryDark[ci],
                    fontWeight: 700,
                  }}>{pack.name[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{pack.name}</div>
                    <div style={{ fontSize: 11, color: COLORS.textTertiary }}>{pack.count} puzzles</div>
                  </div>
                  <div style={{
                    fontSize: 12, fontWeight: 600, color: COLORS.text,
                    background: COLORS.tileDefault, padding: "5px 14px", borderRadius: 20,
                  }}>{pack.price}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{
          background: COLORS.text, borderRadius: 12, padding: "14px 16px",
          textAlign: "center", marginBottom: 12,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#FFF" }}>Unlock everything</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>All packs, current & future · $14.99</div>
        </div>
      </div>
    </div>
  );
};

const SettingsScreen = () => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px 8px" }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 5l-5 5 5 5" stroke={COLORS.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.text }}>Settings</div>
      <div style={{ width: 20 }} />
    </div>

    <div style={{ padding: "6px 14px" }}>
      <div style={{
        background: COLORS.card, borderRadius: 12,
        border: `1.5px solid ${COLORS.border}`, overflow: "hidden", marginBottom: 16,
      }}>
        {[
          { label: "Remove ads", sub: "One-time purchase", action: "$2.99" },
          { label: "Sound effects", toggle: true },
          { label: "Haptic feedback", toggle: true },
          { label: "Daily reminder", sub: "9:00 AM", toggle: true },
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", padding: "13px 14px",
            borderTop: i > 0 ? `1px solid ${COLORS.border}` : "none",
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.text }}>{item.label}</div>
              {item.sub && <div style={{ fontSize: 11, color: COLORS.textTertiary, marginTop: 1 }}>{item.sub}</div>}
            </div>
            {item.action && (
              <div style={{
                fontSize: 12, fontWeight: 600, background: COLORS.accent, color: "#FFF",
                padding: "5px 14px", borderRadius: 20,
              }}>{item.action}</div>
            )}
            {item.toggle && (
              <div style={{
                width: 42, height: 24, borderRadius: 12, background: COLORS.success,
                position: "relative",
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 9, background: "#FFF",
                  position: "absolute", top: 3, right: 3,
                }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{
        background: COLORS.card, borderRadius: 12,
        border: `1.5px solid ${COLORS.border}`, overflow: "hidden", marginBottom: 16,
      }}>
        {["Rate this app", "Privacy policy", "Restore purchases", "Contact us"].map((label, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 14px",
            borderTop: i > 0 ? `1px solid ${COLORS.border}` : "none",
          }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: COLORS.text }}>{label}</span>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7 5l5 5-5 5" stroke={COLORS.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: COLORS.textTertiary, padding: "4px 4px 8px" }}>More games</div>
      <div style={{
        background: COLORS.card, borderRadius: 12,
        border: `1.5px solid ${COLORS.border}`, overflow: "hidden",
      }}>
        {[
          { name: "Is It Worth It?", tag: "See what things cost in hours", color: "#3B82F6" },
          { name: "Rate My Fridge", tag: "AI roasts your refrigerator", color: "#2EAE7B" },
          { name: "Red Flag", tag: "AI scans your conversations", color: "#E24B4A" },
        ].map((app, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", padding: "11px 14px",
            borderTop: i > 0 ? `1px solid ${COLORS.border}` : "none",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: app.color,
              marginRight: 12, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, color: "#FFF", fontWeight: 700,
            }}>{app.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{app.name}</div>
              <div style={{ fontSize: 11, color: COLORS.textTertiary }}>{app.tag}</div>
            </div>
            <div style={{
              fontSize: 11, fontWeight: 600, color: COLORS.primary,
              background: COLORS.primaryLight, padding: "4px 12px", borderRadius: 20,
            }}>Get</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SCREENS = [
  { id: "home", label: "Home" },
  { id: "game_start", label: "Gameplay" },
  { id: "game_mid", label: "Mid-game" },
  { id: "win", label: "Win" },
  { id: "lose", label: "Lose" },
  { id: "packs", label: "Packs" },
  { id: "settings", label: "Settings" },
];

export default function SortAndSolveUI() {
  const [activeScreen, setActiveScreen] = useState("home");
  const [shuffledWords] = useState(() => shuffleArray(ALL_WORDS));

  const selectedStart = [shuffledWords[2], shuffledWords[7], shuffledWords[11]];
  const selectedMid = [];

  const renderScreen = () => {
    switch (activeScreen) {
      case "home": return <HomeScreen />;
      case "game_start": return <GameScreen solved={[]} selected={selectedStart} lives={4} words={shuffledWords} />;
      case "game_mid": return <GameScreen solved={[PUZZLES[0], PUZZLES[1]]} selected={[]} lives={2} words={shuffledWords} />;
      case "win": return <WinScreen />;
      case "lose": return <LoseScreen />;
      case "packs": return <PacksScreen />;
      case "settings": return <SettingsScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>
      <div style={{
        display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24,
        justifyContent: "center",
      }}>
        {SCREENS.map(s => (
          <div
            key={s.id}
            onClick={() => setActiveScreen(s.id)}
            style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500,
              cursor: "pointer", userSelect: "none",
              background: activeScreen === s.id ? COLORS.text : "transparent",
              color: activeScreen === s.id ? "#FFF" : COLORS.textSecondary,
              border: activeScreen === s.id ? "none" : `1.5px solid ${COLORS.border}`,
              transition: "all 0.15s ease",
            }}
          >{s.label}</div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Phone label={SCREENS.find(s => s.id === activeScreen)?.label}>
          {renderScreen()}
        </Phone>
      </div>
    </div>
  );
}
