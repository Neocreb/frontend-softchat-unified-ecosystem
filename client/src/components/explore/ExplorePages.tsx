
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/utils/formatters";

interface Page {
  id: string;
  name: string;
  followers: number;
  category: string;
  verified: boolean;
  avatar: string;
}

interface ExplorePagesProps {
  pages: Page[];
}

const ExplorePages = ({ pages }: ExplorePagesProps) => {
  return (
    <div className="mt-4 space-y-4">
      {pages.length > 0 ? (
        pages.map((page) => (
          <div key={page.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={page.avatar} alt={page.name} />
                  <AvatarFallback>{page.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {page.verified && (
                  <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex items-center">
                  <span className="font-semibold">{page.name}</span>
                  {page.verified && (
                    <Badge variant="outline" className="ml-1 bg-blue-500 p-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{page.category}</p>
                <p className="text-xs text-muted-foreground">{formatNumber(page.followers)} followers</p>
              </div>
            </div>
            <button className="text-sm font-semibold text-blue-500">Follow</button>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No pages found</p>
        </div>
      )}
    </div>
  );
};

export default ExplorePages;
