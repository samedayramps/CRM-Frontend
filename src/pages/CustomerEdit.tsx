import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { fetchCustomerById, updateCustomer } from '../services/api';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
}

const CustomerEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getCustomer = async () => {
      try {
        if (id) {
          const data = await fetchCustomerById(id);
          setCustomer(data);
        } else {
          setError('Customer ID is missing');
        }
      } catch (error) {
        console.error('Failed to fetch customer:', error);
        setError('Failed to fetch customer details');
      } finally {
        setLoading(false);
      }
    };
    getCustomer();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (customer) {
      try {
        await updateCustomer(customer._id, customer);
        navigate(`/customers/${customer._id}`);
      } catch (error) {
        console.error('Failed to update customer:', error);
        setError('Failed to update customer');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => prev ? { ...prev, [name]: value } : null);
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div className="text-red-500">{error}</div></Layout>;
  if (!customer) return <Layout><div>Customer not found</div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Customer: {customer.firstName} {customer.lastName}</CardTitle>
          </CardHeader>
          <CardContent>
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
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomerEdit;