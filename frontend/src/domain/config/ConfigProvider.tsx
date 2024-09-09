"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { ClientConfig } from "./clientConfig";

const ConfigContext = createContext<ClientConfig | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode, configData: ClientConfig }> = ({ children, configData }) => {
  const config: ClientConfig = useMemo(() => ({
    ENDPOINT: configData.ENDPOINT,
  }), [configData]);
  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): ClientConfig => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

