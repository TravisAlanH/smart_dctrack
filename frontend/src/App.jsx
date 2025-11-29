import React from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CameraHome from "./components/Camera/CameraHome";
import { APIStore, ReuseDataStateStore } from "../store/Store";
import CameraModal from "./components/Camera/CameraModal/CameraModal";
import { header, headerTypes, headerDescriptions } from "./components/Helpers/HeadersAsObjects";
import Footer from "./components/Footer/Footer";
import Audit from "./components/Screens/Audit";
import ActionBar from "./components/ActionBar/ActionBar";
import SlideContent from "./components/ActionBar/SlideContent/SlideContent";
import Cabinet from "./components/Screens/Cabinet";
import Settings from "./components/Screens/Settings";
import Home from "./components/Screens/Home";
import LoadingSpinner from "./components/LoadingSpinner/Spinner";

// import MicrosoftLogin from "./components/MicrosoftLogin/MicrosoftLogin";

function App() {
  const pageView = ReuseDataStateStore((s) => s.data.pageView);
  const cabinetActionBar = ReuseDataStateStore((s) => s.data.cabinetActionBar);
  const show = APIStore((s) => s.data.openResponseMessage);
  const ContentLoading = APIStore((s) => s.data.ContentLoading);

  const loadSettingsIntoStore = APIStore((s) => s.loadSettingsIntoStore);

  React.useEffect(() => {
    loadSettingsIntoStore();
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#292929] text-black">
      <div className="flex-1 overflow-auto">
        <div className={pageView === 3 ? "block" : "hidden"}>
          <Audit />
        </div>

        <div className={pageView === 1 ? "block" : "hidden"}>
          <Cabinet pageView={pageView} />
        </div>

        <div className={pageView === 2 ? "block" : "hidden"}>
          <Settings pageView={pageView} />
        </div>

        <div className={pageView === 0 ? "block" : "hidden"}>
          <Home pageView={pageView} />
        </div>
      </div>

      <div
        className={
          show === true
            ? "absolute bottom-32 left-0 w-full h-60 bg-black text-white transition-all duration-300 translate-y-[5rem] rounded-xl"
            : "absolute bottom-32 left-0 w-full h-40 bg-black text-white transition-all duration-300 translate-y-[30rem] rounded-xl"
        }
      >
        <div className="p-4">
          <SlideContent />
        </div>
      </div>

      {pageView === 1 || pageView === 3 ? (
        <div className="h-12 z-10 bg-transparent">
          <ActionBar />
        </div>
      ) : null}

      <div className="h-[5.5rem] z-10">
        <Footer />
      </div>
      {ContentLoading ? <LoadingSpinner /> : null}
    </div>
  );
}

export default App;
