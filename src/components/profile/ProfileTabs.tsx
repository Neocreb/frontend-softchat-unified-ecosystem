
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Post, default as PostCard } from "@/components/feed/PostCard";
import { Product } from "@/types/marketplace";
import ProductCard from "@/components/marketplace/ProductCard";
import WalletCard from "@/components/wallet/WalletCard";
import WalletTransactions from "@/components/wallet/WalletTransactions";
import RewardsCard from "@/components/wallet/RewardsCard";
import { ExtendedUser } from "@/types/user";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  posts: Post[];
  products: Product[];
  profileUser: ExtendedUser;
  isOwnProfile: boolean;
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
  onDeleteProduct?: (productId: string) => void;
}

const ProfileTabs = ({
  activeTab,
  setActiveTab,
  posts,
  products,
  profileUser,
  isOwnProfile,
  onAddToCart,
  onAddToWishlist,
  onDeleteProduct,
}: ProfileTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="border-b sticky top-0 bg-background z-10">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="posts" className="space-y-6 py-4">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No posts yet</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="marketplace" className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                className="h-full"
                showSellerInfo={false}
                onMessageSeller={isOwnProfile ? undefined : () => {}}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No products listed yet</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="wallet" className={`py-4 ${!isOwnProfile ? "hidden" : ""}`}>
        {isOwnProfile ? (
          <div className="space-y-6">
            <WalletCard />
            <WalletTransactions />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Wallet information is private</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="rewards" className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RewardsCard />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recent Activity</h3>
            <div className="border rounded-lg p-4 space-y-3">
              {[
                { action: "Created a post", points: 10, date: "April 12, 2025" },
                { action: "Commented on a post", points: 5, date: "April 10, 2025" },
                { action: "Product sold", points: 50, date: "April 5, 2025" },
                {
                  action: "Daily login streak (7 days)",
                  points: 25,
                  date: "April 3, 2025",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b last:border-0 pb-2 last:pb-0"
                >
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    <div className="text-sm text-muted-foreground">
                      {activity.date}
                    </div>
                  </div>
                  <div className="text-green-500 font-medium">
                    +{activity.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
