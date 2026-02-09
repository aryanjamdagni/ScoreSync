import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import PageTransition from "./PageTransition";

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="h-full w-full flex">
        <Sidebar />
        <div className="flex-1 min-w-0 h-full">
          <div id="app-scroll" className="h-full overflow-y-auto overflow-x-hidden">
            <Topbar />
            <div className="px-6 py-6">
              <AnimatePresence mode="wait" initial={false}>
                <PageTransition key={location.pathname}>
                  <Outlet />
                </PageTransition>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
