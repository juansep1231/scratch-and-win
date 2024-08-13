
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MySpinWheel from './WheelSpin';

import ScratchCard from './ScratchCard';

import Layout from './Layout';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MySpinWheel />} />
          <Route path="scratch" element={<ScratchCard />} />
          {/* Add more routes as needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
