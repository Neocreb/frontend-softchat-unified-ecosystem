import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  Clock,
  DollarSign,
  MapPin,
  Star,
  Users,
  ChevronRight,
  Zap,
  ShoppingBag,
  TrendingUp,
  Bookmark,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SponsoredJob {
  id: string;
  type: "job";
  title: string;
  client: {
    name: string;
    avatar: string;
    rating: number;
    location: string;
    verified: boolean;
  };
  budget: {
    min: number;
    max: number;
    type: "fixed" | "hourly";
  };
  skills: string[];
  postedTime: string;
  proposalsCount: number;
  isUrgent?: boolean;
  description: string;
}

interface SponsoredProduct {
  id: string;
  type: "product";
  title: string;
  seller: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  description: string;
}

interface SponsoredService {
  id: string;
  type: "service";
  title: string;
  provider: {
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
  };
  startingPrice: number;
  deliveryTime: string;
  image: string;
  category: string;
  description: string;
}

type SponsoredItem = SponsoredJob | SponsoredProduct | SponsoredService;

interface SponsoredContentProps {
  item: SponsoredItem;
}

const SponsoredContent: React.FC<SponsoredContentProps> = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    switch (item.type) {
      case "job":
        navigate(`/app/freelance/job/${item.id}`);
        break;
      case "product":
        navigate(`/app/marketplace/product/${item.id}`);
        break;
      case "service":
        navigate(`/app/freelance/service/${item.id}`);
        break;
    }
  };

  const handleProviderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === "job") {
      navigate(
        `/app/user/${item.client.name.toLowerCase().replace(/\s+/g, "-")}`,
      );
    } else if (item.type === "product") {
      navigate(
        `/app/user/${item.seller.name.toLowerCase().replace(/\s+/g, "-")}`,
      );
    } else {
      navigate(
        `/app/user/${item.provider.name.toLowerCase().replace(/\s+/g, "-")}`,
      );
    }
  };

  const renderJobContent = (job: SponsoredJob) => (
    <>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition-colors line-clamp-2">
              {job.title}
            </h3>
            {job.isUrgent && (
              <Badge variant="destructive" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Urgent
              </Badge>
            )}
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {job.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <div
              className="flex items-center gap-1"
              onClick={handleProviderClick}
            >
              <Avatar className="w-5 h-5 cursor-pointer">
                <AvatarImage src={job.client.avatar} />
                <AvatarFallback className="text-xs">
                  {job.client.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="hover:underline cursor-pointer">
                {job.client.name}
              </span>
              {job.client.verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-2 h-2 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{job.client.rating}</span>
            </div>

            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{job.client.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-medium">
                ${job.budget.min}-${job.budget.max}
                {job.budget.type === "hourly" ? "/hr" : " fixed"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{job.postedTime}</span>
            </div>

            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{job.proposalsCount} proposals</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {job.skills.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
        {job.skills.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{job.skills.length - 3} more
          </Badge>
        )}
      </div>
    </>
  );

  const renderProductContent = (product: SponsoredProduct) => (
    <>
      <div className="flex gap-4 mb-3">
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {product.title}
            </h3>
            {!product.inStock && (
              <Badge
                variant="outline"
                className="text-xs text-red-600 border-red-300"
              >
                Out of Stock
              </Badge>
            )}
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {product.description}
          </p>

          <div
            className="flex items-center gap-2 mb-2"
            onClick={handleProviderClick}
          >
            <Avatar className="w-5 h-5 cursor-pointer">
              <AvatarImage src={product.seller.avatar} />
              <AvatarFallback className="text-xs">
                {product.seller.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm hover:underline cursor-pointer">
              {product.seller.name}
            </span>
            {product.seller.verified && (
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-2 h-2 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm">{product.seller.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          </div>
        </div>
      </div>
    </>
  );

  const renderServiceContent = (service: SponsoredService) => (
    <>
      <div className="flex gap-4 mb-3">
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
            {service.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {service.description}
          </p>

          <div
            className="flex items-center gap-2 mb-2"
            onClick={handleProviderClick}
          >
            <Avatar className="w-5 h-5 cursor-pointer">
              <AvatarImage src={service.provider.avatar} />
              <AvatarFallback className="text-xs">
                {service.provider.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm hover:underline cursor-pointer">
              {service.provider.name}
            </span>
            {service.provider.verified && (
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-2 h-2 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm">{service.provider.rating}</span>
              <span className="text-sm text-gray-500">
                ({service.provider.reviewCount})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold text-green-600">
              From ${service.startingPrice}
            </span>
            <span className="text-gray-600">
              {service.deliveryTime} delivery
            </span>
            <Badge variant="secondary" className="text-xs">
              {service.category}
            </Badge>
          </div>
        </div>
      </div>
    </>
  );

  const getIcon = () => {
    switch (item.type) {
      case "job":
        return <Briefcase className="w-4 h-4 text-orange-600" />;
      case "product":
        return <ShoppingBag className="w-4 h-4 text-blue-600" />;
      case "service":
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case "job":
        return "Sponsored Job";
      case "product":
        return "Sponsored Product";
      case "service":
        return "Sponsored Service";
    }
  };

  return (
    <Card
      className="w-full hover:shadow-md transition-all cursor-pointer border-l-4 border-l-orange-400 bg-gradient-to-r from-orange-50/30 to-white"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        {/* Sponsored Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {getTypeLabel()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // Add to favorites
              }}
              className="h-8 w-8 p-0"
            >
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // Share functionality
              }}
              className="h-8 w-8 p-0"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // More options
              }}
              className="h-8 w-8 p-0"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content based on type */}
        {item.type === "job" && renderJobContent(item as SponsoredJob)}
        {item.type === "product" &&
          renderProductContent(item as SponsoredProduct)}
        {item.type === "service" &&
          renderServiceContent(item as SponsoredService)}

        {/* Action Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Promoted content</span>
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {item.type === "job"
              ? "Apply Now"
              : item.type === "product"
                ? "Buy Now"
                : "Order Now"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsoredContent;
