import './App.css';
import MatchOTP from './Components/Auth/MatchOTP';
import Sign from './Components/Auth/Sign';
import NavbarM from "./Components/Navbar/NavbarM";
import { Switch, Route } from "react-router-dom";
import CreatePost from './Components/Dashboard/CreatePost';
import ProfileMain from './Components/Dashboard/ProfileMain';
import Settings from './Components/Dashboard/Settings';
import ForgetPassword from './Components/Auth/ForgetPassword';
import ResetPassword from './Components/Auth/ResetPassword';
function App() {
  return (
    <>
      {/* <Navbar></Navbar> */}
      <NavbarM></NavbarM>
      <Switch>
        <Route exact path="/sign" component={Sign}></Route>
        <Route exact path="/match-otp" component={MatchOTP}></Route>
        <Route exact path="/create-post" component={CreatePost}></Route>
        <Route exact path="/profile" component={ProfileMain}></Route>
        <Route exact path="/settings" component={Settings}></Route>
        <Route exact path="/forget-password" component={ForgetPassword}></Route>
        <Route path="/reset-password/:token" component={ResetPassword}></Route>
      </Switch>
    </>
  );
}

export default App;
