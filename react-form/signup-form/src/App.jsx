import "./App.css";
import { Routes, Route } from "react-router-dom"
import Signup from "./pages/Signup_page";

function App() {
  return (
    <>
      {/* <Routes>
        <Route path="/signup" element={<Signup />} />
      </Routes> */}
      <Signup />
    </>
  );
}

export default App;
