import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// LocalStorage keys
const APP_SETTINGS_KEY = "app-settings";
const NOTIFICATION_SETTINGS_KEY = "notification-settings";

export type NotificationTypes = {
  rewards?: boolean;
  social?: boolean;
  orders?: boolean;
  trading?: boolean;
  price?: boolean;
  news?: boolean;
  security?: boolean;
  weeklyDigest?: boolean;
  marketing?: boolean;
};

export interface NotificationSettings {
  enabled: boolean;
  types: NotificationTypes;
}

export interface AppSettingsState {
  autoPlayVideos: boolean;
  notificationSettings: NotificationSettings;
}

const defaultAppSettings: AppSettingsState = {
  autoPlayVideos: true,
  notificationSettings: {
    enabled: true,
    types: {
      rewards: true,
      social: true,
      orders: true,
      trading: true,
      price: true,
      news: true,
      security: true,
      weeklyDigest: true,
      marketing: false,
    },
  },
};

interface AppSettingsContextType extends AppSettingsState {
  setAutoPlayVideos: (value: boolean) => void;
  setNotificationSettings: (settings: Partial<NotificationSettings>) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(
  undefined,
);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AppSettingsState>(() => {
    try {
      const saved = localStorage.getItem(APP_SETTINGS_KEY);
      if (saved) return { ...defaultAppSettings, ...JSON.parse(saved) };
    } catch {}
    // Try to hydrate notification settings from legacy key
    try {
      const legacyNotif = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (legacyNotif) {
        return {
          ...defaultAppSettings,
          notificationSettings: { ...defaultAppSettings.notificationSettings, ...JSON.parse(legacyNotif) },
        };
      }
    } catch {}
    return defaultAppSettings;
  });

  // Persist app settings
  useEffect(() => {
    try {
      localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  // Keep legacy notification-settings key in sync for services reading it
  useEffect(() => {
    try {
      localStorage.setItem(
        NOTIFICATION_SETTINGS_KEY,
        JSON.stringify(state.notificationSettings),
      );
    } catch {}
  }, [state.notificationSettings]);

  const setAutoPlayVideos = (value: boolean) =>
    setState((prev) => ({ ...prev, autoPlayVideos: value }));

  const setNotificationSettings = (settings: Partial<NotificationSettings>) =>
    setState((prev) => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        ...settings,
        types: { ...prev.notificationSettings.types, ...(settings.types || {}) },
      },
    }));

  const contextValue: AppSettingsContextType = useMemo(
    () => ({
      ...state,
      setAutoPlayVideos,
      setNotificationSettings,
    }),
    [state],
  );

  return (
    <AppSettingsContext.Provider value={contextValue}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = (): AppSettingsContextType => {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error("useAppSettings must be used within AppSettingsProvider");
  return ctx;
};
