import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Share2,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  Mail,
  Link,
  Check,
  QrCode,
  Gift,
  Users,
  TrendingUp,
  Heart,
  ExternalLink,
} from "lucide-react";
import { Product } from "@/types/marketplace";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import QRCode from "qrcode";

interface ProductSharingProps {
  product: Product;
  referralCode?: string;
  showCompact?: boolean;
  className?: string;
}

const ProductSharing = ({
  product,
  referralCode,
  showCompact = false,
  className,
}: ProductSharingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [shareStats, setShareStats] = useState({
    views: 156,
    shares: 23,
    conversions: 8,
    earnings: 45.6,
  });

  const { toast } = useToast();

  // Generate product URL with referral code
  const productUrl = `${window.location.origin}/marketplace/product/${product.id}${referralCode ? `?ref=${referralCode}` : ""}`;

  // Generate QR code
  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(productUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    }
  };

  // Social media sharing URLs
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(`Check out this ${product.name} - ${product.description.slice(0, 100)}...`)}`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't support direct URL sharing
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out this ${product.name}: ${productUrl}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(product.name)}`,
    email: `mailto:?subject=${encodeURIComponent(`Check out: ${product.name}`)}&body=${encodeURIComponent(`I found this amazing product and thought you might be interested:\n\n${product.name}\n${product.description}\n\nPrice: $${product.discountPrice || product.price}\n\nCheck it out: ${productUrl}`)}`,
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Product link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const trackShare = (platform: string) => {
    // Track sharing analytics
    setShareStats((prev) => ({
      ...prev,
      shares: prev.shares + 1,
    }));

    toast({
      title: "Shared!",
      description: `Product shared on ${platform}`,
    });
  };

  const SocialButton = ({
    icon,
    label,
    url,
    color,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    url?: string;
    color: string;
    onClick?: () => void;
  }) => (
    <Button
      variant="outline"
      className={cn("flex-1 gap-2", color)}
      onClick={() => {
        if (url) {
          window.open(url, "_blank", "width=600,height=400");
          trackShare(label);
        }
        onClick?.();
      }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );

  if (showCompact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={className}>
            <Share2 className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => copyToClipboard(productUrl)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.open(shareUrls.facebook, "_blank")}
          >
            <Facebook className="w-4 h-4 mr-2" />
            Share on Facebook
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.open(shareUrls.twitter, "_blank")}
          >
            <Twitter className="w-4 h-4 mr-2" />
            Share on Twitter
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.open(shareUrls.whatsapp, "_blank")}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Share on WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.open(shareUrls.email)}>
            <Mail className="w-4 h-4 mr-2" />
            Share via Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn("gap-2", className)}
          onClick={generateQRCode}
        >
          <Share2 className="w-4 h-4" />
          Share Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share "{product.name}"
          </DialogTitle>
          <DialogDescription>
            Share this product with friends and earn rewards through our
            referral program
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Preview */}
          <div className="flex gap-3 p-3 border rounded-lg bg-muted/20">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-1">
                {product.name}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {product.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-semibold text-sm">
                  ${product.discountPrice || product.price}
                </span>
                {product.discountPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${product.price}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Share Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Link</label>
            <div className="flex gap-2">
              <Input value={productUrl} readOnly className="text-xs" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(productUrl)}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Media Sharing */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Share on Social Media</label>
            <div className="grid grid-cols-2 gap-2">
              <SocialButton
                icon={<Facebook className="w-4 h-4" />}
                label="Facebook"
                url={shareUrls.facebook}
                color="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
              />
              <SocialButton
                icon={<Twitter className="w-4 h-4" />}
                label="Twitter"
                url={shareUrls.twitter}
                color="hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200"
              />
              <SocialButton
                icon={<MessageCircle className="w-4 h-4" />}
                label="WhatsApp"
                url={shareUrls.whatsapp}
                color="hover:bg-green-50 hover:text-green-600 hover:border-green-200"
              />
              <SocialButton
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                url={shareUrls.email}
                color="hover:bg-gray-50 hover:text-gray-600 hover:border-gray-200"
              />
            </div>
          </div>

          {/* QR Code */}
          {qrCodeUrl && (
            <div className="space-y-3">
              <label className="text-sm font-medium">QR Code</label>
              <div className="text-center p-4 border rounded-lg bg-white">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="mx-auto mb-2"
                  width={120}
                  height={120}
                />
                <p className="text-xs text-muted-foreground">
                  Scan to open product page
                </p>
              </div>
            </div>
          )}

          {/* Referral Program */}
          {referralCode && (
            <div className="space-y-3">
              <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-sm">Referral Program</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Earn rewards when people purchase through your shared link
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">5%</div>
                    <div className="text-xs text-muted-foreground">
                      Commission
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      ${shareStats.earnings}
                    </div>
                    <div className="text-xs text-muted-foreground">Earned</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Share Analytics */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Share Statistics</label>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-lg font-semibold text-blue-600">
                  {shareStats.views}
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Views
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-semibold text-green-600">
                  {shareStats.shares}
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" />
                  Shares
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-semibold text-purple-600">
                  {shareStats.conversions}
                </div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Heart className="w-3 h-3" />
                  Likes
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Call to Action */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Help others discover this amazing product!
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  copyToClipboard(productUrl);
                  setIsOpen(false);
                }}
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy & Share
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductSharing;
