import { Megaphone, SearchX } from "lucide-react";
import { Button } from "../ui/button";

// components/feed/EmptyStates.tsx
export const NoPostsEmptyState = () => (
    <div className="text-center py-12">
        <Megaphone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Nothing to see here yet</h3>
        <p className="text-muted-foreground">
            When you or people you follow post, you'll see it here.
        </p>
    </div>
);

export const NoSearchResultsEmptyState = ({ query }: { query: string }) => (
    <div className="text-center py-12">
        <SearchX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No results found</h3>
        <p className="text-muted-foreground mb-4">
            We couldn't find anything matching "{query}"
        </p>
        <Button variant="outline" onClick={() => {/* Add clear search functionality here */ }}>Clear search</Button>
    </div>
);