import React from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CameraHome from "./components/Camera/CameraHome";
import { ReuseDataStateStore } from "../store/Store";
import CameraModal from "./components/Camera/CameraModal/CameraModal";
import { header, headerTypes, headerDescriptions } from "./components/Helpers/HeadersAsObjects";
import Footer from "./components/Footer/Footer";
import Audit from "./components/Screens/Audit";
import ActionBar from "./components/ActionBar/ActionBar";
import SlideContent from "./components/ActionBar/SlideContent/SlideContent";
import Cabinet from "./components/Screens/Cabinet";

// import MicrosoftLogin from "./components/MicrosoftLogin/MicrosoftLogin";

function App() {
  const pageView = ReuseDataStateStore((s) => s.data.pageView);
  const [show, setShow] = React.useState(0);

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[calc(100vh-11rem)] overflow-auto">
        <div className={pageView === 0 ? "block" : "hidden"}>
          <Audit setShow={setShow} />
        </div>

        <div className={pageView === 1 ? "block" : "hidden"}>
          <Cabinet setShow={setShow} pageView={pageView} />
        </div>
      </div>

      <div
        className={
          show === 1
            ? "absolute bottom-12 rounded-xl left-0 w-full h-80 bg-black text-white transition-all duration-300 translate-y-0"
            : "absolute bottom-12 rounded xl left-0 w-full h-60 bg-black text-white transition-all duration-300 translate-y-full"
        }
      >
        <div className="p-4">
          <SlideContent setShow={setShow} />
        </div>
      </div>

      <div className="absolute bottom-32 left-0 w-full h-12">
        <ActionBar setShow={setShow} />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32">
        <Footer />
      </div>
    </div>
  );
}

export default App;
