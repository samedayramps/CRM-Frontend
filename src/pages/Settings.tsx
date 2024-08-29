import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import api from '../services/api';

interface PricingVariables {
  deliveryFeePerMile: number;
  installFeePerComponent: number;
  rentalRatePerFoot: number;
}

const Settings: React.FC = () => {
  const [pricingVariables, setPricingVariables] = useState<PricingVariables>({
    deliveryFeePerMile: 0,
    installFeePerComponent: 0,
    rentalRatePerFoot: 0,
  });

  useEffect(() => {
    const fetchPricingVariables = async () => {
      try {
        const response = await api.get('/api/settings/pricing');
        setPricingVariables(response.data);
      } catch (error) {
        console.error('Failed to fetch pricing variables:', error);
      }
    };

    fetchPricingVariables();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPricingVariables(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.put('/api/settings/pricing', pricingVariables);
      alert('Pricing variables updated successfully');
    } catch (error) {
      console.error('Failed to update pricing variables:', error);
      alert('Failed to update pricing variables');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Pricing Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="deliveryFeePerMile" className="block text-sm font-medium text-gray-700">Delivery Fee (per mile)</label>
                <Input
                  type="number"
                  name="deliveryFeePerMile"
                  id="deliveryFeePerMile"
                  value={pricingVariables.deliveryFeePerMile}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="installFeePerComponent" className="block text-sm font-medium text-gray-700">Install Fee (per component)</label>
                <Input
                  type="number"
                  name="installFeePerComponent"
                  id="installFeePerComponent"
                  value={pricingVariables.installFeePerComponent}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="rentalRatePerFoot" className="block text-sm font-medium text-gray-700">Rental Rate (per foot)</label>
                <Input
                  type="number"
                  name="rentalRatePerFoot"
                  id="rentalRatePerFoot"
                  value={pricingVariables.rentalRatePerFoot}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;