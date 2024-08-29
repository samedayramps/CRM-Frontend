import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { fetchCustomers } from '../services/api';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch customers');
        setLoading(false);
      }
    };

    getCustomers();
  }, []);

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div className="text-red-500">{error}</div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Customers</h1>
        <Link to="/customers/new">
          <Button className="mb-4">Add New Customer</Button>
        </Link>
        <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {customers.map((customer) => (
                <tr key={customer._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {customer.firstName} {customer.lastName}
                  </td>
                  <td className="py-3 px-6 text-left">{customer.email}</td>
                  <td className="py-3 px-6 text-left">{customer.phone}</td>
                  <td className="py-3 px-6 text-left">
                    <Link to={`/customers/${customer._id}`} className="text-blue-600 hover:text-blue-900 mr-4">View</Link>
                    <Link to={`/customers/${customer._id}/edit`} className="text-green-600 hover:text-green-900">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerList;