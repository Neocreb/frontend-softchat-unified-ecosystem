import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Store } from "lucide-react";

const UserStorePlaceholder: React.FC = () => {
  const { username } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link 
            to={`/profile/${username}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Profile</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{username}'s Store</h1>
          <p className="text-muted-foreground mb-4">
            This user's marketplace store and product listings
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              🚧 Store page is being enhanced with advanced features. Check back soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStorePlaceholder;
