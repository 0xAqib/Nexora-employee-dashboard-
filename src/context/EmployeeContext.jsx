import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import employeesData from '../employees';

const EmployeeContext = createContext(null);

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem('nexora-employees');

      if (saved !== null) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }

      return employeesData;
    } catch {
      return employeesData;
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(
        'nexora-employees',
        JSON.stringify(employees)
      );

      setError('');
    } catch {
      setError(
        'Unable to save employee data. Check your browser storage.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [employees]);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        setEmployees,
        isLoading,
        error,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  const context = useContext(EmployeeContext);

  if (!context) {
    throw new Error(
      'useEmployees must be used inside EmployeeProvider.'
    );
  }

  return context;
}