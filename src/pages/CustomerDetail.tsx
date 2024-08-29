import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { fetchCustomerById, deleteCustomer, fetchJobsByCustomer } from '../services/api';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface Job {
  _id: string;
  installAddress: string;
  status: string;
  totalCost: number;
  scheduledDate: string;
}

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const customerData = await fetchCustomerById(id);
          setCustomer(customerData);
          const jobsData = await fetchJobsByCustomer(id);
          setJobs(jobsData);
        } else {
          setError('Customer ID is missing');
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch customer details and jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (customer && window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(customer._id);
        navigate('/customers');
      } catch (error) {
        console.error('Failed to delete customer:', error);
        setError('Failed to delete customer');
      }
    }
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div className="text-red-500">{error}</div></Layout>;
  if (!customer) return <Layout><div>Customer not found</div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>{customer.firstName} {customer.lastName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Email: {customer.email}</p>
            <p>Phone: {customer.phone}</p>
            <p>Notes: {customer.notes}</p>
            <div className="mt-4">
              <Button onClick={() => navigate(`/customers/${customer._id}/edit`)} className="mr-2">Edit</Button>
              <Button onClick={handleDelete} variant="destructive">Delete</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Associated Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <p>No jobs associated with this customer.</p>
            ) : (
              <ul>
                {jobs.map((job) => (
                  <li key={job._id} className="mb-2">
                    <Link to={`/jobs/${job._id}`} className="text-blue-600 hover:underline">
                      Job at {job.installAddress} - {job.status}
                    </Link>
                    <p>Scheduled: {new Date(job.scheduledDate).toLocaleDateString()}</p>
                    <p>Total Cost: ${job.totalCost}</p>
                  </li>
                ))}
              </ul>
            )}
            <Button onClick={() => navigate('/jobs/new', { state: { customerId: customer._id } })} className="mt-4">
              Create New Job
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomerDetail;