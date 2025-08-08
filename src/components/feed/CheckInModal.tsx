import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Navigation, Building, Home, Utensils, ShoppingBag } from "lucide-react";

interface Location {
  id: string;
  name: string;
  address: string;
  type: 'restaurant' | 'store' | 'landmark' | 'home' | 'office' | 'other';
  distance?: string;
}

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckIn: (location: Location) => void;
}

const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  onCheckIn
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock locations data
  const mockLocations: Location[] = [
    {
      id: "1",
      name: "Starbucks Coffee",
      address: "123 Main Street, Downtown",
      type: "restaurant",
      distance: "0.1 km",
    },
    {
      id: "2",
      name: "Central Park",
      address: "New York, NY",
      type: "landmark",
      distance: "0.3 km",
    },
    {
      id: "3",
      name: "Apple Store",
      address: "456 Tech Avenue",
      type: "store",
      distance: "0.5 km",
    },
    {
      id: "4",
      name: "Home",
      address: "789 Residential St",
      type: "home",
      distance: "2.1 km",
    },
    {
      id: "5",
      name: "McDonald's",
      address: "321 Fast Food Lane",
      type: "restaurant",
      distance: "0.7 km",
    },
    {
      id: "6",
      name: "Times Square",
      address: "Manhattan, NY",
      type: "landmark",
      distance: "1.2 km",
    },
    {
      id: "7",
      name: "Best Buy",
      address: "987 Electronics Blvd",
      type: "store",
      distance: "1.5 km",
    },
    {
      id: "8",
      name: "Office Building",
      address: "555 Business District",
      type: "office",
      distance: "3.2 km",
    },
  ];

  const filteredLocations = mockLocations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLocationIcon = (type: Location['type']) => {
    switch (type) {
      case 'restaurant':
        return <Utensils className="h-5 w-5 text-orange-500" />;
      case 'store':
        return <ShoppingBag className="h-5 w-5 text-purple-500" />;
      case 'home':
        return <Home className="h-5 w-5 text-green-500" />;
      case 'office':
        return <Building className="h-5 w-5 text-blue-500" />;
      default:
        return <MapPin className="h-5 w-5 text-red-500" />;
    }
  };

  const handleCheckIn = (location: Location) => {
    onCheckIn(location);
    onClose();
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation: Location = {
            id: "current",
            name: "Current Location",
            address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`,
            type: "other",
          };
          handleCheckIn(currentLocation);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full h-[70vh] p-0 flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Check in</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for a place..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Current location button */}
          <Button
            variant="outline"
            onClick={handleCurrentLocation}
            className="w-full flex items-center gap-2"
          >
            <Navigation className="h-4 w-4" />
            <span>Use current location</span>
          </Button>
        </div>

        {/* Locations list */}
        <div className="flex-1 overflow-y-auto">
          {filteredLocations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p>No locations found</p>
              <p className="text-sm">Try searching for a place name</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredLocations.map(location => (
                <button
                  key={location.id}
                  onClick={() => handleCheckIn(location)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
                >
                  <div className="flex-shrink-0">
                    {getLocationIcon(location.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{location.name}</p>
                    <p className="text-sm text-gray-500 truncate">{location.address}</p>
                  </div>
                  {location.distance && (
                    <div className="flex-shrink-0">
                      <span className="text-xs text-gray-400">{location.distance}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom location input */}
        <div className="p-4 border-t">
          <Input
            placeholder="Type a custom location..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                const customLocation: Location = {
                  id: "custom",
                  name: e.currentTarget.value.trim(),
                  address: "Custom location",
                  type: "other",
                };
                handleCheckIn(customLocation);
              }
            }}
          />
          <p className="text-xs text-gray-500 mt-2">Press Enter to add custom location</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInModal;
