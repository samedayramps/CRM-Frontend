import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { fetchCustomers, fetchPricingVariables } from '../services/api';
import { Job, RampComponent, Customer, PricingVariables } from '../types/job';
import { loadGoogleMapsAPI } from '../utils/googleMapsLoader';

// Modify the Job type to ensure installAddress is always a string
type JobFormState = Omit<Job, 'installAddress' | 'scheduledDate'> & {
  installAddress: string;
  scheduledDate: string;
};

interface Props {
  initialJob?: Job;
  onSubmit: (job: Job) => Promise<void>;
  isEditing: boolean;
}

const JobForm: React.FC<Props> = ({ initialJob, onSubmit, isEditing }) => {
    const navigate = useNavigate();
    const [job, setJob] = useState<JobFormState>(() => {
      if (initialJob) {
        const formattedDate = initialJob.scheduledDate 
          ? (initialJob.scheduledDate instanceof Date 
              ? initialJob.scheduledDate.toISOString().split('T')[0]
              : new Date(initialJob.scheduledDate).toISOString().split('T')[0])
          : '';
        return { 
          ...initialJob, 
          installAddress: initialJob.installAddress || '',
          scheduledDate: formattedDate 
        };
      }
      return {
        customer: '',
        installAddress: '',
        status: 'New',
        totalCost: 0,
        deliveryFee: 0,
        installFee: 0,
        rentalRate: 0,
        overridePricing: false,
        scheduledDate: '',
        notes: '',
        components: [],
        totalRampLength: 0,
        totalLandings: 0,
        distanceFromWarehouse: 0,
      };
    });

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [pricingVariables, setPricingVariables] = useState<PricingVariables>({
      deliveryFeePerMile: 0,
      installFeePerComponent: 0,
      rentalRatePerFoot: 0,
    });
    const [error, setError] = useState('');
    const [newComponent, setNewComponent] = useState<RampComponent>({ type: 'RS4', quantity: 1 });
    const autocompleteInput = useRef<HTMLInputElement>(null);

    const calculateDistance = useCallback((destinationAddress: string) => {
      if (window.google) {
        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: ['6008 windrige ln, flower mound, tx 75028'],
            destinations: [destinationAddress],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
          },
          (
            response: google.maps.DistanceMatrixResponse | null,
            status: google.maps.DistanceMatrixStatus
          ) => {
            if (status === google.maps.DistanceMatrixStatus.OK && response) {
              const distance = response.rows[0].elements[0].distance.value / 1609.34;
              setJob(prev => ({ ...prev, distanceFromWarehouse: Number(distance.toFixed(2)) }));
            } else {
              console.error('Error calculating distance:', status);
            }
          }
        );
      }
    }, []);

    const initAutocomplete = useCallback(() => {
      if (autocompleteInput.current && window.google) {
        const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInput.current, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
        });
    
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            setJob(prev => ({ ...prev, installAddress: place.formatted_address || '' }));
            calculateDistance(place.formatted_address);
          }
        });
      }
    }, [calculateDistance]);

    const calculatePricing = useCallback(() => {
      if (!job.overridePricing) {
        const totalComponents = job.components.reduce((sum, comp) => sum + comp.quantity, 0);
        const deliveryFee = job.distanceFromWarehouse * pricingVariables.deliveryFeePerMile;
        const installFee = totalComponents * pricingVariables.installFeePerComponent;
        const rentalRate = job.totalRampLength * pricingVariables.rentalRatePerFoot;

        setJob(prev => ({
          ...prev,
          deliveryFee,
          installFee,
          rentalRate,
          totalCost: deliveryFee + installFee + rentalRate,
        }));
      }
    }, [job.overridePricing, job.components, job.distanceFromWarehouse, job.totalRampLength, pricingVariables]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const [customersData, variables] = await Promise.all([
            fetchCustomers(),
            fetchPricingVariables()
          ]);
          setCustomers(customersData);
          setPricingVariables(variables);
        } catch (error) {
          console.error('Failed to fetch data:', error);
          setError('Failed to fetch necessary data');
        }
      };

      fetchData();

      loadGoogleMapsAPI().then(() => {
        if (window.google) {
          initAutocomplete();
        } else {
          console.error('Google Maps API not loaded');
        }
      });
    }, [initAutocomplete]);

    useEffect(() => {
      if (!job.overridePricing) {
        calculatePricing();
      }
    }, [job.components, job.distanceFromWarehouse, job.totalRampLength, pricingVariables, job.overridePricing, calculatePricing]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await onSubmit(job);
        navigate('/jobs');
      } catch (error) {
        console.error('Failed to save job:', error);
        setError('Failed to save job');
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setJob(prev => ({ ...prev, [name]: value }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setJob(prev => {
        const updatedJob = { ...prev, [name]: parseFloat(value) };
        updatedJob.totalCost = updatedJob.deliveryFee + updatedJob.installFee + updatedJob.rentalRate;
        return updatedJob;
      });
    };

    const handleAddComponent = () => {
      setJob(prev => ({
        ...prev,
        components: [...prev.components, newComponent],
        totalRampLength: prev.totalRampLength + (newComponent.type.startsWith('RS') ? parseInt(newComponent.type.slice(2)) * newComponent.quantity : 0),
        totalLandings: prev.totalLandings + (newComponent.type.startsWith('L') ? newComponent.quantity : 0),
      }));
      setNewComponent({ type: 'RS4', quantity: 1 });
    };

    const handleRemoveComponent = (index: number) => {
      setJob(prev => {
        const updatedComponents = [...prev.components];
        const removedComponent = updatedComponents.splice(index, 1)[0];
        return {
          ...prev,
          components: updatedComponents,
          totalRampLength: prev.totalRampLength - (removedComponent.type.startsWith('RS') ? parseInt(removedComponent.type.slice(2)) * removedComponent.quantity : 0),
          totalLandings: prev.totalLandings - (removedComponent.type.startsWith('L') ? removedComponent.quantity : 0),
        };
      });
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Job' : 'Add New Job'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="customer" className="block text-sm font-medium text-gray-700">Customer</label>
              <Select
                name="customer"
                id="customer"
                value={job.customer}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a customer</option>
                {customers.map(customer => (
                  <option key={customer._id} value={customer._id}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </Select>
            </div>
            <div className="mb-4">
              <label htmlFor="installAddress" className="block text-sm font-medium text-gray-700">Install Address</label>
              <Input
                type="text"
                name="installAddress"
                id="installAddress"
                ref={autocompleteInput}
                value={job.installAddress}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <Select
                name="status"
                id="status"
                value={job.status}
                onChange={handleInputChange}
                required
              >
                <option value="New">New</option>
                <option value="Quoted">Quoted</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Installed">Installed</option>
                <option value="Completed">Completed</option>
              </Select>
            </div>
            <div className="mb-4">
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">Scheduled Date</label>
              <Input
                type="date"
                name="scheduledDate"
                id="scheduledDate"
                value={job.scheduledDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
              <Textarea
                name="notes"
                id="notes"
                value={job.notes}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-700">Ramp Components</h3>
              {job.components.map((component, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <span>{component.type} - Quantity: {component.quantity}</span>
                  <Button type="button" onClick={() => handleRemoveComponent(index)} variant="destructive" size="sm">Remove</Button>
                </div>
              ))}
              <div className="flex items-end space-x-2">
                <div>
                  <label htmlFor="componentType" className="block text-sm font-medium text-gray-700">Type</label>
                  <Select
                    id="componentType"
                    value={newComponent.type}
                    onChange={(e) => setNewComponent({ ...newComponent, type: e.target.value as RampComponent['type'] })}
                  >
                    <option value="RS4">RS4</option>
                    <option value="RS5">RS5</option>
                    <option value="RS6">RS6</option>
                    <option value="RS7">RS7</option>
                    <option value="RS8">RS8</option>
                    <option value="L55">L55</option>
                    <option value="L45">L45</option>
                    <option value="L85">L85</option>
                  </Select>
                </div>
                <div>
                  <label htmlFor="componentQuantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                  <Input
                    type="number"
                    id="componentQuantity"
                    value={newComponent.quantity}
                    onChange={(e) => setNewComponent({ ...newComponent, quantity: parseInt(e.target.value) })}
                    min={1}
                  />
                </div>
                <Button type="button" onClick={handleAddComponent}>Add Component</Button>
              </div>
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <Checkbox
                  checked={job.overridePricing}
                  onCheckedChange={(checked: boolean) => setJob(prev => ({ ...prev, overridePricing: checked }))}
                />
                <span className="ml-2">Override Pricing</span>
              </label>
            </div>
            {job.overridePricing ? (
              <>
                <div className="mb-4">
                  <label htmlFor="deliveryFee" className="block text-sm font-medium text-gray-700">Delivery Fee</label>
                  <Input
                    type="number"
                    name="deliveryFee"
                    id="deliveryFee"
                    value={job.deliveryFee}
                    onChange={handlePriceChange}
                    required
                    step="0.01"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="installFee" className="block text-sm font-medium text-gray-700">Install Fee</label>
                  <Input
                    type="number"
                    name="installFee"
                    id="installFee"
                    value={job.installFee}
                    onChange={handlePriceChange}
                    required
                    step="0.01"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="rentalRate" className="block text-sm font-medium text-gray-700">Rental Rate</label>
                  <Input
                    type="number"
                    name="rentalRate"
                    id="rentalRate"
                    value={job.rentalRate}
                    onChange={handlePriceChange}
                    required
                    step="0.01"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <p>Delivery Fee: ${job.deliveryFee.toFixed(2)}</p>
                  <p>Install Fee: ${job.installFee.toFixed(2)}</p>
                  <p>Rental Rate: ${job.rentalRate.toFixed(2)}</p>
                </div>
              </>
            )}
            <div className="mb-4">
              <p>Total Cost: ${job.totalCost.toFixed(2)}</p>
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <Button type="submit">{isEditing ? 'Update Job' : 'Create Job'}</Button>
          </form>
        </CardContent>
      </Card>
    );
};

export default JobForm;