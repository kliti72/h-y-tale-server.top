import { Router, Route } from '@solidjs/router';
import NotFound from './component/NotFound';
import ServerBoard from './component/ServerBoard';
import { AuthProvider } from './auth/AuthContext';
import Header from './component/Header';
import Footer from './component/Footer';

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
      <Route path="/" component={ServerBoard} />
      <Route path="/owner" component={ServerBoard} />
      <Route path="*" component={NotFound} />
    </Router>
  );
}

export default App;