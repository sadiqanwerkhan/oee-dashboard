import { useState, useEffect } from 'react';
import type { ProductionData } from '../types';
import productionDataJson from '../data/production-data.json';


export function useProductionData() {
  const [data, setData] = useState<ProductionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const loadData = async () => {
        setLoading(true);
        setError(null);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setData(productionDataJson as ProductionData);
        setLoading(false);
      };

      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load production data');
      setLoading(false);
    }
  }, []);

  return { data, loading, error };
}

