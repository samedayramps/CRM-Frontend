// src/types/job.ts

export interface RampComponent {
    _id?: string;
    type: 'RS4' | 'RS5' | 'RS6' | 'RS7' | 'RS8' | 'L55' | 'L45' | 'L85';
    quantity: number;
  }
  
  export interface Job {
    _id?: string;
    customer: string;
    installAddress: string;
    status: 'New' | 'Quoted' | 'Scheduled' | 'Installed' | 'Completed';
    totalCost: number;
    deliveryFee: number;
    installFee: number;
    rentalRate: number;
    overridePricing: boolean;
    scheduledDate?: Date | string; // Change this line
    notes: string;
    components: RampComponent[];
    totalRampLength: number;
    totalLandings: number;
    distanceFromWarehouse: number;
  }
  
  export interface Customer {
    _id: string;
    firstName: string;
    lastName: string;
  }
  
  export interface PricingVariables {
    deliveryFeePerMile: number;
    installFeePerComponent: number;
    rentalRatePerFoot: number;
  }