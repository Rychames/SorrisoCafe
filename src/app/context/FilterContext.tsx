"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ProductFilters {
  onlyQRCode: boolean;
  showProductDetails: boolean;
  showUserInfo: boolean;
  showCompanyInfo: boolean;
}

interface FilterContextType {
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<ProductFilters>({
    onlyQRCode: false,
    showProductDetails: true,
    showUserInfo: true,
    showCompanyInfo: true,
  });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
