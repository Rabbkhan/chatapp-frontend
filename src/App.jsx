// router.js

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import CheckEmailPage from './pages/CheckEmailPage';
import CheckPasswordPage from './pages/CheckPasswordPage';
import Home from './pages/Home';
import MessagePage from './components/MessagePage';
import AuthLayouts from './layout';
import ForgotPassword from './pages/ForgotPassword';


const AppRouter = () => {
  return (
    <Router>
      <Routes>
          <Route path="register" element={<AuthLayouts><RegisterPage /></AuthLayouts>} />
          <Route path="email" element={<AuthLayouts><CheckEmailPage /></AuthLayouts>} />
          <Route path="/password" element={<AuthLayouts><CheckPasswordPage /></AuthLayouts>} />
          <Route path="/forgot-password" element={<AuthLayouts><ForgotPassword /></AuthLayouts>} />
          <Route path="/" element={<Home />}>
            <Route path="/:userId" element={<MessagePage />} />
          </Route>
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
