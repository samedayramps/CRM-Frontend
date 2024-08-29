// src/pages/RentalRequest.tsx

import React from 'react';
import Layout from '../components/Layout';
import RentalRequestForm from '../components/RentalRequestForm';

const RentalRequest: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center my-8">Wheelchair Ramp Rental Request</h1>
        <RentalRequestForm />
      </div>
    </Layout>
  );
};

export default RentalRequest;