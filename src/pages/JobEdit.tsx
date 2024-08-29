// src/pages/JobEdit.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import JobForm from '../components/JobForm';
import { fetchJobById, updateJob } from '../services/api';
import { Job } from '../types/job';

const JobEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (id) {
          const jobData = await fetchJobById(id);
          // Ensure the customer field is correctly set
          setJob({
            ...jobData,
            customer: jobData.customer._id || jobData.customer
          });
        }
      } catch (err) {
        console.error('Failed to fetch job:', err);
        setError('Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleSubmit = async (updatedJob: Job) => {
    try {
      if (id) {
        await updateJob(id, updatedJob);
        navigate(`/jobs/${id}`);
      }
    } catch (err) {
      console.error('Failed to update job:', err);
      setError('Failed to update job');
    }
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div className="text-red-500">{error}</div></Layout>;
  if (!job) return <Layout><div>Job not found</div></Layout>;

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Edit Job</h1>
        <JobForm initialJob={job} onSubmit={handleSubmit} isEditing={true} />
      </div>
    </Layout>
  );
};

export default JobEdit;