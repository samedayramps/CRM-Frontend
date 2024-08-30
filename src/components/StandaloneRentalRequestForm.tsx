// src/components/StandaloneRentalRequestForm.tsx

import React from 'react';
import RentalRequestForm from './RentalRequestForm';

const StandaloneRentalRequestForm: React.FC = () => {
  return (
    <div className="standalone-form-container">
      <RentalRequestForm />
    </div>
  );
};

export default StandaloneRentalRequestForm;