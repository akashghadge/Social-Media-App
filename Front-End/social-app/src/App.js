import './App.css';
import MatchOTP from './Components/Auth/MatchOTP';
import Sign from './Components/Auth/Sign';
import SignIn from "./Components/Auth/SignIn"
function App() {
  return (
    <>
      <Sign></Sign>
      {/* <SignIn></SignIn> */}
      <MatchOTP></MatchOTP>
    </>
  );
}

export default App;
