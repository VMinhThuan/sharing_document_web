import { Outlet } from "react-router-dom";
import ClientSidebar from "../components/ClientSidebar/ClientSidebar";

const ClientLayout = () => {
  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-[#111318] dark:text-white font-display overflow-hidden antialiased">
      <ClientSidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ClientLayout;
