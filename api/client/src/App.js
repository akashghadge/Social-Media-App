import './AppCSS.css';
import MatchOTP from './Components/Auth/MatchOTP';
import Sign from './Components/Auth/Sign';
import NavbarM from "./Components/Navbar/NavbarM";
import { Switch, Route } from "react-router-dom";
import CreatePost from './Components/Dashboard/CreatePost';
import ProfileMain from './Components/Dashboard/ProfileMain';
import Settings from './Components/Dashboard/Settings';
import ResetPassword from './Components/Auth/ResetPassword';
import Home from './Components/HomePage/Home';
import PublicProfile from './Components/PublicProfile/PublicProfile';
import Followers from "./Components/PublicProfile/Followers"
import Following from "./Components/PublicProfile/Following"
import ChatMain from './Components/Chat/ChatMain';
import Notification from './Components/Dashboard/Notification';
import Error from "./Components/Error/Error"
function App() {
  return (
    <>
      {/* <Navbar></Navbar> */}
      <NavbarM></NavbarM>
      <Switch>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/sign" component={Sign}></Route>
        <Route exact path="/match-otp" component={MatchOTP}></Route>
        <Route exact path="/create-post" component={CreatePost}></Route>
        <Route exact path="/profile" component={ProfileMain}></Route>
        <Route exact path="/profile/:id" component={PublicProfile}></Route>
        <Route exact path="/profile/:id/followers" component={Followers}></Route>
        <Route exact path="/profile/:id/following" component={Following}></Route>
        <Route exact path="/settings" component={Settings}></Route>
        <Route path="/reset-password/:token" component={ResetPassword}></Route>
        <Route path="/messages" component={ChatMain}></Route>
        <Route path="/notifications" component={Notification}></Route>
        {/* error page */}
        <Route component={Error}></Route>
      </Switch>

    </>
  );
}

export default App;
