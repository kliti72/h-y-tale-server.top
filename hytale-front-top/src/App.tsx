import { Router, Route } from '@solidjs/router';
import NotFound from './component/template/NotFound';
import { AuthProvider } from './auth/AuthContext';
import Header from './component/template/Header';
import Footer from './component/template/Footer';
import MyServerBoard from './component/board/MyServerBoard';
import ServerDetail from './component/server/ServerDetail';
import Hero from './component/board/Hero';
import Board from './component/board/Board';


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
      <Route path="/owner" component={MyServerBoard} />
      <Route path="/server/:name" component={ServerDetail} />
      <Route path="*" component={NotFound} />
    </Router>
  );
}

export default App;