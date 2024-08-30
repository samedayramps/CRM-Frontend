// src/components/RentalRequestForm.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { loadGoogleMapsAPI } from '../utils/googleMapsLoader';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  knowRampLength: string;
  estimatedRampLength: string;
  knowRentalDuration: string;
  rentalDuration: string;
  installationTimeframe: string;
  mobilityAids: string[];
  installAddress: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  knowRampLength?: string;
  estimatedRampLength?: string;
  knowRentalDuration?: string;
  rentalDuration?: string;
  installationTimeframe?: string;
  mobilityAids?: string;
  installAddress?: string;
}

const RentalRequestForm: React.FC = () => {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    knowRampLength: 'no',
    estimatedRampLength: '',
    knowRentalDuration: 'no',
    rentalDuration: '',
    installationTimeframe: '',
    mobilityAids: [],
    installAddress: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const addressInputRef = useRef<HTMLInputElement>(null);

  const initAutocomplete = useCallback(() => {
    if (addressInputRef.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        setFormData(prev => ({ ...prev, installAddress: place.formatted_address || '' }));
      });
    }
  }, []);

  useEffect(() => {
    loadGoogleMapsAPI().then(() => {
      initAutocomplete();
    });
  }, [initAutocomplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && name === 'mobilityAids') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        mobilityAids: checked
          ? [...prev.mobilityAids, value]
          : prev.mobilityAids.filter(aid => aid !== value),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (page === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phone)) newErrors.phone = 'Phone number is invalid';
    }

    if (page === 2) {
      if (formData.knowRampLength === 'yes' && !formData.estimatedRampLength) {
        newErrors.estimatedRampLength = 'Please provide an estimated ramp length';
      }
      if (formData.knowRentalDuration === 'yes' && !formData.rentalDuration) {
        newErrors.rentalDuration = 'Please provide the rental duration';
      }
      if (!formData.installationTimeframe) newErrors.installationTimeframe = 'Please select when you need the ramp installed';
      if (formData.mobilityAids.length === 0) newErrors.mobilityAids = 'Please select at least one mobility aid';
      if (!formData.installAddress) newErrors.installAddress = 'Installation address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextPage = () => {
    if (validateForm()) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setPage(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('https://samedayramps-016e8e090b17.herokuapp.com/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          // Reset form and show success message
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            knowRampLength: 'no',
            estimatedRampLength: '',
            knowRentalDuration: 'no',
            rentalDuration: '',
            installationTimeframe: '',
            mobilityAids: [],
            installAddress: '',
          });
          setPage(1);
          alert('Your rental request has been submitted successfully!');
        } else {
          throw new Error('Failed to submit request');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your request. Please try again.');
      }
    }
  };

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formattedPhoneNumber }));
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {page === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                First Name
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                Last Name
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
              {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.email ? 'border-red-500' : ''
                }`}
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.phone ? 'border-red-500' : ''
                }`}
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                required
              />
              {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleNextPage}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {page === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Ramp Details</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Do you know how long of a ramp you need?
              </label>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="knowRampLength"
                    value="yes"
                    checked={formData.knowRampLength === 'yes'}
                    onChange={handleInputChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    name="knowRampLength"
                    value="no"
                    checked={formData.knowRampLength === 'no'}
                    onChange={handleInputChange}
                    className="form-radio"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>
            {formData.knowRampLength === 'yes' && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estimatedRampLength">
                  Estimated Ramp Length (in feet)
                </label>
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.estimatedRampLength ? 'border-red-500' : ''
                  }`}
                  id="estimatedRampLength"
                  type="number"
                  name="estimatedRampLength"
                  value={formData.estimatedRampLength}
                  onChange={handleInputChange}
                />
                {errors.estimatedRampLength && (
                  <p className="text-red-500 text-xs italic">{errors.estimatedRampLength}</p>
                )}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Do you know how long you need the ramp?
              </label>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="knowRentalDuration"
                    value="yes"
                    checked={formData.knowRentalDuration === 'yes'}
                    onChange={handleInputChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    name="knowRentalDuration"
                    value="no"
                    checked={formData.knowRentalDuration === 'no'}
                    onChange={handleInputChange}
                    className="form-radio"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>
            {formData.knowRentalDuration === 'yes' && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rentalDuration">
                  Rental Duration (in months)
                </label>
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.rentalDuration ? 'border-red-500' : ''
                  }`}
                  id="rentalDuration"
                  type="number"
                  name="rentalDuration"
                  value={formData.rentalDuration}
                  onChange={handleInputChange}
                  min="1"
                />
                {errors.rentalDuration && (
                  <p className="text-red-500 text-xs italic">{errors.rentalDuration}</p>
                )}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">How soon do you need it installed?</label>
              <select
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.installationTimeframe ? 'border-red-500' : ''
                }`}
                name="installationTimeframe"
                value={formData.installationTimeframe}
                onChange={handleInputChange}
              >
                <option value="">Select timeframe</option>
                <option value="Immediately">Immediately</option>
                <option value="Within a week">Within a week</option>
                <option value="Within two weeks">Within two weeks</option>
                <option value="Within a month">Within a month</option>
                <option value="No rush">No rush</option>
              </select>
              {errors.installationTimeframe && <p className="text-red-500 text-xs italic">{errors.installationTimeframe}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Mobility aids to be used with the ramp</label>
              {['Wheelchair', 'Motorized scooter', 'Walker/cane', 'None'].map((aid) => (
                <div key={aid}>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="mobilityAids"
                      value={aid}
                      checked={formData.mobilityAids.includes(aid)}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <span className="ml-2">{aid}</span>
                  </label>
                </div>
              ))}
              {errors.mobilityAids && <p className="text-red-500 text-xs italic">{errors.mobilityAids}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="installAddress">
                Installation Address
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.installAddress ? 'border-red-500' : ''
                }`}
                id="installAddress"
                type="text"
                name="installAddress"
                value={formData.installAddress}
                onChange={handleInputChange}
                ref={addressInputRef}
                required
                placeholder="Start typing an address..."
              />
              {errors.installAddress && <p className="text-red-500 text-xs italic">{errors.installAddress}</p>}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handlePrevPage}
              >
                Previous
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit Request
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default RentalRequestForm;