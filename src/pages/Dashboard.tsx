// frontend/src/pages/Dashboard.tsx

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchCustomers } from '../slices/customerSlice';
import { fetchJobs } from '../slices/jobSlice';
import { RootState } from '../store';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { customers, loading: customersLoading, error: customersError } = useAppSelector((state: RootState) => state.customers);
  const { jobs, loading: jobsLoading, error: jobsError } = useAppSelector((state: RootState) => state.jobs);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchCustomers()).unwrap();
        await dispatch(fetchJobs()).unwrap();
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          // Token might be expired or invalid
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [dispatch, navigate]);

  if (customersError || jobsError) {
    return <div>Error loading data. Please try again later.</div>;
  }
  
  return (
    <Layout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Dashboard
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Quick overview of your CRM
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Customers
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customersLoading ? (
                  'Loading...'
                ) : (
                  <>
                    {customers.length} total
                    <Link to="/customers" className="ml-2 text-indigo-600 hover:text-indigo-900">View all customers</Link>
                  </>
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Jobs
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {jobsLoading ? (
                  'Loading...'
                ) : (
                  <>
                    {jobs.length} total
                    <Link to="/jobs" className="ml-2 text-indigo-600 hover:text-indigo-900">View all jobs</Link>
                  </>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;