import Auth from "./Component/Authpage/auth";
import { Route, Routes } from "react-router";
import Mainpage from "./Component/Mainpage/Mainpage";
import "./App.css";
const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/chat-app" element={<Mainpage />} />
    </Routes>
  );
};

export default App;
