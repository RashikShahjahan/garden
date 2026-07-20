"use client";

import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Bug,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  CloudRain,
  Droplets,
  Flower2,
  Home,
  Image,
  Leaf,
  ListChecks,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Pause,
  Plus,
  ScanLine,
  Search,
  Send,
  Sparkles,
  Sprout,
  SunMedium,
  Upload,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type Screen =
  | "welcome"
  | "setup"
  | "today"
  | "walk-overview"
  | "walk-guide"
  | "walk-summary"
  | "garden"
  | "assistant"
  | "activity"
  | "add-plant";
type WalkStatus = "pending" | "good" | "attention" | "skipped";

type WalkItem = {
  id: number;
  area: string;
  place: string;
  name: string;
  meta: string;
  prompt: string;
  detail: string;
  status: WalkStatus;
};

const initialWalkItems: WalkItem[] = [
  {
    id: 1,
    area: "Patio",
    place: "Container",
    name: "Cherry tomato",
    meta: "Established · Flowering",
    prompt: "Check the soil one finger deep. How does the plant look?",
    detail: "Containers dry faster, and today will be warm before the rain arrives.",
    status: "pending",
  },
  {
    id: 2,
    area: "Patio",
    place: "3 containers",
    name: "Herb pots",
    meta: "Basil, mint & parsley",
    prompt: "Look for drooping leaves and check the top layer of soil.",
    detail: "A quick check is enough. Water only if the soil feels dry.",
    status: "pending",
  },
  {
    id: 3,
    area: "Raised bed",
    place: "Leafy greens patch",
    name: "Kale & lettuce",
    meta: "Young plants",
    prompt: "Look under two or three leaves. Do you see fresh holes or insects?",
    detail: "You noticed a few small holes during the last walk.",
    status: "attention",
  },
  {
    id: 4,
    area: "Back border",
    place: "In-ground",
    name: "Hydrangea",
    meta: "Established · Flowering",
    prompt: "Compare the leaves with your last check. Are they still upright?",
    detail: "No action is expected unless the leaves are wilting before midday.",
    status: "pending",
  },
];

const navItems = [
  { label: "Today", icon: Home, screen: "today" as Screen },
  { label: "Garden", icon: Sprout, screen: "garden" as Screen },
  { label: "Assistant", icon: MessageCircle, screen: "assistant" as Screen },
  { label: "Activity", icon: ListChecks, screen: "activity" as Screen },
];

function Logo() {
  return (
    <div className="brand" aria-label="Verdant">
      <span className="brand-mark"><Leaf size={18} strokeWidth={2.4} /></span>
      <span>Verdant</span>
    </div>
  );
}

function AppNavigation({ activeScreen, onNavigate, onboarded }: { activeScreen: Screen; onNavigate: (screen: Screen) => void; onboarded: boolean }) {
  const activeSection = activeScreen.startsWith("walk") ? "today" : activeScreen === "add-plant" ? "garden" : activeScreen;
  return (
    <>
      <aside className="sidebar">
        <Logo />
        <nav className="nav-list" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.screen;
            return (
              <button
                className={`nav-item ${active ? "is-active" : ""}`}
                key={item.label}
                onClick={() => onboarded && onNavigate(item.screen)}
                aria-current={active ? "page" : undefined}
                aria-disabled={!onboarded}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-foot">
          <div className="garden-avatar">MG</div>
          <div>
            <strong>{onboarded ? "My first garden" : "Your garden"}</strong>
            <span>{onboarded ? "1 planting" : "Setup not started"}</span>
          </div>
          <MoreHorizontal size={18} />
        </div>
      </aside>
      <nav className="mobile-nav" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.screen;
          return (
            <button
              className={active ? "is-active" : ""}
              key={item.label}
              onClick={() => onboarded && onNavigate(item.screen)}
              aria-current={active ? "page" : undefined}
              aria-disabled={!onboarded}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

function AssistantComposer() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  function askVerdant(event: FormEvent) {
    event.preventDefault();
    if (!question.trim()) return;
    setAnswer("I can help with that. I’ll consider your garden, recent activity, and today’s weather before answering.");
    setQuestion("");
  }

  return (
    <section className="assistant-card" aria-labelledby="assistant-title">
      <div className="eyebrow"><Sparkles size={15} /> Ask Verdant</div>
      <div className="assistant-heading">
        <div>
          <h2 id="assistant-title">What does your garden need?</h2>
          <p>Ask a question, describe what you see, or add a photo.</p>
        </div>
        <span className="context-pill">Whole garden</span>
      </div>
      <form className="ask-box" onSubmit={askVerdant}>
        <button className="icon-button" type="button" aria-label="Add a garden photo">
          <Camera size={20} />
        </button>
        <input
          aria-label="Ask Verdant"
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Should I water the patio pots before the rain?"
          value={question}
        />
        <button className="send-button" type="submit" aria-label="Send question">
          <ArrowRight size={19} />
        </button>
      </form>
      <div className="prompt-row" aria-label="Suggested questions">
        <button onClick={() => setQuestion("What should I check in the garden today?")}>Today’s priorities</button>
        <button onClick={() => setQuestion("Why are my tomato leaves curling?")}>Check a plant problem</button>
        <button onClick={() => setQuestion("What can I do in ten minutes?")}>I have 10 minutes</button>
      </div>
      {answer && <p className="assistant-reply" role="status"><Sparkles size={16} /> {answer}</p>}
    </section>
  );
}

function FreshWelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="screen welcome-screen">
      <header className="welcome-topbar"><Logo /><span>Beginner-friendly garden coaching</span></header>
      <main className="welcome-layout">
        <section className="welcome-copy">
          <span className="eyebrow"><Sparkles size={15} /> Welcome to Verdant</span>
          <h1>Start with one spot.<br />We’ll learn the rest together.</h1>
          <p>Tell us where you garden, add one planting, and get your first useful check. No garden map or expert knowledge required.</p>
          <div className="welcome-actions">
            <button className="primary-button large" onClick={onStart}>Set up my garden <ArrowRight size={18} /></button>
            <span>About 3 minutes</span>
          </div>
          <div className="welcome-assurances">
            <span><Check size={16} /> Start with one plant</span>
            <span><Check size={16} /> Change anything later</span>
            <span><Check size={16} /> Advice in plain language</span>
          </div>
        </section>

        <aside className="setup-preview-card">
          <div className="setup-preview-head"><span>Your first garden</span><small>0 of 3 complete</small></div>
          <div className="preview-step is-next"><span>1</span><div><strong>Set your location</strong><small>For weather and seasonal timing</small></div><ChevronRight size={18} /></div>
          <div className="preview-step"><span>2</span><div><strong>Create one garden area</strong><small>Patio, raised bed, or border</small></div></div>
          <div className="preview-step"><span>3</span><div><strong>Add your first planting</strong><small>Use a photo, label, or name</small></div></div>
          <div className="preview-outcome"><Leaf size={20} /><div><strong>Then Verdant gets useful</strong><p>You’ll receive a first check based on the plant, its growing space, and local conditions.</p></div></div>
        </aside>
      </main>
    </div>
  );
}

function FirstGardenSetup({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [location, setLocation] = useState("");
  const [areaType, setAreaType] = useState("Containers");
  const [areaName, setAreaName] = useState("Patio pots");
  const [sunlight, setSunlight] = useState("Mostly sunny");
  const [plantMethod, setPlantMethod] = useState("photo");
  const [plantSearch, setPlantSearch] = useState("");

  return (
    <div className="screen first-setup-screen">
      <header className="setup-header">
        <button className="back-button" onClick={step === 0 ? onBack : () => setStep(step - 1)}><ArrowLeft size={18} /> {step === 0 ? "Welcome" : "Back"}</button>
        <span>Step {Math.min(step + 1, 4)} of 4</span>
        <button className="setup-exit" onClick={onBack}>Finish later</button>
      </header>
      <div className="setup-progress segmented" aria-label={`Step ${Math.min(step + 1, 4)} of 4`}>
        {[0, 1, 2, 3].map((item) => <span className={item <= step ? "is-complete" : ""} key={item} />)}
      </div>

      {step === 0 && (
        <section className="setup-panel location-step">
          <div className="setup-step-icon"><MapPin size={26} /></div>
          <span className="eyebrow">Local guidance</span>
          <h1>Where is your garden?</h1>
          <p>Your city is enough to account for rain, heat, frost, and seasonal timing. Verdant doesn’t need continuous location access.</p>
          <label className="location-field"><span>City or postal code</span><div><MapPin size={18} /><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Enter your city" autoFocus /></div></label>
          <div className="or-divider"><span>or</span></div>
          <button className="location-button" onClick={() => setLocation("Toronto, ON")}><MapPin size={18} /><span><strong>Use my current location</strong><small>Only while setting up this garden</small></span></button>
          <button className="primary-button setup-next" disabled={!location} onClick={() => setStep(1)}>Continue <ArrowRight size={18} /></button>
        </section>
      )}

      {step === 1 && (
        <section className="setup-panel">
          <span className="eyebrow">Your first area</span>
          <h1>Where should we start?</h1>
          <p>Add just one place for now. You can create the rest of your garden after seeing the first useful advice.</p>
          <div className="method-grid area-methods">
            {[{ name: "Containers", detail: "Pots, planters, or grow bags", icon: Sprout }, { name: "Raised bed", detail: "One contained growing bed", icon: Leaf }, { name: "In-ground", detail: "A bed, border, or garden patch", icon: Flower2 }].map((item) => {
              const Icon = item.icon;
              return <button className={areaType === item.name ? "is-active" : ""} key={item.name} onClick={() => { setAreaType(item.name); setAreaName(item.name === "Containers" ? "Patio pots" : item.name === "Raised bed" ? "Vegetable bed" : "Back border"); }}><Icon size={25} /><span><strong>{item.name}</strong><small>{item.detail}</small></span></button>;
            })}
          </div>
          <div className="field-grid setup-fields">
            <label><span>Give this area a simple name</span><input value={areaName} onChange={(event) => setAreaName(event.target.value)} /></label>
            <label><span>Approximately how much sun?</span><select value={sunlight} onChange={(event) => setSunlight(event.target.value)}><option>Mostly sunny</option><option>Partly sunny</option><option>Mostly shaded</option><option>Not sure</option></select></label>
          </div>
          <button className="primary-button setup-next" disabled={!areaName.trim()} onClick={() => setStep(2)}>Create this area <ArrowRight size={18} /></button>
        </section>
      )}

      {step === 2 && (
        <section className="setup-panel">
          <span className="eyebrow">Your first planting</span>
          <h1>What’s growing in {areaName}?</h1>
          <p>One plant is enough to begin. If you’re not sure what it is, a photo can help Verdant suggest a match.</p>
          <div className="method-grid">
            <button className={plantMethod === "photo" ? "is-active" : ""} onClick={() => setPlantMethod("photo")}><Camera size={25} /><span><strong>Take a plant photo</strong><small>Best when you’re beside it</small></span></button>
            <button className={plantMethod === "label" ? "is-active" : ""} onClick={() => setPlantMethod("label")}><ScanLine size={25} /><span><strong>Photograph a label</strong><small>Plant tag or seed packet</small></span></button>
            <button className={plantMethod === "search" ? "is-active" : ""} onClick={() => setPlantMethod("search")}><Search size={25} /><span><strong>Search by name</strong><small>Common names work well</small></span></button>
          </div>
          {plantMethod === "search" ? (
            <label className="search-field"><Search size={18} /><input value={plantSearch} onChange={(event) => setPlantSearch(event.target.value)} placeholder="Try ‘nasturtium’" autoFocus /></label>
          ) : (
            <button className="demo-photo-button" onClick={() => setStep(3)}><Camera size={22} /><span><strong>Take or choose a photo</strong><small>For this prototype, continue to see an example match</small></span><ChevronRight size={18} /></button>
          )}
          <button className="primary-button setup-next" disabled={plantMethod === "search" && !plantSearch.trim()} onClick={() => setStep(3)}>Continue <ArrowRight size={18} /></button>
        </section>
      )}

      {step === 3 && (
        <section className="setup-panel first-match-panel">
          <span className="eyebrow">Confirm your first plant</span>
          <h1>This looks like a nasturtium.</h1>
          <p>Verdant found a likely match. Confirm it before anything is added to your garden.</p>
          <article className="identification-result first-result">
            <div className="identified-image"><Flower2 size={52} /></div>
            <div><span className="confidence">Likely match</span><h2>Garden nasturtium</h2><p><em>Tropaeolum majus</em> · Edible flowering annual</p><div className="match-context"><MapPin size={13} /> {areaName} · {areaType} · {sunlight}</div></div>
            <CheckCircle2 size={24} />
          </article>
          <div className="first-check-preview"><SunMedium size={20} /><div><strong>Your first useful check</strong><p>Because this is in a sunny container, start by checking its soil during warm weather rather than watering on a fixed schedule.</p></div></div>
          <div className="setup-actions"><button className="primary-button" onClick={onComplete}>Confirm and add plant</button><button className="secondary-button" onClick={() => setStep(2)}>This isn’t the right plant</button></div>
        </section>
      )}
    </div>
  );
}

function StarterTodayScreen({ onAddPlant, onAsk }: { onAddPlant: () => void; onAsk: () => void }) {
  return (
    <div className="screen today-screen starter-today">
      <header className="page-header">
        <div><p className="date-line">Your first day</p><h1>Welcome to your garden</h1></div>
        <button className="weather-summary"><SunMedium size={24} /><span><strong>21°</strong><small>Toronto, ON</small></span><ChevronRight size={17} /></button>
      </header>
      <section className="first-day-banner">
        <span className="summary-check"><Check size={27} /></span>
        <div><span className="eyebrow">Setup complete</span><h2>Your first planting is ready.</h2><p>Verdant now knows enough to give simple, contextual guidance. Add the rest of your garden whenever you’re ready.</p></div>
      </section>
      <div className="starter-grid">
        <section className="starter-plant-card">
          <div className="card-head"><span className="eyebrow">Your first planting</span><span className="plant-status good">Doing well</span></div>
          <div className="starter-plant-main"><span className="large-plant-symbol"><Flower2 size={34} /></span><div><span>Patio pots · Container</span><h2>Garden nasturtium</h2><p>Established · Mostly sunny</p></div></div>
          <div className="first-task"><SunMedium size={19} /><div><strong>Check soil on the next warm morning</strong><p>Water only if it feels dry one finger deep.</p></div></div>
          <button className="secondary-button full" onClick={onAsk}>Ask about this plant</button>
        </section>
        <section className="keep-building-card">
          <span className="eyebrow">Build your garden gradually</span>
          <h2>Add one or two more plantings</h2>
          <p>Once Verdant knows a few plants, it can suggest your first short Garden Walk.</p>
          <button className="primary-button" onClick={onAddPlant}><Plus size={17} /> Add another planting</button>
          <div className="setup-completion"><span><Check size={14} /> Location</span><span><Check size={14} /> First area</span><span><Check size={14} /> First plant</span></div>
        </section>
        <div className="starter-assistant"><AssistantComposer /></div>
      </div>
    </div>
  );
}

function TodayScreen({ onStartWalk, onViewRoute }: { onStartWalk: () => void; onViewRoute: () => void }) {
  const [taskDone, setTaskDone] = useState(false);

  return (
    <div className="screen today-screen">
      <header className="page-header">
        <div>
          <p className="date-line">Sunday, July 19</p>
          <h1>Good morning, Maya</h1>
        </div>
        <button className="weather-summary" aria-label="Weather details for Toronto">
          <CloudRain size={24} />
          <span><strong>21°</strong><small>Rain at 4 PM</small></span>
          <ChevronRight size={17} />
        </button>
      </header>

      <section className="briefing" aria-labelledby="briefing-title">
        <div className="briefing-icon"><SunMedium size={23} /></div>
        <div>
          <span className="eyebrow">Your garden today</span>
          <h2 id="briefing-title">Check the patio before the afternoon rain.</h2>
          <p>The containers may still need water after three warm days. Your raised bed can probably wait.</p>
          <button className="text-button">How weather shaped this plan <ArrowRight size={16} /></button>
        </div>
      </section>

      <div className="today-grid">
        <AssistantComposer />

        <section className={`next-action ${taskDone ? "is-complete" : ""}`} aria-labelledby="next-action-title">
          <div className="card-head">
            <span className="eyebrow">Best next action</span>
            <span className="time-pill">4 min</span>
          </div>
          <div className="plant-symbol tomato"><Sprout size={25} /></div>
          <div className="action-location"><MapPin size={14} /> Patio · Cherry tomato</div>
          <h2 id="next-action-title">Check soil moisture</h2>
          <p>Feel the soil one finger deep. Water only if it feels dry.</p>
          <div className="action-buttons">
            <button className="primary-button" onClick={() => setTaskDone(!taskDone)}>
              {taskDone ? <><Check size={18} /> Completed</> : "Start check"}
            </button>
            <button className="secondary-button">Ask why</button>
          </div>
        </section>

        <section className="walk-card" aria-labelledby="walk-title">
          <div className="walk-copy">
            <span className="eyebrow"><ListChecks size={15} /> Suggested garden walk</span>
            <h2 id="walk-title">A useful six-minute check</h2>
            <p>Four plantings across three areas. The route starts with the containers before it gets warmer.</p>
            <div className="route-preview" aria-label="Garden Walk route">
              <span><strong>01</strong> Patio</span>
              <i />
              <span><strong>02</strong> Raised bed</span>
              <i />
              <span><strong>03</strong> Back border</span>
            </div>
          </div>
          <div className="walk-actions">
            <button className="primary-button" onClick={onStartWalk}>Start Garden Walk <ArrowRight size={18} /></button>
            <button className="secondary-button" onClick={onViewRoute}>View route</button>
          </div>
        </section>

        <section className="followups-card" aria-labelledby="followups-title">
          <div className="card-head">
            <div>
              <span className="eyebrow">Keep an eye on</span>
              <h2 id="followups-title">One follow-up</h2>
            </div>
            <button className="icon-button" aria-label="More follow-up options"><MoreHorizontal size={19} /></button>
          </div>
          <div className="followup-row">
            <span className="status-dot attention" />
            <div><strong>Kale leaf holes</strong><small>Raised bed · Check today</small></div>
            <ChevronRight size={18} />
          </div>
        </section>
      </div>
    </div>
  );
}

function WalkOverview({ items, onBack, onStart, onSkip }: {
  items: WalkItem[];
  onBack: () => void;
  onStart: (index?: number) => void;
  onSkip: (id: number) => void;
}) {
  const areas = Array.from(new Set(items.map((item) => item.area)));
  const checked = items.filter((item) => item.status === "good").length;

  return (
    <div className="screen walk-screen">
      <button className="back-button" onClick={onBack}><ArrowLeft size={18} /> Today</button>
      <header className="walk-header">
        <div>
          <span className="eyebrow">Garden Walk</span>
          <h1>Your route for today</h1>
          <p>Four quick checks, grouped by location. Skip anything that isn’t convenient.</p>
        </div>
        <div className="walk-time"><strong>6</strong><span>minutes<br />estimated</span></div>
      </header>
      <div className="progress-track" aria-label={`${checked} of ${items.length} checks complete`}>
        <span style={{ width: `${Math.max((checked / items.length) * 100, 3)}%` }} />
      </div>

      <div className="overview-layout">
        <div className="route-list">
          {areas.map((area, areaIndex) => (
            <section className="area-group" key={area}>
              <div className="area-heading">
                <span className="area-number">{String(areaIndex + 1).padStart(2, "0")}</span>
                <div><h2>{area}</h2><p>{items.filter((item) => item.area === area).length} checks</p></div>
              </div>
              <div className="area-items">
                {items.map((item, itemIndex) => item.area === area && (
                  <article className={`route-item status-${item.status}`} key={item.id}>
                    <button className="route-main" onClick={() => onStart(itemIndex)}>
                      <span className="route-status">
                        {item.status === "good" ? <Check size={17} /> : item.status === "skipped" ? "–" : item.id}
                      </span>
                      <span><strong>{item.name}</strong><small>{item.place} · {item.meta}</small></span>
                      <ChevronRight size={18} />
                    </button>
                    <button className="skip-button" onClick={() => onSkip(item.id)}>
                      {item.status === "skipped" ? "Restore" : "Skip"}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
        <aside className="route-aside">
          <span className="eyebrow">Why this route?</span>
          <h2>Start with the patio.</h2>
          <p>Containers dry sooner than beds, and the temperature will rise before afternoon rain.</p>
          <div className="weather-note"><CloudRain size={19} /><span><strong>Rain likely after 4 PM</strong><small>Raised bed watering isn’t included.</small></span></div>
          <button className="primary-button full" onClick={() => onStart()}>Start walk <ArrowRight size={18} /></button>
        </aside>
      </div>
    </div>
  );
}

function WalkGuide({ item, index, total, onOverview, onPause, onAnswer }: {
  item: WalkItem;
  index: number;
  total: number;
  onOverview: () => void;
  onPause: () => void;
  onAnswer: (answer: "good" | "changed" | "unsure") => void;
}) {
  const [showHelp, setShowHelp] = useState(false);
  return (
    <div className="screen guide-screen">
      <header className="guide-topbar">
        <button className="back-button" onClick={onOverview}><ListChecks size={18} /> View route</button>
        <span>{index + 1} of {total}</span>
        <button className="back-button" onClick={onPause}><Pause size={17} /> Pause</button>
      </header>
      <div className="guide-progress"><span style={{ width: `${((index + 1) / total) * 100}%` }} /></div>
      <main className="guide-card">
        <div className="guide-area"><MapPin size={15} /> {item.area} · {item.place}</div>
        <div className="guide-plant-icon"><Flower2 size={36} /></div>
        <span className="eyebrow">Check {index + 1}</span>
        <h1>{item.name}</h1>
        <p className="guide-meta">{item.meta}</p>
        <div className="observation-prompt">
          <span>Take a closer look</span>
          <h2>{item.prompt}</h2>
          <p>{item.detail}</p>
        </div>
        <div className="answer-grid">
          <button onClick={() => onAnswer("good")}><CheckCircle2 size={23} /><span><strong>Looks good</strong><small>Nothing has changed</small></span></button>
          <button onClick={() => onAnswer("changed")}><Camera size={23} /><span><strong>Something changed</strong><small>Ask Verdant with a photo</small></span></button>
          <button onClick={() => setShowHelp(!showHelp)}><CircleHelp size={23} /><span><strong>I’m not sure</strong><small>Show me what to inspect</small></span></button>
        </div>
        {showHelp && (
          <div className="inspection-help" role="status">
            <Sparkles size={18} />
            <div><strong>Start with the newest leaves.</strong><p>Compare their colour and shape with the older leaves, then look at the soil surface. You do not need to identify a problem—just note anything that seems different.</p></div>
          </div>
        )}
      </main>
    </div>
  );
}

function WalkSummary({ items, onDone, onRestart }: { items: WalkItem[]; onDone: () => void; onRestart: () => void }) {
  const checked = items.filter((item) => item.status === "good").length;
  const skipped = items.filter((item) => item.status === "skipped").length;
  return (
    <div className="screen summary-screen">
      <div className="summary-check"><Check size={34} /></div>
      <span className="eyebrow">Garden Walk complete</span>
      <h1>Nice work. Your garden is checked.</h1>
      <p>Today’s observations have been added to Activity. Nothing else needs your attention right now.</p>
      <div className="summary-stats">
        <div><strong>{checked}</strong><span>Plantings checked</span></div>
        <div><strong>{skipped}</strong><span>Skipped for today</span></div>
        <div><strong>Fri</strong><span>Next useful walk</span></div>
      </div>
      <section className="summary-note">
        <CloudRain size={22} />
        <div><strong>No watering reminder added</strong><p>Afternoon rain is still likely. Verdant will adjust if the forecast changes.</p></div>
      </section>
      <div className="summary-actions">
        <button className="primary-button" onClick={onDone}>Return to Today</button>
        <button className="secondary-button" onClick={onRestart}>Review route</button>
      </div>
    </div>
  );
}

const gardenAreas = [
  {
    name: "Patio",
    type: "Containers",
    light: "Mostly sunny",
    note: "Check first on warm days",
    plants: [
      { name: "Cherry tomato", detail: "One plant · Flowering", status: "Check today", tone: "check" },
      { name: "Herb pots", detail: "Basil, mint & parsley", status: "Doing well", tone: "good" },
    ],
  },
  {
    name: "Raised bed",
    type: "Mixed vegetables",
    light: "Mostly sunny",
    note: "Rain should cover watering",
    plants: [
      { name: "Kale & lettuce", detail: "One patch · Young plants", status: "Follow up", tone: "attention" },
      { name: "Sweet peppers", detail: "Three plants · Established", status: "Doing well", tone: "good" },
    ],
  },
  {
    name: "Back border",
    type: "In-ground",
    light: "Partly sunny",
    note: "No care due today",
    plants: [
      { name: "Hydrangea", detail: "One shrub · Flowering", status: "Doing well", tone: "good" },
      { name: "Coneflowers", detail: "One patch · Flowering", status: "Doing well", tone: "good" },
    ],
  },
];

function GardenScreen({ onAddPlant, onAsk, fresh = false }: { onAddPlant: () => void; onAsk: (context: string) => void; fresh?: boolean }) {
  const [selectedArea, setSelectedArea] = useState("All areas");
  const visibleAreas = selectedArea === "All areas" ? gardenAreas : gardenAreas.filter((area) => area.name === selectedArea);

  if (fresh) {
    return (
      <div className="screen garden-screen starter-garden">
        <header className="section-header">
          <div><span className="eyebrow">My first garden</span><h1>One planting, one place</h1><p>Start small. Add the rest as you spend time in the garden.</p></div>
          <button className="primary-button" onClick={onAddPlant}><Plus size={18} /> Add planting</button>
        </header>
        <section className="garden-overview fresh-overview">
          <div><span className="summary-icon"><Sprout size={19} /></span><p><strong>1 planting</strong><small>Enough for first advice</small></p></div>
          <div><span className="summary-icon"><CheckCircle2 size={19} /></span><p><strong>Doing well</strong><small>No urgent care today</small></p></div>
          <div><span className="summary-icon"><SunMedium size={19} /></span><p><strong>Mostly sunny</strong><small>Patio pots</small></p></div>
        </section>
        <div className="area-card-grid single-area">
          <article className="garden-area-card">
            <header><div className="area-illustration"><Leaf size={26} /></div><div className="area-title"><span>Containers</span><h2>Patio pots</h2><p><SunMedium size={13} /> Mostly sunny</p></div><button className="icon-button"><MoreHorizontal size={19} /></button></header>
            <div className="area-note"><SunMedium size={16} /><span>Check containers during warm weather</span></div>
            <div className="planting-list"><button className="planting-row" onClick={() => onAsk("Garden nasturtium · Patio pots")}><span className="planting-avatar"><Flower2 size={18} /></span><span><strong>Garden nasturtium</strong><small>One container · Established</small></span><span className="plant-status good">Doing well</span><ChevronRight size={17} /></button></div>
            <button className="area-add" onClick={onAddPlant}><Plus size={15} /> Add to Patio pots</button>
          </article>
          <button className="add-area-card"><Plus size={22} /><strong>Create another garden area</strong><span>Raised bed, border, or another group of containers</span></button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen garden-screen">
      <header className="section-header">
        <div>
          <span className="eyebrow">My garden</span>
          <h1>Six plantings, three places</h1>
          <p>Organized by where things grow—not by complicated garden records.</p>
        </div>
        <button className="primary-button" onClick={onAddPlant}><Plus size={18} /> Add planting</button>
      </header>

      <div className="garden-toolbar">
        <div className="area-tabs" role="tablist" aria-label="Filter garden areas">
          {["All areas", ...gardenAreas.map((area) => area.name)].map((area) => (
            <button className={selectedArea === area ? "is-active" : ""} key={area} onClick={() => setSelectedArea(area)}>{area}</button>
          ))}
        </div>
        <button className="secondary-button"><Search size={16} /> Find a planting</button>
      </div>

      <section className="garden-overview" aria-label="Garden summary">
        <div><span className="summary-icon"><Sprout size={19} /></span><p><strong>6 plantings</strong><small>Across mixed growing spaces</small></p></div>
        <div><span className="summary-icon"><CheckCircle2 size={19} /></span><p><strong>4 doing well</strong><small>No care needed today</small></p></div>
        <div><span className="summary-icon amber"><Bug size={19} /></span><p><strong>1 follow-up</strong><small>Kale leaf holes</small></p></div>
      </section>

      <div className="area-card-grid">
        {visibleAreas.map((area) => (
          <article className="garden-area-card" key={area.name}>
            <header>
              <div className="area-illustration"><Leaf size={26} /></div>
              <div className="area-title"><span>{area.type}</span><h2>{area.name}</h2><p><SunMedium size={13} /> {area.light}</p></div>
              <button className="icon-button" aria-label={`More options for ${area.name}`}><MoreHorizontal size={19} /></button>
            </header>
            <div className="area-note"><CloudRain size={16} /><span>{area.note}</span></div>
            <div className="planting-list">
              {area.plants.map((plant) => (
                <button className="planting-row" key={plant.name} onClick={() => onAsk(`${plant.name} · ${area.name}`)}>
                  <span className="planting-avatar"><Flower2 size={18} /></span>
                  <span><strong>{plant.name}</strong><small>{plant.detail}</small></span>
                  <span className={`plant-status ${plant.tone}`}>{plant.status}</span>
                  <ChevronRight size={17} />
                </button>
              ))}
            </div>
            <button className="area-add" onClick={onAddPlant}><Plus size={15} /> Add to {area.name}</button>
          </article>
        ))}
      </div>
    </div>
  );
}

function AddPlantScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState("photo");
  const [plantName, setPlantName] = useState("");

  return (
    <div className="screen add-plant-screen">
      <button className="back-button" onClick={step === 0 ? onBack : () => setStep(step - 1)}><ArrowLeft size={18} /> {step === 0 ? "Garden" : "Back"}</button>
      <div className="setup-progress"><span style={{ width: `${Math.max(18, (step + 1) * 25)}%` }} /></div>

      {step === 0 && (
        <section className="setup-panel">
          <span className="eyebrow">Add a planting</span>
          <h1>What are you growing?</h1>
          <p>Start with a photo or a name. You only need enough detail to make the first advice useful.</p>
          <div className="method-grid">
            <button className={method === "photo" ? "is-active" : ""} onClick={() => setMethod("photo")}><Camera size={25} /><span><strong>Take a plant photo</strong><small>Best when you are beside it</small></span></button>
            <button className={method === "label" ? "is-active" : ""} onClick={() => setMethod("label")}><ScanLine size={25} /><span><strong>Photograph a label</strong><small>Plant tag or seed packet</small></span></button>
            <button className={method === "search" ? "is-active" : ""} onClick={() => setMethod("search")}><Search size={25} /><span><strong>Search by name</strong><small>Common names work well</small></span></button>
          </div>
          {method === "search" ? (
            <label className="search-field"><Search size={18} /><input value={plantName} onChange={(event) => setPlantName(event.target.value)} placeholder="Try ‘nasturtium’" autoFocus /></label>
          ) : (
            <label className="upload-zone">
              <Upload size={23} />
              <span><strong>Choose a photo to continue</strong><small>Clear daylight photos work best</small></span>
              <input type="file" accept="image/*" onChange={() => setStep(1)} />
            </label>
          )}
          <button className="primary-button setup-next" disabled={method === "search" && !plantName.trim()} onClick={() => setStep(1)}>Continue <ArrowRight size={18} /></button>
        </section>
      )}

      {step === 1 && (
        <section className="setup-panel identification-panel">
          <span className="eyebrow">Possible identification</span>
          <h1>This looks like a nasturtium.</h1>
          <p>Check the round leaves and radiating veins before adding it to your garden.</p>
          <article className="identification-result">
            <div className="identified-image"><Flower2 size={52} /></div>
            <div><span className="confidence">Likely match</span><h2>Garden nasturtium</h2><p><em>Tropaeolum majus</em> · Edible flowering annual</p><button className="text-button dark">See two other possibilities <ChevronRight size={16} /></button></div>
            <CheckCircle2 size={24} />
          </article>
          <div className="identification-actions">
            <button className="primary-button" onClick={() => setStep(2)}>Yes, this is my plant</button>
            <button className="secondary-button">Take another photo</button>
            <button className="secondary-button">Choose a different plant</button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="setup-panel details-panel">
          <span className="eyebrow">Planting details</span>
          <h1>Add a little context</h1>
          <p>These basics help Verdant tailor care. You can fill in anything else later.</p>
          <div className="field-grid">
            <label><span>Where is it growing?</span><select defaultValue="Patio"><option>Patio</option><option>Raised bed</option><option>Back border</option></select></label>
            <label><span>What does this record represent?</span><select defaultValue="One container"><option>One plant</option><option>One container</option><option>A row or patch</option></select></label>
            <label><span>Growth stage</span><select defaultValue="Established"><option>Young</option><option>Established</option><option>Flowering</option><option>Producing</option><option>Not sure</option></select></label>
            <label><span>How does it look?</span><select defaultValue="Looks healthy"><option>Looks healthy</option><option>Something seems wrong</option><option>Not sure</option></select></label>
          </div>
          <label className="optional-field"><span>Nickname <small>Optional</small></span><input placeholder="For example, porch nasturtium" /></label>
          <div className="setup-actions"><button className="primary-button" onClick={() => setStep(3)}>Save planting</button><button className="secondary-button" onClick={onBack}>Cancel</button></div>
        </section>
      )}

      {step === 3 && (
        <section className="setup-panel success-panel">
          <div className="summary-check"><Check size={33} /></div>
          <span className="eyebrow">Planting added</span>
          <h1>Your nasturtium is ready.</h1>
          <p>It will appear in Patio and can be included in future Garden Walks.</p>
          <div className="first-advice"><SunMedium size={21} /><div><strong>A useful first check</strong><p>Nasturtiums flower best with plenty of light, but patio containers may need a moisture check during warm weather.</p></div></div>
          <div className="summary-actions"><button className="primary-button" onClick={onDone}>View Garden</button><button className="secondary-button" onClick={() => setStep(0)}>Add another</button></div>
        </section>
      )}
    </div>
  );
}

type ChatMessage = { role: "user" | "assistant"; text: string };

const startingThreads = [
  { id: 1, title: "Kale leaf holes", context: "Kale & lettuce · Raised bed", time: "Today", preview: "A few small holes can come from..." },
  { id: 2, title: "Watering before rain", context: "Whole garden", time: "Yesterday", preview: "Check the patio containers first..." },
  { id: 3, title: "Hydrangea afternoon wilt", context: "Hydrangea · Back border", time: "Jul 15", preview: "Temporary afternoon wilt can be..." },
];

function AssistantScreen({ initialContext, walkPaused, onResumeWalk, fresh = false }: { initialContext: string; walkPaused: boolean; onResumeWalk: () => void; fresh?: boolean }) {
  const [threads, setThreads] = useState(fresh ? [] : startingThreads);
  const [selectedId, setSelectedId] = useState<number | null>(fresh || initialContext !== "Whole garden" ? null : 1);
  const [context, setContext] = useState(initialContext);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(fresh || initialContext !== "Whole garden" ? [] : [
    { role: "user", text: "I noticed a few small holes in the kale leaves. What should I look for?" },
    { role: "assistant", text: "Start by checking the undersides of two or three leaves for small green caterpillars or clusters of eggs. A few holes are usually manageable, so I would inspect before treating anything. Recent warm weather makes caterpillar activity plausible." },
  ]);

  function newConversation() {
    setSelectedId(null);
    setContext("Whole garden");
    setMessages([]);
    setDraft("");
  }

  function selectThread(id: number) {
    const thread = threads.find((item) => item.id === id);
    if (!thread) return;
    setSelectedId(id);
    setContext(thread.context);
    setMessages([
      { role: "user", text: thread.title === "Watering before rain" ? "Should I water everything before the rain?" : `Can we continue about ${thread.title.toLowerCase()}?` },
      { role: "assistant", text: thread.preview },
    ]);
  }

  function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    const text = draft.trim();
    if (selectedId === null) {
      const id = Date.now();
      setThreads((current) => [{ id, title: text.slice(0, 34), context, time: "Now", preview: "New conversation" }, ...current]);
      setSelectedId(id);
    }
    setMessages((current) => [...current, { role: "user", text }, { role: "assistant", text: "I’ll use the selected garden context, recent Activity, current weather, and trusted gardening sources to answer. In the connected product, this response would be generated by the gardening agent." }]);
    setDraft("");
  }

  return (
    <div className="assistant-workspace">
      <aside className="thread-sidebar">
        <div className="thread-sidebar-head"><div><span className="eyebrow">Assistant</span><h1>Conversations</h1></div><button className="icon-button" onClick={newConversation} aria-label="New conversation"><Plus size={19} /></button></div>
        <label className="thread-search"><Search size={16} /><input aria-label="Search conversations" placeholder="Search conversations" /></label>
        <div className="thread-list">
          {threads.length === 0 && <div className="empty-thread-list"><MessageCircle size={21} /><strong>No conversations yet</strong><p>Create one whenever you have a question.</p></div>}
          {threads.map((thread) => (
            <button className={selectedId === thread.id ? "is-active" : ""} key={thread.id} onClick={() => selectThread(thread.id)}>
              <span className="thread-title"><strong>{thread.title}</strong><small>{thread.time}</small></span>
              <span className="thread-context"><Leaf size={11} /> {thread.context}</span>
              <p>{thread.preview}</p>
            </button>
          ))}
        </div>
        {threads.length > 0 && <button className="archive-button"><Archive size={16} /> Archived conversations</button>}
      </aside>

      <section className="conversation-panel">
        <header className="conversation-header">
          <div><span>{selectedId ? threads.find((thread) => thread.id === selectedId)?.title : "New conversation"}</span><button className="context-pill"><Leaf size={12} /> {context} <ChevronRight size={13} /></button></div>
          <button className="icon-button" aria-label="Conversation options"><MoreHorizontal size={19} /></button>
        </header>
        {walkPaused && (
          <div className="walk-paused-banner"><Pause size={16} /><span><strong>Garden Walk paused</strong><small>{initialContext}</small></span><button onClick={onResumeWalk}>Continue walk</button></div>
        )}
        <div className={`message-area ${messages.length === 0 ? "is-empty" : ""}`}>
          {messages.length === 0 ? (
            <div className="conversation-empty"><span className="assistant-orb"><Sparkles size={24} /></span><h2>What would you like to know?</h2><p>This conversation starts with <strong>{context}</strong> as context. Change it before asking if needed.</p><div className="empty-prompts"><button onClick={() => setDraft("What should I check today?")}>What should I check today?</button><button onClick={() => setDraft("Can you help me understand a change I noticed?")}>Help me understand a change</button></div></div>
          ) : messages.map((message, index) => (
            <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
              {message.role === "assistant" && <span className="message-avatar"><Leaf size={16} /></span>}
              <div><p>{message.text}</p>{message.role === "assistant" && <button className="source-disclosure">Considered recent care, Toronto weather, and trusted sources <ChevronRight size={14} /></button>}</div>
            </div>
          ))}
        </div>
        <form className="conversation-composer" onSubmit={sendMessage}>
          <button type="button" className="icon-button" aria-label="Add photo"><Camera size={19} /></button>
          <textarea aria-label="Message Verdant" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about your garden…" rows={1} />
          <button className="send-button" type="submit" aria-label="Send message"><Send size={17} /></button>
        </form>
      </section>
    </div>
  );
}

const activityItems = [
  { type: "Care", icon: Droplets, title: "Checked soil moisture", subject: "Cherry tomato · Patio", detail: "Soil felt slightly damp. No watering needed.", time: "Today, 8:42 AM" },
  { type: "Observation", icon: Bug, title: "Leaf holes observed", subject: "Kale & lettuce · Raised bed", detail: "A few new holes on two outer leaves. Monitoring for caterpillars.", time: "Saturday, 10:18 AM" },
  { type: "Photo", icon: Image, title: "Progress photo added", subject: "Hydrangea · Back border", detail: "Flowering well after last week’s warm weather.", time: "Friday, 6:30 PM" },
  { type: "Care", icon: Droplets, title: "Watered herb pots", subject: "Herb pots · Patio", detail: "Completed from Garden Walk.", time: "Wednesday, 7:55 AM" },
  { type: "Observation", icon: CheckCircle2, title: "Garden Walk completed", subject: "Whole garden", detail: "Five plantings checked; nothing urgent found.", time: "Wednesday, 7:59 AM" },
];

function ActivityScreen({ fresh = false }: { fresh?: boolean }) {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? activityItems : activityItems.filter((item) => item.type === filter);
  if (fresh) {
    return (
      <div className="screen activity-screen starter-activity">
        <header className="section-header"><div><span className="eyebrow">Garden history</span><h1>Activity</h1><p>Care, observations, photos, and completed walks will collect here.</p></div><button className="secondary-button"><Plus size={17} /> Add note</button></header>
        <section className="first-activity-card">
          <div className="timeline-date"><CalendarDays size={15} /> Today</div>
          <article className="activity-item"><span className="activity-icon"><Sprout size={18} /></span><div className="activity-content"><span className="activity-type">Garden setup</span><h2>Garden nasturtium added</h2><p className="activity-subject">Patio pots</p><p>Your first planting was identified and confirmed.</p><time>Just now</time></div></article>
        </section>
        <section className="activity-empty-help"><ListChecks size={26} /><div><h2>Your history will build itself</h2><p>Completing care, checking a plant, or adding a progress photo creates Activity without making you keep a manual journal.</p></div></section>
      </div>
    );
  }
  return (
    <div className="screen activity-screen">
      <header className="section-header">
        <div><span className="eyebrow">Garden history</span><h1>Activity</h1><p>Care, observations, photos, and completed walks—recorded without extra paperwork.</p></div>
        <button className="secondary-button"><Plus size={17} /> Add note</button>
      </header>
      <div className="activity-toolbar">
        <div className="activity-filters">
          {["All", "Care", "Observation", "Photo"].map((item) => <button className={filter === item ? "is-active" : ""} key={item} onClick={() => setFilter(item)}>{item === "All" ? "All activity" : item}</button>)}
        </div>
        <label className="activity-search"><Search size={16} /><input aria-label="Search garden activity" placeholder="Search activity" /></label>
      </div>
      <div className="activity-layout">
        <section className="timeline" aria-label="Garden activity timeline">
          <div className="timeline-date"><CalendarDays size={15} /> This week</div>
          {visible.map((item, index) => {
            const Icon = item.icon;
            return (
              <article className="activity-item" key={`${item.title}-${index}`}>
                <span className={`activity-icon type-${item.type.toLowerCase()}`}><Icon size={18} /></span>
                <div className="activity-content"><span className="activity-type">{item.type}</span><h2>{item.title}</h2><p className="activity-subject">{item.subject}</p><p>{item.detail}</p><time>{item.time}</time></div>
                <button className="icon-button" aria-label={`More options for ${item.title}`}><MoreHorizontal size={18} /></button>
              </article>
            );
          })}
        </section>
        <aside className="activity-aside">
          <span className="eyebrow">This month</span>
          <h2>Your garden at a glance</h2>
          <div className="activity-stat"><strong>4</strong><span>Garden Walks</span></div>
          <div className="activity-stat"><strong>9</strong><span>Care actions</span></div>
          <div className="activity-stat"><strong>5</strong><span>Progress photos</span></div>
          <button className="text-button dark">Compare plant progress <ArrowRight size={16} /></button>
        </aside>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [onboarded, setOnboarded] = useState(false);
  const [showEstablishedGarden] = useState(false);
  const [walkItems, setWalkItems] = useState(initialWalkItems);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [assistantContext, setAssistantContext] = useState("Whole garden");
  const [walkPaused, setWalkPaused] = useState(false);
  const activeItems = useMemo(() => walkItems.filter((item) => item.status !== "skipped"), [walkItems]);
  const current = activeItems[currentIndex] ?? activeItems[0];

  function goToday() {
    setScreen("today");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigate(next: Screen) {
    if (next === "assistant") {
      setAssistantContext("Whole garden");
      setWalkPaused(false);
    }
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openAssistant(context: string, fromWalk = false) {
    setAssistantContext(context);
    setWalkPaused(fromWalk);
    setScreen("assistant");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startWalk(index = 0) {
    const requested = walkItems[index];
    const activeIndex = requested ? activeItems.findIndex((item) => item.id === requested.id) : 0;
    setCurrentIndex(Math.max(activeIndex, 0));
    setScreen("walk-guide");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function answerCheck(answer: "good" | "changed" | "unsure") {
    if (answer === "changed") {
      openAssistant(`${current.name} · ${current.area}`, true);
      return;
    }
    setWalkItems((items) => items.map((item) => item.id === current.id ? { ...item, status: "good" } : item));
    if (currentIndex >= activeItems.length - 1) {
      setScreen("walk-summary");
    } else {
      setCurrentIndex((index) => index + 1);
    }
  }

  function toggleSkip(id: number) {
    setWalkItems((items) => items.map((item) => item.id === id
      ? { ...item, status: item.status === "skipped" ? "pending" : "skipped" }
      : item));
  }

  return (
    <div className="app-shell">
      <AppNavigation activeScreen={screen} onNavigate={navigate} onboarded={onboarded} />
      <main className="main-content">
        {screen === "welcome" && <FreshWelcomeScreen onStart={() => setScreen("setup")} />}
        {screen === "setup" && <FirstGardenSetup onBack={() => setScreen("welcome")} onComplete={() => { setOnboarded(true); setScreen("today"); }} />}
        {screen === "today" && (showEstablishedGarden
          ? <TodayScreen onStartWalk={() => startWalk()} onViewRoute={() => setScreen("walk-overview")} />
          : <StarterTodayScreen onAddPlant={() => setScreen("add-plant")} onAsk={() => openAssistant("Garden nasturtium · Patio pots")} />)}
        {screen === "walk-overview" && <WalkOverview items={walkItems} onBack={goToday} onStart={startWalk} onSkip={toggleSkip} />}
        {screen === "walk-guide" && current && <WalkGuide item={current} index={currentIndex} total={activeItems.length} onOverview={() => setScreen("walk-overview")} onPause={goToday} onAnswer={answerCheck} />}
        {screen === "walk-summary" && <WalkSummary items={walkItems} onDone={goToday} onRestart={() => setScreen("walk-overview")} />}
        {screen === "garden" && <GardenScreen fresh onAddPlant={() => setScreen("add-plant")} onAsk={(context) => openAssistant(context)} />}
        {screen === "add-plant" && <AddPlantScreen onBack={() => setScreen("garden")} onDone={() => setScreen("garden")} />}
        {screen === "assistant" && <AssistantScreen fresh initialContext={assistantContext} walkPaused={walkPaused} onResumeWalk={() => setScreen("walk-guide")} />}
        {screen === "activity" && <ActivityScreen fresh />}
      </main>
    </div>
  );
}
