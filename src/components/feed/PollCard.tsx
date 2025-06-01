
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollCardProps {
  question: string;
  options: PollOption[];
  totalVotes: number;
  hasVoted: boolean;
  onVote: (optionId: string) => void;
}

const PollCard = ({ question, options, totalVotes, hasVoted, onVote }: PollCardProps) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="font-medium">{question}</h3>
        </div>
        
        <div className="space-y-2">
          {options.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            
            return (
              <div key={option.id} className="space-y-1">
                {hasVoted ? (
                  <div className="relative">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">{option.text}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.votes} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onVote(option.id)}
                  >
                    {option.text}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        
        {hasVoted && (
          <p className="text-xs text-muted-foreground mt-3">
            {totalVotes} people voted
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PollCard;
