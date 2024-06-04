import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ProjectCollab from "./components/ProjectCollab";
import OtherUserProfile from "./components/OtherUserProfile";
import EventCollab from "./components/EventCollab";
import NotificationsList from "./components/NotificationsList";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <>
                <Header />
                <Home />
              </>
            }
          />
          <Route
            path="/Profile"
            element={
              <>
                <Header />
                <Profile />
              </>
            }
          />

          <Route
            path="/Procollab"
            element={
              <>
                <Header />
                <ProjectCollab/>
              </>
            }
          />

          <Route
            path="/events"
            element={
              <>
                <Header />
                <EventCollab/>
              </>
            }
          />

          <Route
            path="/user/:email"
            element={
              <>
                <Header />
                <OtherUserProfile/>
              </>
            }
          />

          <Route
            path="/notification"
            element={
              <>
                <Header />
                <NotificationsList/>
              </>
            }
          />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
