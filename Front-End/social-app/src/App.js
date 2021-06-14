import './App.css';
import MatchOTP from './Components/Auth/MatchOTP';
import Sign from './Components/Auth/Sign';
import NavbarM from "./Components/Navbar/NavbarM";
import { Switch, Route } from "react-router-dom";
import CreatePost from './Components/Dashboard/CreatePost';
import ProfileMain from './Components/Dashboard/ProfileMain';
import Settings from './Components/Dashboard/Settings';
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
      </Switch>
    </>
  );
}

export default App;
