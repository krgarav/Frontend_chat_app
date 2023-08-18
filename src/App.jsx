import Auth from "./Component/Authpage/auth";
import { Navigate, Route, Routes } from "react-router";
import Mainpage from "./Component/Mainpage/Mainpage";
import "./App.css";
const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/chat-app" element={<Mainpage />} />
      <Route path="*" element={<Navigate to="/auth" />} />
    </Routes>
  );
};

export default App;
