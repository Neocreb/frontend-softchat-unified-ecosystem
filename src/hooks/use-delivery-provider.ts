import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface DeliveryProviderStatus {
  isProvider: boolean;
  status: "not_applied" | "pending" | "verified" | "rejected" | "suspended";
  providerId?: string;
  loading: boolean;
}

export function useDeliveryProvider(): DeliveryProviderStatus {
  const [providerStatus, setProviderStatus] = useState<DeliveryProviderStatus>({
    isProvider: false,
    status: "not_applied",
    loading: true,
  });
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setProviderStatus({
        isProvider: false,
        status: "not_applied",
        loading: false,
      });
      return;
    }

    // Check if user is a delivery provider
    const checkProviderStatus = async () => {
      try {
        const response = await fetch("/api/delivery/providers/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const provider = await response.json();

          // Validate the provider data structure
          if (!provider || typeof provider !== 'object') {
            console.error("Invalid provider data structure:", provider);
            throw new Error("Invalid provider data received from server");
          }

          // Validate the verification status
          const validStatuses = ["pending", "verified", "rejected", "suspended"];
          const status = provider.verificationStatus && validStatuses.includes(provider.verificationStatus)
            ? provider.verificationStatus
            : "pending";

          // Validate provider ID
          if (!provider.id) {
            console.error("Provider data missing ID:", provider);
            throw new Error("Provider data is missing required ID field");
          }

          setProviderStatus({
            isProvider: true,
            status: status as "pending" | "verified" | "rejected" | "suspended",
            providerId: String(provider.id), // Ensure it's a string
            loading: false,
          });
        } else if (response.status === 404) {
          // User is not a delivery provider
          setProviderStatus({
            isProvider: false,
            status: "not_applied",
            loading: false,
          });
        } else {
          // Error occurred
          setProviderStatus({
            isProvider: false,
            status: "not_applied",
            loading: false,
          });
        }
      } catch (error) {
        console.error("Error checking delivery provider status:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          name: error instanceof Error ? error.name : undefined,
        });
        setProviderStatus({
          isProvider: false,
          status: "not_applied",
          loading: false,
        });
      }
    };

    checkProviderStatus();
  }, [user, isAuthenticated]);

  return providerStatus;
}
