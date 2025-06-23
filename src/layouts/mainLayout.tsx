import { Outlet } from "react-router-dom";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-white text-black dark:bg-black dark:text-white px-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
