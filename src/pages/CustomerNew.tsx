import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { createCustomer } from '../services/api';

interface NewCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

const CustomerNew: React.FC = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<NewCustomer>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newCustomer = await createCustomer(customer);
      navigate(`/customers/${newCustomer._id}`);
    } catch (error) {
      console.error('Failed to create customer:', error);
      setError('Failed to create customer');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Customer</CardTitle>
          </CardHeader>
          <CardContent>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <Input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={customer.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <Input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={customer.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={customer.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <Input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={customer.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                <Textarea
                  name="notes"
                  id="notes"
                  value={customer.notes}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              <Button type="submit">Create Customer</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomerNew;