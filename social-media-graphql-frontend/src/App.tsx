
import './App.css'
import { Route, Routes } from 'react-router-dom';
import WithNav from './pages/outlet/WithNav';
import SignUp from './pages/auth/signup';
import SignIn from './pages/auth/signin';
import Friends from './pages/friends';
import Profile from './pages/profile';
import Post from './pages/post';
import WithoutNav from './pages/outlet/WithoutNav';
import { Toaster } from './components/ui/toaster';
import Home from './pages/home';
import SettingsPage from './pages/settings';

function App() {
  return (
    <div className="h-[100svh] App bg-transparent">
      <Toaster />
      <Routes>

        {/* Sign Up Page */}
        <Route path="/signup" element={<WithoutNav />}>
          <Route index element={<SignUp />} />
        </Route>

        {/* Sign In Page */}
        <Route path="/signin" element={<WithoutNav />}>
          <Route index element={<SignIn />} />
        </Route>

        {/* Landing Page */}
        <Route path="/" element={<WithNav />}>
          <Route index element={<Home/>} />
        </Route>

        {/* Friends Page */}
        <Route path="/friends/:id" element={<WithNav />}>
          <Route index element={<Friends />} />
        </Route>

        {/* Profile Page */}
        <Route
          path="/profile/:id"
          element={<WithNav  />}
        >
          <Route index element={<Profile />} />
        </Route>

        {/* Settings Page */}
        <Route
          path="/settings/:id"
          element={<WithNav  />}
        >
          <Route index element={<SettingsPage />} />
        </Route>

        {/* Post Page */}
        <Route
          path="/post/:id"
          element={<WithNav />}
        >
          <Route index element={<Post />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
