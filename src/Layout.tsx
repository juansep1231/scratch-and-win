import React from 'react';
import { Outlet } from 'react-router-dom';

// Replace with your actual logo path
const logoSrc = '../src/assets/web.webp';

const Layout: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <img src={logoSrc} alt="Logo" style={{ marginBottom: '10px', width: '300px', height: 'auto' }} /> {/* Adjust the marginBottom as needed */}
      <div style={{ flex: 1, width: '100%', maxWidth: '800px' }}>
        <Outlet />
      </div>
    </div>
    
  );  
  
};

export default Layout;
