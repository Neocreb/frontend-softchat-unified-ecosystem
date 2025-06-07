
import React from "react";

const FeedSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((index) => (
        <div key={index} className="space-y-4 bg-card rounded-lg border p-4">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
              <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-40 bg-muted rounded animate-pulse"></div>
        </div>
      ))}
    </>
  );
};

export default FeedSkeleton;
