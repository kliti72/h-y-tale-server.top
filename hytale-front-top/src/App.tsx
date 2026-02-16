import { Router, Route } from '@solidjs/router';
import NotFound from './component/template/NotFound';
import { AuthProvider } from './auth/AuthContext';
import Header from './component/template/Header';
import Footer from './component/template/Footer';
import ServerDetail from './pages/ServerDetail';
import Forum from './pages/Forum';
import Panel from './pages/Panel';
import Leaderboard from './pages/Leaderboard';
import ServerBoard from './pages/ServerBoard';
import Docs from './pages/VotePlugin';
import Earn from './pages/Earn';
import Premium from './pages/Premium';
import ProfileEarnings from './pages/Profile';
import Home from './pages/Home';
import GuidesPage from './pages/Guide';
import Contatti from './pages/Contatti';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { ServerEditWrapper} from './component/modal/ServerEditWrapper';
import { ServerAddWrapper } from './component/modal/ServerAddWrapper';
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
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/servers" component={ServerBoard} />
      <Route path="/servers/add" component={ServerAddWrapper} />
      <Route path="/servers/edit/:id" component={ServerEditWrapper} />
      <Route path="/forum" component={Forum} />
      <Route path="/panel" component={Panel} />
      <Route path="/server/:name" component={ServerDetail} />
      <Route path="/guide" component={GuidesPage} />
      <Route path="/plugin" component={Docs} />
      <Route path="/earn" component={Earn} />
      <Route path="/premium" component={Premium} />
      <Route path="/contatti" component={Contatti} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/profile" component={ProfileEarnings} />
      <Route path="*" component={NotFound} />
    </Router>
  );
}

export default App;