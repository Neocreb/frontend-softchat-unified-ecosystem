import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UnifiedActionButtons from "./UnifiedActionButtons";

const ActionButtonsTest: React.FC = () => {
  const testItems = [
    {
      id: "product-1",
      type: "product" as const,
      content: {
        price: "$99.99",
        location: "Online Store",
        rating: 4.5,
      },
    },
    {
      id: "job-1", 
      type: "job" as const,
      content: {
        salary: "$5000/month",
        location: "Remote",
        rating: 4.8,
      },
    },
    {
      id: "skill-1",
      type: "freelancer_skill" as const,
      content: {
        rate: "$50/hr",
        location: "Global",
        rating: 4.9,
      },
    },
    {
      id: "event-1",
      type: "live_event" as const,
      content: {
        location: "Virtual Event",
        rating: 4.7,
      },
    },
    {
      id: "community-1",
      type: "community_event" as const,
      content: {
        location: "Community Center",
        rating: 4.6,
      },
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Action Buttons Test</h2>
      <p className="text-muted-foreground mb-6">
        Testing unified action buttons across different content types and feed modes.
      </p>
      
      {testItems.map((item) => (
        <Card key={item.id} className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="capitalize">
              {item.type.replace('_', ' ')} Item
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {item.content.location} • Rating: {item.content.rating}/5
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Compact Variant:</h4>
                <UnifiedActionButtons
                  item={item}
                  variant="compact"
                />
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Full Variant:</h4>
                <UnifiedActionButtons
                  item={item}
                  variant="full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ActionButtonsTest;
