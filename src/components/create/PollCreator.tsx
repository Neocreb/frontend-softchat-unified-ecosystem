
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PollCreator = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [duration, setDuration] = useState("24");
  const { toast } = useToast();

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = () => {
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a poll question",
        variant: "destructive",
      });
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast({
        title: "Error",
        description: "Please provide at least 2 poll options",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Poll Created!",
      description: "Your poll has been created successfully",
    });

    // Reset form
    setQuestion("");
    setOptions(["", ""]);
    setDuration("24");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Poll</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="question">Poll Question</Label>
          <Textarea
            id="question"
            placeholder="What would you like to ask?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Poll Options</Label>
          <div className="space-y-2 mt-2">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                />
                {options.length > 2 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {options.length < 4 && (
            <Button
              variant="outline"
              onClick={addOption}
              className="mt-2 w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          )}
        </div>

        <div>
          <Label htmlFor="duration">Poll Duration (hours)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            max="168"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-2"
          />
        </div>

        <Button onClick={handleCreatePoll} className="w-full">
          Create Poll
        </Button>
      </CardContent>
    </Card>
  );
};

export default PollCreator;
