import React from 'react';
import Layout from '../components/Layout';
import JobForm from '../components/JobForm';
import { createJob } from '../services/api';
import { Job } from '../types/job';

const JobNew: React.FC = () => {
  const handleSubmit = async (job: Job) => {
    await createJob(job);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Create New Job</h1>
        <JobForm onSubmit={handleSubmit} isEditing={false} />
      </div>
    </Layout>
  );
};

export default JobNew;