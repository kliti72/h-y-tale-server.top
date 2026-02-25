import { Router, Route } from '@solidjs/router';
import { AuthProvider } from './auth/AuthContext';
import { MetaProvider, Link } from "@solidjs/meta";
import HomePage from './pages/HomePages';
import HeaderComponent from './component/template/HeaderComponent';
import FooterComponent from './component/template/FooterComponent';
import ServerListPage from './pages/ServerListPage';
import ServerDetailsPage from './pages/ServerDetailsPage';
import ManagePanelPage from './pages/ManageServer';
import LeaderboardPage from './pages/LeaderboardPage';
import { ServerAddWrapper } from './pages/wrapper/ServerAddWrapper';
import { ServerEditWrapper } from './pages/wrapper/ServerEditWrapper';

function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider >
          <Link rel="icon" href="../favicon/icon.svg" />
          <AuthProvider>
            <HeaderComponent />
            {props.children}
            <FooterComponent />
          </AuthProvider>
        </MetaProvider>
      )}
    >
      <Route path="/" component={HomePage} />
      <Route path="/servers" component={ServerListPage} />
      <Route path="/server/:id" component={ServerDetailsPage} />
      <Route path="/servers/add" component={ServerAddWrapper} />
      <Route path="/servers/edit/:id" component={ServerEditWrapper} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route path="/panel" component={ManagePanelPage} />
    </Router>
  );
}

export default App;