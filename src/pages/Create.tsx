
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import CreatePostCard from "@/components/feed/CreatePostCard";
import EnhancedCreateTabs from "@/components/create/EnhancedCreateTabs";
import PollCreator from "@/components/create/PollCreator";
import StoryCreator from "@/components/create/StoryCreator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays } from "lucide-react";

const Create = () => {
  const [activeTab, setActiveTab] = useState("post");

  return (
    <div className="container max-w-2xl mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create Content</h1>
        <p className="text-muted-foreground">Share your thoughts, create polls, or post stories</p>
      </div>

      <EnhancedCreateTabs activeTab={activeTab} onValueChange={setActiveTab} />

      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="post">
            <CreatePostCard onPostCreated={() => {}} />
          </TabsContent>

          <TabsContent value="poll">
            <PollCreator />
          </TabsContent>

          <TabsContent value="story">
            <StoryCreator />
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Schedule Post
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="scheduled-content">Post Content</Label>
                  <Textarea
                    id="scheduled-content"
                    placeholder="What would you like to share?"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schedule-date">Date</Label>
                    <Input
                      id="schedule-date"
                      type="date"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="schedule-time">Time</Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      className="mt-2"
                    />
                  </div>
                </div>
                <Button className="w-full">
                  Schedule Post
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Create;
