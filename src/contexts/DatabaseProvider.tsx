import React, { createContext, useContext, useEffect, useState } from 'react';
import { initDatabase } from '../database';
import {
  getUserOnboardingStatus,
  setUserOnboardingStatus,
} from '../services/database.service';

interface DatabaseContextType {
  onboarding: {
    complete: () => Promise<void>;
    status: () => Promise<boolean>;
    reset: () => Promise<void>;
  };
  database: {
    ready: boolean;
    hasError: boolean;
  };
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [hasDatabaseError, setHasDatabaseError] = useState(false);

  const onboarding = {
    complete: async (): Promise<void> => {
      try {
        await setUserOnboardingStatus(true);
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
    },

    status: async (): Promise<boolean> => {
      return await getUserOnboardingStatus();
    },

    reset: async (): Promise<void> => {
      try {
        await setUserOnboardingStatus(false);
      } catch (error) {
        console.error('Error resetting onboarding:', error);
      }
    },
  };

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await initDatabase();
        setIsDatabaseReady(true);
      } catch (error) {
        console.error('Database initialization failed:', error);
        setHasDatabaseError(true);
      }
    };

    initializeDatabase();
  }, []);

  const contextValue: DatabaseContextType = {
    onboarding,
    database: {
      ready: isDatabaseReady,
      hasError: hasDatabaseError,
    },
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabaseContext() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error(
      'useDatabaseContext must be used within a DatabaseProvider',
    );
  }
  return context;
}
