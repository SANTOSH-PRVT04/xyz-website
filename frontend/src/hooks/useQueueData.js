import { useState, useEffect } from 'react';

// Simulated backend database state (Static singleton for the session)
let mockDB = {
  stats: {
    activePatients: 142,
    avgWaitTimeMinutes: 18,
    availableDoctors: 12
  },
  liveQueue: [
    { id: 1, token: 'TKN-089', dept: 'Cardiology', status: 'Active', position: 0 },
    { id: 2, token: 'TKN-090', dept: 'Cardiology', status: 'Near Turn', position: 1 },
    { id: 3, token: 'TKN-091', dept: 'Cardiology', status: 'Waiting', position: 2 }
  ],
  adminStats: {
    overloadedCounters: [{ id: 2, dept: 'Orthopedics', load: 140 }],
    totalTokensToday: 852
  }
};

/**
 * Backend-ready custom hook simulating API calls.
 * Includes artificial latency to test skeleton loading states.
 */
export const useQueueData = (endpoint, config = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchData = async () => {
      // Simulate network latency (0.8s - 1.5s) to ensure skeletons are visible during test
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

      if (!isMounted) return;

      try {
        if (endpoint === '/stats') setData(mockDB.stats);
        else if (endpoint === '/live-queue') setData(mockDB.liveQueue);
        else if (endpoint === '/admin') setData(mockDB.adminStats);
        else throw new Error("Endpoint not found");
        
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Setup backend polling if requested (e.g., config.pollingInterval = 5000)
    let pollInterval;
    if (config.pollingInterval) {
      pollInterval = setInterval(fetchData, config.pollingInterval);
    }

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    }
  }, [endpoint, config.pollingInterval]);

  return { data, isLoading, error };
};
