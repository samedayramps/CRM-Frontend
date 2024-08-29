import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { fetchJobs } from '../services/api';

interface Job {
  _id: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
  } | null;
  installAddress: string;
  status: string;
  totalCost: number | undefined;
  scheduledDate: string;
  totalRampLength: number;
  totalLandings: number;
}

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch jobs');
        setLoading(false);
      }
    };

    getJobs();
  }, []);

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div className="text-red-500">{error}</div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Jobs</h1>
        <Link to="/jobs/new">
          <Button className="mb-4">Add New Job</Button>
        </Link>
        <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Customer</th>
                <th className="py-3 px-6 text-left">Address</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Total Cost</th>
                <th className="py-3 px-6 text-left">Scheduled Date</th>
                <th className="py-3 px-6 text-left">Ramp Length</th>
                <th className="py-3 px-6 text-left">Landings</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {jobs.map((job) => (
                <tr key={job._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {job.customer ? (
                      <Link to={`/customers/${job.customer._id}`} className="text-blue-600 hover:text-blue-900">
                        {job.customer.firstName} {job.customer.lastName}
                      </Link>
                    ) : (
                      <span>No customer assigned</span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-left">{job.installAddress}</td>
                  <td className="py-3 px-6 text-left">{job.status}</td>
                  <td className="py-3 px-6 text-left">
                    {job.totalCost !== undefined ? `$${job.totalCost.toFixed(2)}` : 'N/A'}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 px-6 text-left">{job.totalRampLength} ft</td>
                  <td className="py-3 px-6 text-left">{job.totalLandings}</td>
                  <td className="py-3 px-6 text-left">
                    <Link to={`/jobs/${job._id}`} className="text-blue-600 hover:text-blue-900 mr-4">View</Link>
                    <Link to={`/jobs/${job._id}/edit`} className="text-green-600 hover:text-green-900">Edit</Link>
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

export default JobList;