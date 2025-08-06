import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface DeliveryProviderStatus {
  isProvider: boolean;
  status: "not_applied" | "pending" | "verified" | "rejected";
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
          setProviderStatus({
            isProvider: true,
            status: provider.verificationStatus || "pending",
            providerId: provider.id,
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
