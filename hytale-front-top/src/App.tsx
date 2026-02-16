import { Router, Route } from '@solidjs/router';
import NotFound from './component/template/NotFound';
import { AuthProvider } from './auth/AuthContext';
import Header from './component/template/Header';
import Footer from './component/template/Footer';
import MyServerBoard from './pages/Panel';
import ServerDetail from './pages/ServerDetail';
import Hero from './pages/Hero';
import Top from './pages/Top';
import VotePlugin from './pages/VotePlugin';
import Forum from './pages/Forum';
import Panel from './pages/Panel';

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
      <Route path="/" component={Hero} />
            <Route path="/top" component={Top} />
      <Route path="/forum" component={Forum} />
      <Route path="/panel" component={Panel} />
      <Route path="/server/:name" component={ServerDetail} />
      <Route path="/plugin" component={VotePlugin} />
      <Route path="*" component={NotFound} />
    </Router>
  );
}

export default App;