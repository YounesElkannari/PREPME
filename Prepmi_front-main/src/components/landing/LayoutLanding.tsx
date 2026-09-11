import { Outlet } from "react-router-dom";
import { ScrollToTop } from "../ScrollToTop";
import { Header } from "../Header";

export default function LayoutLanding() {


  return (
    <>
      <div className="w-full">

        <Header />
      </div>

      <Outlet />

      {/* <Footer /> */}
      <ScrollToTop />
    </>
  );
}