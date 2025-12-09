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
import Modal from "./components/ActionBar/Modal/Modal";
import DataNeeded from "./components/Screens/DataNeeded";

// import MicrosoftLogin from "./components/MicrosoftLogin/MicrosoftLogin";

function App() {
  const pageView = ReuseDataStateStore((s) => s.data.pageView);
  const cabinetActionBar = ReuseDataStateStore((s) => s.data.cabinetActionBar);
  const show = APIStore((s) => s.data.openResponseMessage);
  const ContentLoading = APIStore((s) => s.data.ContentLoading);
  const ModalOpen = ReuseDataStateStore((s) => s.data.ModalOpen);
  const pullCustomFields = APIStore((s) => s.pullCustomFields);
  const replaceAllCustomFieldOnInstance = APIStore((s) => s.replaceAllCustomFieldOnInstance);
  const loadSettingsIntoStore = APIStore((s) => s.loadSettingsIntoStore);
  const CustomFieldsOnInstance = APIStore((s) => s.data.CustomFieldsOnInstance);
  const LOCATIONCODE = APIStore((s) => s.data.LOCATIONCODE);
  const BASE64USERPASS = APIStore((s) => s.data.BASE64USERPASS);

  React.useEffect(() => {
    async function run() {
      await loadSettingsIntoStore();

      const raw = localStorage.getItem("custom_fields_state");

      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          replaceAllCustomFieldOnInstance(parsed);
        } catch {
          await pullCustomFields();
        }
      } else {
        await pullCustomFields();
      }
    }

    run();
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col  bg-[#292929] text-black">
      <div className="flex-1 overflow-auto">
        <div className={pageView === 3 ? "block h-full  overflow-auto" : "hidden"}>
          {LOCATIONCODE === "" || BASE64USERPASS === "" ? <DataNeeded /> : <Audit />}
        </div>

        <div className={pageView === 1 ? "block h-full  overflow-auto" : "hidden"}>
          {LOCATIONCODE === "" || BASE64USERPASS === "" ? <DataNeeded /> : <Cabinet pageView={pageView} />}
        </div>

        <div className={pageView === 2 ? "block  h-full  overflow-auto" : "hidden"}>
          <Settings pageView={pageView} />
        </div>

        <div className={pageView === 0 ? "block  h-full  overflow-auto" : "hidden "}>
          {LOCATIONCODE === "" || BASE64USERPASS === "" ? <DataNeeded /> : <Home pageView={pageView} />}
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

      <div className="h-[4rem] z-10">
        <Footer />
      </div>
      {ContentLoading ? <LoadingSpinner /> : null}
      {ModalOpen.open === true ? <Modal /> : null}
    </div>
  );
}

export default App;
