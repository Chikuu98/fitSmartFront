import { Outlet } from "react-router-dom";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-gray-900 transition-colors duration-300">
      <Header />
      <main className="flex-1 px-0 md:px-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
