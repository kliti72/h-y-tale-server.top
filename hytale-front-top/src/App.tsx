import { Router, Route } from '@solidjs/router';
import NotFound from './component/template/NotFound';
import ServerBoard from './component/board/HomeServerBoard';
import { AuthProvider } from './auth/AuthContext';
import Header from './component/template/Header';
import Footer from './component/template/Footer';
import MyServerBoard from './component/board/MyServerBoard';

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
      <Route path="/owner" component={MyServerBoard} />
      <Route path="*" component={NotFound} />
    </Router>
  );
}

export default App;