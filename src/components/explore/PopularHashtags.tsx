
import { formatNumber } from "@/utils/formatters";

interface Hashtag {
  id: string;
  tag: string;
  posts: number;
}

interface PopularHashtagsProps {
  hashtags: Hashtag[];
}

const PopularHashtags = ({ hashtags }: PopularHashtagsProps) => {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-3">
        {hashtags.length > 0 ? (
          hashtags.map((hashtag) => (
            <div key={hashtag.id} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <h3 className="font-semibold">#{hashtag.tag}</h3>
              <p className="text-sm text-muted-foreground">{formatNumber(hashtag.posts)} posts</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 col-span-2">
            <p className="text-muted-foreground">No hashtags found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularHashtags;
