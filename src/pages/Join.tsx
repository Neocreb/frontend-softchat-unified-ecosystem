import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ReferralService } from '@/services/referralService';

const Join: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const refCode = searchParams.get('ref');

    if (isAuthenticated) {
      // User is already logged in, redirect to feed
      navigate('/feed', { replace: true });
      return;
    }

    if (refCode) {
      // Track the referral click in the background
      ReferralService.trackReferralClick(refCode).catch(error => {
        console.error('Error tracking referral click:', error);
      });

      // Redirect to auth page with referral code
      navigate(`/auth?ref=${encodeURIComponent(refCode)}`, { replace: true });
    } else {
      // No referral code, redirect to normal auth
      navigate('/auth', { replace: true });
    }
  }, [searchParams, navigate, isAuthenticated]);

  const benefits = [
    {
      icon: <Gift className="w-5 h-5 text-purple-500" />,
      title: "Instant Bonus",
      description: "Get $5 bonus when you complete registration"
    },
    {
      icon: <DollarSign className="w-5 h-5 text-green-500" />,
      title: "Earn While Social",
      description: "Make money from posts, videos, and interactions"
    },
    {
      icon: <Users className="w-5 h-5 text-blue-500" />,
      title: "Join the Community",
      description: "Connect with creators and entrepreneurs"
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-orange-500" />,
      title: "Build Your Business",
      description: "Access marketplace and freelance opportunities"
    }
  ];

  if (isTracking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Processing your invitation...</h2>
            <p className="text-muted-foreground">Please wait while we prepare your special welcome.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SoftchatLogo className="h-8 w-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Softchat
              </span>
            </div>
            {isAuthenticated && (
              <Button variant="outline" onClick={() => navigate('/feed')}>
                Go to Feed
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Special Invitation
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
              You've Been Invited!
            </h1>
            
            <p className="text-xl text-muted-foreground mb-2">
              A friend thought you'd love Softchat's earning opportunities
            </p>
            
            {referralCode && (
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border">
                <span className="text-sm font-medium text-muted-foreground">Referral Code:</span>
                <code className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm font-mono">
                  {referralCode}
                </code>
                {trackingComplete && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </div>
            )}
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-50 rounded-full">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl md:text-3xl font-bold">
                Ready to Start Earning?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-purple-100 mb-6 text-lg">
                Join thousands of creators and entrepreneurs already earning on Softchat
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-gray-50 shadow-lg"
                  onClick={handleJoinNow}
                >
                  {isAuthenticated ? 'Go to Feed' : 'Join Now'} 
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                {!isAuthenticated && (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10"
                    onClick={() => navigate('/auth')}
                  >
                    Already have an account?
                  </Button>
                )}
              </div>
              
              <p className="text-xs text-purple-200 mt-4">
                Free to join • No hidden fees • Start earning immediately
              </p>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-6">What You'll Get Access To</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Social Earning</h3>
                <p className="text-sm text-muted-foreground">
                  Earn from posts, videos, comments, and social interactions
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Marketplace</h3>
                <p className="text-sm text-muted-foreground">
                  Buy and sell products with integrated crypto payments
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Freelancing</h3>
                <p className="text-sm text-muted-foreground">
                  Offer services and find job opportunities with secure escrow
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;
