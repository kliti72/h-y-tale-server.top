import { Router, Route } from '@solidjs/router';
import NotFound from './component/template/NotFound';
import { AuthProvider } from './auth/AuthContext';
import Header from './component/template/Header';
import Footer from './component/template/Footer';
import ServerDetail from './pages/details/ServerDetailPage';
import Panel from './pages/todo/ManagePanelPage';
import Docs from './pages/DocsPage';
import ProfileEarnings from './pages/Profile';
import Home from './pages/HomePage';
import Contatti from './pages/about/ContattiPage';
import { ServerEditWrapper} from './component/modal/ServerEditWrapper';
import { ServerAddWrapper } from './component/modal/ServerAddWrapper';
import ServerPage from './pages/ServerPage';
import LeaderboardHacking from './pages/LeaderboardPage';
import PrivacyPolicyPage from './pages/about/PrivacyPolicyPage';
import LeaderboardStonePage from './pages/theme_game/LeaderboardStonePage';
import Earn from './pages/todo/Earn';
import FavoritePage from './pages/todo/TODOFavoritePage';


function App() {
  return (
    <Router
      root={(props) => (
        <AuthProvider>
          <Header />
          {props.children}
          <Footer />
        </AuthProvider>
      )}
    >
      <Route path="/" component={Home} />
      <Route path="/leaderboard" component={LeaderboardHacking} />
      <Route path="/leaderboard/stone" component={LeaderboardStonePage} />
      <Route path="/servers" component={ServerPage} />
      <Route path="/servers/add" component={ServerAddWrapper} />
      <Route path="/earn" component={Earn} />
      <Route path="/servers/edit/:id" component={ServerEditWrapper} />
      <Route path="/server/:id" component={ServerDetail} />
      <Route path="/panel" component={Panel} />
      <Route path="/docs" component={Docs} />
      <Route path="/contatti" component={Contatti} />
      <Route path="/privacy" component={PrivacyPolicyPage} />
      <Route path="*" component={NotFound} />
    </Router> 
  );
}

export default App;