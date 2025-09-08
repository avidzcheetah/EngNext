import React, { createContext, useContext, useEffect, useState } from "react";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
type CompanyProfile = {
  id?: string;
  description?: string;
  website?: string;
  email?: string;
  role?: string;
  logo?: string;
  logoType?: string;
  logoUrl?: string;
  companyName?: string;
  industry?:string;
  location?:string
};

type CompanyContextType = {
  companyProfiles: CompanyProfile[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>; // optional, if you want to reload data
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: React.ReactNode }) => {
  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${baseUrl}/api/companyRoutes/getAll`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();

      const companies = data.companies.map((company: any) => {
        const logoBase64 = company.logo || null;
        const contentType = company.logoType || "image/png";

        return {
          ...company,
          logoUrl: logoBase64 ? `data:${contentType};base64,${logoBase64}` : null,
          companyName: company.companyName || company.name,
        };
      });

      setCompanyProfiles(companies);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails(); // fetch once on app load
  }, []);

  return (
    <CompanyContext.Provider
      value={{ companyProfiles, loading, error, refetch: fetchCompanyDetails }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

// Custom hook
export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};
