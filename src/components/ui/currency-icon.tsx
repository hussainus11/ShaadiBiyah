import React from 'react';
import { IndianRupee, DollarSign, Euro, PoundSterling, Yen } from 'lucide-react';
import { useCountry } from '../../contexts/CountryContext';

interface CurrencyIconProps {
  className?: string;
  size?: number;
}

export function CurrencyIcon({ className = "w-5 h-5", size }: CurrencyIconProps) {
  const { selectedCountry } = useCountry();

  // Map country codes to their respective currency icons
  const getCurrencyIcon = () => {
    switch (selectedCountry.code) {
      case 'IN':
        return <IndianRupee className={className} style={size ? { width: size, height: size } : undefined} />;
      case 'PK':
        return <DollarSign className={className} style={size ? { width: size, height: size } : undefined} />;
      case 'BD':
        return <DollarSign className={className} style={size ? { width: size, height: size } : undefined} />;
      case 'LK':
        return <DollarSign className={className} style={size ? { width: size, height: size } : undefined} />;
      case 'NP':
        return <DollarSign className={className} style={size ? { width: size, height: size } : undefined} />;
      case 'BT':
        return <DollarSign className={className} style={size ? { width: size, height: size } : undefined} />;
      case 'MV':
        return <DollarSign className={className} style={size ? { width: size, height: size } : undefined} />;
      case 'AF':
        return <DollarSign className={className} style={size ? { width: size, height: size } : undefined} />;
      default:
        return <IndianRupee className={className} style={size ? { width: size, height: size } : undefined} />;
    }
  };

  return getCurrencyIcon();
}




