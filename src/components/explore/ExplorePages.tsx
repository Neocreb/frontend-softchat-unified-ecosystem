
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Users, Eye, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Page {
  id: string;
  name: string;
  description: string;
  category: string;
  followers: number;
  cover: string;
  verified?: boolean;
}

interface ExplorePagesProps {
  pages: Page[];
}

const ExplorePages = ({ pages }: ExplorePagesProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [followedPages, setFollowedPages] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleCreatePage = (formData: FormData) => {
    // Here you would typically send the data to your backend
    console.log("Creating page:", Object.fromEntries(formData));
    setIsCreateModalOpen(false);
    toast({
      title: "Page created!",
      description: "Your page has been created successfully.",
    });
  };

  const handleFollowPage = (pageId: string) => {
    setFollowedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Header with Create Page Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Discover Pages</h2>
          <p className="text-muted-foreground">Find and follow pages that interest you</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Page
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Page</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreatePage(new FormData(e.currentTarget));
            }} className="space-y-4">
              <div>
                <Label htmlFor="pageName">Page Name</Label>
                <Input id="pageName" name="pageName" placeholder="Enter page name" required />
              </div>
              <div>
                <Label htmlFor="pageDescription">Description</Label>
                <Textarea id="pageDescription" name="pageDescription" placeholder="Describe your page" required />
              </div>
              <div>
                <Label htmlFor="pageCategory">Category</Label>
                <Input id="pageCategory" name="pageCategory" placeholder="e.g., Business, Entertainment" required />
              </div>
              <Button type="submit" className="w-full">Create Page</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.length > 0 ? (
          pages.map((page) => (
            <Card key={page.id} className="hover:shadow-lg transition-shadow">
              <div className="h-32 overflow-hidden rounded-t-lg">
                <img src={page.cover} alt={page.name} className="w-full h-full object-cover" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  {page.name}
                  {page.verified && <Star className="h-4 w-4 text-yellow-500" />}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{page.category}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{page.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{page.followers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </div>
                  </div>
                  <Button
                    variant={followedPages.has(page.id) ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleFollowPage(page.id)}
                  >
                    {followedPages.has(page.id) ? "Following" : "Follow"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <div className="text-muted-foreground">No pages found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePages;
