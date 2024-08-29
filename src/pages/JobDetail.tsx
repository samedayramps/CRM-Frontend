import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { fetchJobById, deleteJob } from '../services/api';

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
  notes: string;
  components: Array<{
    _id: string;
    type: string;
    quantity: number;
  }>;
  totalRampLength: number;
  totalLandings: number;
}

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getJob = async () => {
      try {
        if (id) {
          const data = await fetchJobById(id);
          setJob(data);
        } else {
          setError('Job ID is missing');
        }
      } catch (error) {
        console.error('Failed to fetch job:', error);
        setError('Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };
    getJob();
  }, [id]);

  const handleDelete = async () => {
    if (job && window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(job._id);
        navigate('/jobs');
      } catch (error) {
        console.error('Failed to delete job:', error);
        setError('Failed to delete job');
      }
    }
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div className="text-red-500">{error}</div></Layout>;
  if (!job) return <Layout><div>Job not found</div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Job Details
              {job.customer ? ` for ${job.customer.firstName} ${job.customer.lastName}` : ' (No Customer Assigned)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Install Address: {job.installAddress}</p>
            <p>Status: {job.status}</p>
            <p>Total Cost: {job.totalCost !== undefined ? `$${job.totalCost.toFixed(2)}` : 'Not set'}</p>
            <p>Scheduled Date: {job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : 'Not scheduled'}</p>
            <p>Notes: {job.notes || 'No notes'}</p>
            <h3 className="text-lg font-semibold mt-4 mb-2">Ramp Components:</h3>
            {job.components && job.components.length > 0 ? (
              <ul>
                {job.components.map((component) => (
                  <li key={component._id}>{component.type} - Quantity: {component.quantity}</li>
                ))}
              </ul>
            ) : (
              <p>No components added</p>
            )}
            <p>Total Ramp Length: {job.totalRampLength} feet</p>
            <p>Total Landings: {job.totalLandings}</p>
            <div className="mt-4">
              <Button onClick={() => navigate(`/jobs/${job._id}/edit`)} className="mr-2">Edit</Button>
              <Button onClick={handleDelete} variant="destructive">Delete</Button>
            </div>
            {job.customer && (
              <div className="mt-4">
                <Link to={`/customers/${job.customer._id}`} className="text-blue-600 hover:underline">
                  View Customer Details
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default JobDetail;