import './App.css';
import MatchOTP from './Components/Auth/MatchOTP';
import Sign from './Components/Auth/Sign';
import Navbar from "./Components/Navbar/Navbar";
import NavbarM from "./Components/Navbar/NavbarM";
import { Switch, Route } from "react-router-dom";
function App() {
  return (
    <>
      {/* <Navbar></Navbar> */}
      <NavbarM></NavbarM>
      <Switch>
        <Route exact path="/sign" component={Sign}></Route>
        <Route exact path="/match-otp" component={MatchOTP}></Route>
      </Switch>
    </>
  );
}

export default App;
