import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useUserCollections } from "@/contexts/UserCollectionsContext";
import { StickerData } from "@/types/sticker";

interface TestResult {
  test: string;
  status: "pass" | "fail" | "info";
  message: string;
}

const MemeGifTest: React.FC = () => {
  const { toast } = useToast();
  const { collections, saveToCollection, removeFromCollection, isInCollection } = useUserCollections();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (test: string, status: "pass" | "fail" | "info", message: string) => {
    setTestResults(prev => [...prev, { test, status, message }]);
  };

  const runTests = async () => {
    setTesting(true);
    setTestResults([]);

    // Test 1: Context availability
    try {
      if (collections) {
        addResult("Context Loading", "pass", "UserCollectionsContext is available");
      } else {
        addResult("Context Loading", "fail", "UserCollectionsContext not found");
      }
    } catch (error) {
      addResult("Context Loading", "fail", `Context error: ${error}`);
    }

    // Test 2: Collections structure
    try {
      const hasCorrectStructure = 
        collections && 
        Array.isArray(collections.memes) &&
        Array.isArray(collections.gifs) &&
        Array.isArray(collections.stickers);
      
      if (hasCorrectStructure) {
        addResult("Collections Structure", "pass", "All collection arrays are properly initialized");
      } else {
        addResult("Collections Structure", "fail", "Collections structure is invalid");
      }
    } catch (error) {
      addResult("Collections Structure", "fail", `Structure error: ${error}`);
    }

    // Test 3: Save to collection
    try {
      const testMeme: Omit<StickerData, "id"> = {
        name: "Test Meme",
        fileUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        thumbnailUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        type: "meme",
        width: 200,
        height: 200,
        tags: ["test", "meme"],
        packId: "test",
        packName: "Test",
        usageCount: 0,
      };

      const memeId = saveToCollection(testMeme, "memes");
      
      if (memeId && collections.memes.some(m => m.id === memeId)) {
        addResult("Save to Collection", "pass", `Successfully saved test meme with ID: ${memeId}`);
      } else {
        addResult("Save to Collection", "fail", "Failed to save meme to collection");
      }
    } catch (error) {
      addResult("Save to Collection", "fail", `Save error: ${error}`);
    }

    // Test 4: Collection detection
    try {
      const testUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
      const inCollection = isInCollection(testUrl, "memes");
      
      if (inCollection) {
        addResult("Collection Detection", "pass", "Successfully detected item in collection");
      } else {
        addResult("Collection Detection", "fail", "Failed to detect item in collection");
      }
    } catch (error) {
      addResult("Collection Detection", "fail", `Detection error: ${error}`);
    }

    // Test 5: Remove from collection
    try {
      const testMemeInCollection = collections.memes.find(m => m.name === "Test Meme");
      if (testMemeInCollection) {
        removeFromCollection(testMemeInCollection.id, "memes");
        
        // Check if removed
        const stillExists = collections.memes.some(m => m.id === testMemeInCollection.id);
        if (!stillExists) {
          addResult("Remove from Collection", "pass", "Successfully removed test meme");
        } else {
          addResult("Remove from Collection", "fail", "Failed to remove meme from collection");
        }
      } else {
        addResult("Remove from Collection", "info", "No test meme found to remove");
      }
    } catch (error) {
      addResult("Remove from Collection", "fail", `Remove error: ${error}`);
    }

    // Test 6: LocalStorage persistence
    try {
      const storedData = localStorage.getItem("userCollections");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed && parsed.memes && parsed.gifs && parsed.stickers) {
          addResult("LocalStorage Persistence", "pass", "Collections are properly stored in localStorage");
        } else {
          addResult("LocalStorage Persistence", "fail", "Invalid data structure in localStorage");
        }
      } else {
        addResult("LocalStorage Persistence", "info", "No data in localStorage yet (this is normal for new users)");
      }
    } catch (error) {
      addResult("LocalStorage Persistence", "fail", `localStorage error: ${error}`);
    }

    setTesting(false);
    
    toast({
      title: "Tests Complete",
      description: `Ran ${testResults.length + 6} tests. Check results below.`,
    });
  };

  const getStatusIcon = (status: "pass" | "fail" | "info") => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "fail":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: "pass" | "fail" | "info") => {
    switch (status) {
      case "pass":
        return "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20";
      case "fail":
        return "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20";
      case "info":
        return "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20";
    }
  };

  const passCount = testResults.filter(r => r.status === "pass").length;
  const failCount = testResults.filter(r => r.status === "fail").length;
  const infoCount = testResults.filter(r => r.status === "info").length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            Meme & GIF Functionality Tests
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span>Collections:</span>
              <Badge variant="outline">{collections.memes.length} memes</Badge>
              <Badge variant="outline">{collections.gifs.length} GIFs</Badge>
              <Badge variant="outline">{collections.stickers.length} stickers</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Controls */}
          <div className="flex items-center gap-4">
            <Button 
              onClick={runTests} 
              disabled={testing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {testing ? "Running Tests..." : "Run Functionality Tests"}
            </Button>
            
            {testResults.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-600">
                  {passCount} Passed
                </Badge>
                <Badge variant="destructive">
                  {failCount} Failed
                </Badge>
                <Badge variant="secondary">
                  {infoCount} Info
                </Badge>
              </div>
            )}
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Test Results</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="font-medium">{result.test}</div>
                        <div className="text-sm opacity-80">{result.message}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Collections State */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="font-medium mb-3">Current Collections State</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-orange-600">Memes ({collections.memes.length})</div>
                {collections.memes.length > 0 ? (
                  <ul className="mt-1 space-y-1">
                    {collections.memes.slice(0, 3).map((meme) => (
                      <li key={meme.id} className="truncate opacity-70">
                        {meme.name}
                      </li>
                    ))}
                    {collections.memes.length > 3 && (
                      <li className="opacity-50">... and {collections.memes.length - 3} more</li>
                    )}
                  </ul>
                ) : (
                  <div className="opacity-50">No memes yet</div>
                )}
              </div>
              
              <div>
                <div className="font-medium text-purple-600">GIFs ({collections.gifs.length})</div>
                {collections.gifs.length > 0 ? (
                  <ul className="mt-1 space-y-1">
                    {collections.gifs.slice(0, 3).map((gif) => (
                      <li key={gif.id} className="truncate opacity-70">
                        {gif.name}
                      </li>
                    ))}
                    {collections.gifs.length > 3 && (
                      <li className="opacity-50">... and {collections.gifs.length - 3} more</li>
                    )}
                  </ul>
                ) : (
                  <div className="opacity-50">No GIFs yet</div>
                )}
              </div>
              
              <div>
                <div className="font-medium text-blue-600">Stickers ({collections.stickers.length})</div>
                {collections.stickers.length > 0 ? (
                  <ul className="mt-1 space-y-1">
                    {collections.stickers.slice(0, 3).map((sticker) => (
                      <li key={sticker.id} className="truncate opacity-70">
                        {sticker.name}
                      </li>
                    ))}
                    {collections.stickers.length > 3 && (
                      <li className="opacity-50">... and {collections.stickers.length - 3} more</li>
                    )}
                  </ul>
                ) : (
                  <div className="opacity-50">No stickers yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Test Instructions</h4>
            <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
              <li>Click "Run Functionality Tests" to verify the collections system</li>
              <li>Navigate to <code>/meme-gif-demo</code> to test the full interface</li>
              <li>Create memes/GIFs and verify they save to collections</li>
              <li>Click on created content to test interaction options</li>
              <li>Check that collections persist after page refresh</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemeGifTest;
