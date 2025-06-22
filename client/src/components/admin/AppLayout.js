// AppLayout.jsx
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar fixed on the left */}
      <Sidebar />

      {/* Page content scrolls on the right */}
      <div className="ml-64 flex-1 overflow-y-auto h-screen p-4">
        <Outlet /> {/* Here your pages will render */}
      </div>
    </div>
  );
};

export default AppLayout;
