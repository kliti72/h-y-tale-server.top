import { Router, Route } from '@solidjs/router';
import { AuthProvider } from './auth/AuthContext';
import { MetaProvider, Link, Meta } from "@solidjs/meta";
import { createContext, useContext, createSignal, ParentComponent } from "solid-js";

import HomePage from './pages/HomePages';
import HeaderComponent from './component/template/HeaderComponent';
import FooterComponent from './component/template/FooterComponent';
import ServerListPage from './pages/ServerListPage';
import ServerDetailsPage from './pages/ServerDetailsPage';
import ManagePanelPage from './pages/ManageServer';
import LeaderboardPage from './pages/LeaderboardPage';
import { ServerAddWrapper } from './pages/wrapper/ServerAddWrapper';
import { ServerEditWrapper } from './pages/wrapper/ServerEditWrapper';
import ServerTracker from './tracker/tracker';
import TrackerLanding from './tracker/tracker';
import DocsPage from './pages/DocsPage';
import NewsPage from './pages/NewsPage';
import ForumPage from './pages/ForumPage';

// ── i18n context ──────────────────────────────────────────────────────────────
export type Lang = "it" | "en";

const LangContext = createContext<{ lang: () => Lang; setLang: (l: Lang) => void }>();

export const LangProvider: ParentComponent<{ initial?: Lang }> = (props) => {
  const [lang, setLang] = createSignal<Lang>(props.initial ?? "it");
  return <LangContext.Provider value={{ lang, setLang }}>{props.children}</LangContext.Provider>;
};

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
};

// ── shared layout wrapper ─────────────────────────────────────────────────────
const Layout: ParentComponent<{ lang: Lang }> = (props) => {
  const origin = "https://h-ytale.top";

  return (
    <LangProvider initial={props.lang}>
      <MetaProvider>
        <Link rel="icon" href="/favicon/icon.svg" />

        {/* hreflang — tells Google both versions exist */}
        <Link rel="alternate" hreflang="it" href={origin} />
        <Link rel="alternate" hreflang="en" href={`${origin}/en`} />
        <Link rel="alternate" hreflang="x-default" href={origin} />

        {/* language signal for og:locale (overridden per-page) */}
        <Meta property="og:locale" content={props.lang === "it" ? "it_IT" : "en_US"} />
        <Meta property="og:locale:alternate" content={props.lang === "it" ? "en_US" : "it_IT"} />

        <AuthProvider>
          <HeaderComponent />
          {props.children}
          <FooterComponent />
        </AuthProvider>
      </MetaProvider>
    </LangProvider>
  );
};

// ── route groups ──────────────────────────────────────────────────────────────
const ItRoutes = () => <Layout lang="it">{/* injected by Router */}</Layout>;
const EnRoutes = () => <Layout lang="en">{/* injected by Router */}</Layout>;

function App() {
  return (
    <Router>
      {/* ── ITALIAN (default, no prefix) ── */}
      <Route path="/" component={(p) => <Layout lang="it">{p.children}</Layout>}>
        <Route path="/" component={HomePage} />
        <Route path="/servers" component={ServerListPage} />
        <Route path="/server/:id" component={ServerDetailsPage} />
        <Route path="/servers/add" component={ServerAddWrapper} />
        <Route path="/servers/edit/:id" component={ServerEditWrapper} />
        <Route path="/leaderboard" component={LeaderboardPage} />
        <Route path="/panel" component={ManagePanelPage} />
        <Route path="/docs" component={DocsPage} />
        <Route path="/tracker" component={TrackerLanding} />
        <Route path="/notizie" component={NewsPage} />
        <Route path="/forum" component={ForumPage} />
      </Route>

      {/* ── ENGLISH (/en/*) ── */}
      <Route path="/en" component={(p) => <Layout lang="en">{p.children}</Layout>}>
        <Route path="/" component={HomePage} />
        <Route path="/servers" component={ServerListPage} />
        <Route path="/server/:id" component={ServerDetailsPage} />
        <Route path="/servers/add" component={ServerAddWrapper} />
        <Route path="/servers/edit/:id" component={ServerEditWrapper} />
        <Route path="/leaderboard" component={LeaderboardPage} />
        <Route path="/panel" component={ManagePanelPage} />
      </Route>
    </Router>
  );
}

export default App;