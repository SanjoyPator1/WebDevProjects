
import './App.css'
import { Route, Routes } from 'react-router-dom';
import WithNav from './pages/outlet/WithNav';
import Feed from './pages/feed';
import SignUp from './pages/auth/signup';
import SignIn from './pages/auth/signin';
import Friends from './pages/friends';
import Profile from './pages/profile';
import Post from './pages/post';
import WithoutNav from './pages/outlet/WithoutNav';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="App bg-transparent">
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
          <Route index element={<Feed/>} />
        </Route>

        {/* Friends Page */}
        <Route path="/friends" element={<WithNav />}>
          <Route index element={<Friends />} />
        </Route>

        {/* Profile Page */}
        <Route
          path="/profile/:id"
          element={<WithNav  />}
        >
          <Route index element={<Profile />} />
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
