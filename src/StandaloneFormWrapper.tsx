// src/StandaloneFormWrapper.tsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import StandaloneRentalRequestForm from './components/StandaloneRentalRequestForm';

const StandaloneFormWrapper: React.FC = () => {
  return <StandaloneRentalRequestForm />;
};

// Mount the app
const mountNode = document.getElementById('standalone-rental-form');
if (mountNode) {
  const root = createRoot(mountNode);
  root.render(<StandaloneFormWrapper />);
}

export default StandaloneFormWrapper;