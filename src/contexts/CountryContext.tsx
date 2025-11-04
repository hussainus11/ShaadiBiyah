import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  paymentMethods: string[];
  flag: string;
}

export interface CountryContextType {
  selectedCountry: Country;
  setSelectedCountry: (country: Country) => void;
  countries: Country[];
}

const countries: Country[] = [
  {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    currencySymbol: 'Rs.',
    paymentMethods: ['UPI', 'Paytm', 'PhonePe', 'Google Pay', 'Razorpay', 'Stripe'],
    flag: '🇮🇳'
  },
  {
    code: 'PK',
    name: 'Pakistan',
    currency: 'PKR',
    currencySymbol: 'Rs.',
    paymentMethods: ['JazzCash', 'EasyPaisa', 'Bank Transfer', 'Card Payment', 'Stripe'],
    flag: '🇵🇰'
  },
  {
    code: 'BD',
    name: 'Bangladesh',
    currency: 'BDT',
    currencySymbol: '৳',
    paymentMethods: ['bKash', 'Rocket', 'Nagad', 'Bank Transfer', 'Card Payment'],
    flag: '🇧🇩'
  },
  {
    code: 'LK',
    name: 'Sri Lanka',
    currency: 'LKR',
    currencySymbol: 'Rs.',
    paymentMethods: ['Bank Transfer', 'Card Payment', 'Stripe', 'PayPal'],
    flag: '🇱🇰'
  },
  {
    code: 'NP',
    name: 'Nepal',
    currency: 'NPR',
    currencySymbol: 'Rs.',
    paymentMethods: ['eSewa', 'Khalti', 'Bank Transfer', 'Card Payment'],
    flag: '🇳🇵'
  },
  {
    code: 'BT',
    name: 'Bhutan',
    currency: 'BTN',
    currencySymbol: 'Nu.',
    paymentMethods: ['Bank Transfer', 'Card Payment', 'Stripe'],
    flag: '🇧🇹'
  },
  {
    code: 'MV',
    name: 'Maldives',
    currency: 'MVR',
    currencySymbol: 'Rf.',
    paymentMethods: ['Bank Transfer', 'Card Payment', 'Stripe', 'PayPal'],
    flag: '🇲🇻'
  },
  {
    code: 'AF',
    name: 'Afghanistan',
    currency: 'AFN',
    currencySymbol: '؋',
    paymentMethods: ['Bank Transfer', 'Card Payment', 'Stripe'],
    flag: '🇦🇫'
  }
];

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // Default to India

  // Load saved country preference from localStorage
  useEffect(() => {
    const savedCountryCode = localStorage.getItem('selectedCountry');
    if (savedCountryCode) {
      const country = countries.find(c => c.code === savedCountryCode);
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, []);

  // Save country preference to localStorage when changed
  const handleSetSelectedCountry = (country: Country) => {
    setSelectedCountry(country);
    localStorage.setItem('selectedCountry', country.code);
  };

  return (
    <CountryContext.Provider value={{
      selectedCountry,
      setSelectedCountry: handleSetSelectedCountry,
      countries
    }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}
