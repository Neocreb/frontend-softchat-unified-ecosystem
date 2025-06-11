// src/components/feed/FeelingLocationModal.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Smile,
  MapPin,
  Search,
  Navigation,
  Clock,
  X
} from 'lucide-react';
import {
  FEELINGS,
  ACTIVITIES,
  LOCATION_SUGGESTIONS,
  feedService
} from '@/services/feedService';
import { useToast } from '@/components/ui/use-toast';

interface FeelingLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeelingSelected: (feeling: { emoji: string; text: string }) => void;
  onLocationSelected: (location: { name: string; coordinates?: { lat: number; lng: number } }) => void;
  defaultTab?: 'feeling' | 'location';
}

export function FeelingLocationModal({
  isOpen,
  onClose,
  onFeelingSelected,
  onLocationSelected,
  defaultTab = 'feeling'
}: FeelingLocationModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [locationSearch, setLocationSearch] = useState('');
  const [locationResults, setLocationResults] = useState(LOCATION_SUGGESTIONS);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();

  // Reset tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setLocationSearch('');
      setLocationResults(LOCATION_SUGGESTIONS);
    }
  }, [isOpen, defaultTab]);

  // Search locations
  useEffect(() => {
    if (locationSearch.trim()) {
      setIsSearching(true);
      const searchTimeout = setTimeout(async () => {
        try {
          const results = await feedService.searchLocations(locationSearch);
          setLocationResults(results);
        } catch (error) {
          console.error('Location search failed:', error);
        } finally {
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(searchTimeout);
    } else {
      setLocationResults(LOCATION_SUGGESTIONS);
    }
  }, [locationSearch]);

  const handleFeelingSelect = (feeling: { emoji: string; text: string }) => {
    onFeelingSelected(feeling);
    onClose();
  };

  const handleLocationSelect = (location: { name: string; coordinates?: { lat: number; lng: number } }) => {
    onLocationSelected(location);
    onClose();
  };

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await feedService.getCurrentLocation();
      if (location) {
        handleLocationSelect(location);
      } else {
        toast({
          title: 'Location access denied',
          description: 'Please enable location access or select a location manually.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to get location',
        description: 'Please try again or select a location manually.',
        variant: 'destructive',
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">How are you feeling?</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Express your mood or share your location
          </DialogDescription>
        </DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {activeTab === 'feeling' ? (
              <>
                <Smile className="w-5 h-5" />
                How are you feeling?
              </>
            ) : (
              <>
                <MapPin className="w-5 h-5" />
                Where are you?
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {activeTab === 'feeling'
              ? 'Let your friends know what you\'re feeling or doing'
              : 'Add your location to this post'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'feeling' | 'location')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feeling" className="flex items-center gap-1">
              <Smile className="w-4 h-4" />
              Feeling
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Location
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feeling" className="space-y-4">
            {/* Feelings Section */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-600">Feelings</h4>
              <div className="grid grid-cols-2 gap-2">
                {FEELINGS.map((feeling, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-3 hover:bg-blue-50"
                    onClick={() => handleFeelingSelect(feeling)}
                  >
                    <span className="text-xl mr-2">{feeling.emoji}</span>
                    <span className="text-sm">{feeling.text}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Activities Section */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-600">Activities</h4>
              <div className="grid grid-cols-2 gap-2">
                {ACTIVITIES.map((activity, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-3 hover:bg-green-50"
                    onClick={() => handleFeelingSelect(activity)}
                  >
                    <span className="text-xl mr-2">{activity.emoji}</span>
                    <span className="text-sm">{activity.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            {/* Current Location */}
            <Button
              variant="outline"
              className="w-full justify-start p-3"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
            >
              <Navigation className="w-4 h-4 mr-2" />
              {isGettingLocation ? 'Getting location...' : 'Use current location'}
            </Button>

            {/* Location Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search for a location..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="pl-10"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>

            {/* Location Results */}
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {locationResults.map((location, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start p-3 h-auto"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <MapPin className="w-4 h-4 mr-2 text-red-500" />
                    <span className="text-sm">{location.name}</span>
                  </Button>
                ))}

                {locationResults.length === 0 && locationSearch && (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No locations found</p>
                    <p className="text-xs">Try a different search term</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}