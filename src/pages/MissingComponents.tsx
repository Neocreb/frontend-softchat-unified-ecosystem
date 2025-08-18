import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Briefcase, DollarSign, Truck } from 'lucide-react';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      onClick={() => navigate(-1)}
      className="mb-4 flex items-center gap-2"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </Button>
  );
};

// Service Detail Page
export const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Service Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Service ID: {serviceId}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">🚀 Service Details Coming Soon!</p>
            <p className="text-blue-600 text-sm mt-1">
              This page will show detailed information about freelance services.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Freelancer Profile Page
export const FreelancerProfile: React.FC = () => {
  const { username } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Freelancer Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Username: {username}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">🚀 Freelancer Profile Coming Soon!</p>
            <p className="text-blue-600 text-sm mt-1">
              This page will show detailed freelancer profiles, portfolios, and reviews.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// User Posts Page
export const UserPosts: React.FC = () => {
  const { username } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {username}'s Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">🚀 User Posts Coming Soon!</p>
            <p className="text-blue-600 text-sm mt-1">
              This page will show all posts from this user.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Trust Score Page
export const TrustScore: React.FC = () => {
  const { username } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {username}'s Trust Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">🚀 Trust Score Coming Soon!</p>
            <p className="text-blue-600 text-sm mt-1">
              This page will show detailed trust metrics and reputation scores.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// User Likes Page
export const UserLikes: React.FC = () => {
  const { username } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {username}'s Liked Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">🚀 Liked Content Coming Soon!</p>
            <p className="text-blue-600 text-sm mt-1">
              This page will show all content liked by this user.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// User Shares Page
export const UserShares: React.FC = () => {
  const { username } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {username}'s Shared Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">🚀 Shared Content Coming Soon!</p>
            <p className="text-blue-600 text-sm mt-1">
              This page will show all content shared by this user.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Crypto Profile Page
export const CryptoProfile: React.FC = () => {
  const { username } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {username}'s Crypto Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">🚀 Crypto Profile Coming Soon!</p>
            <p className="text-blue-600 text-sm mt-1">
              This page will show crypto trading history, trust scores, and reputation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Delivery Profile Page
export const DeliveryProfile: React.FC = () => {
  const { username } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            {username}'s Delivery Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">🚀 Delivery Profile Coming Soon!</p>
            <p className="text-blue-600 text-sm mt-1">
              This page will show delivery partner ratings, completed deliveries, and performance metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
