import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle,
  AlertTriangle,
  X,
  Eye,
  Settings,
} from "lucide-react";

interface LayoutTest {
  id: string;
  name: string;
  description: string;
  test: () => boolean;
  fix?: string;
}

const MobileLayoutChecker: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState("desktop");
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  const layoutTests: LayoutTest[] = [
    {
      id: "viewport-meta",
      name: "Viewport Meta Tag",
      description: "Checks if proper viewport meta tag is present",
      test: () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        return (
          viewport?.getAttribute("content")?.includes("width=device-width") ||
          false
        );
      },
      fix: "Add <meta name='viewport' content='width=device-width, initial-scale=1.0'> to HTML head",
    },
    {
      id: "touch-targets",
      name: "Touch Target Size",
      description: "Verifies buttons and links are at least 44px for touch",
      test: () => {
        const buttons = document.querySelectorAll("button, a");
        let validTargets = 0;
        buttons.forEach((btn) => {
          const rect = btn.getBoundingClientRect();
          if (rect.height >= 40 && rect.width >= 40) {
            validTargets++;
          }
        });
        return validTargets / buttons.length > 0.8; // 80% threshold
      },
      fix: "Ensure buttons and links have min-height: 44px and adequate padding",
    },
    {
      id: "horizontal-scroll",
      name: "No Horizontal Scroll",
      description: "Checks for unwanted horizontal scrolling on mobile",
      test: () => {
        return document.documentElement.scrollWidth <= window.innerWidth;
      },
      fix: "Remove fixed widths, use max-width: 100% and overflow-x: hidden",
    },
    {
      id: "text-readability",
      name: "Text Readability",
      description: "Ensures text is readable without zooming",
      test: () => {
        const textElements = document.querySelectorAll(
          "p, span, div, h1, h2, h3, h4, h5, h6",
        );
        let readableElements = 0;
        textElements.forEach((el) => {
          const styles = window.getComputedStyle(el);
          const fontSize = parseInt(styles.fontSize);
          if (fontSize >= 14) {
            readableElements++;
          }
        });
        return readableElements / textElements.length > 0.9; // 90% threshold
      },
      fix: "Ensure base font size is at least 14px on mobile devices",
    },
    {
      id: "image-responsive",
      name: "Responsive Images",
      description: "Checks if images are responsive and don't overflow",
      test: () => {
        const images = document.querySelectorAll("img");
        let responsiveImages = 0;
        images.forEach((img) => {
          const styles = window.getComputedStyle(img);
          if (styles.maxWidth === "100%" || styles.width === "100%") {
            responsiveImages++;
          }
        });
        return responsiveImages / images.length > 0.8;
      },
      fix: "Add max-width: 100% and height: auto to all images",
    },
    {
      id: "modal-mobile",
      name: "Mobile Modal Behavior",
      description: "Verifies modals work properly on mobile",
      test: () => {
        const modals = document.querySelectorAll('[role="dialog"]');
        if (modals.length === 0) return true; // No modals to test

        let mobileOptimized = 0;
        modals.forEach((modal) => {
          const styles = window.getComputedStyle(modal);
          if (window.innerWidth < 640) {
            // On mobile, should use more screen space
            if (styles.width === "100%" || styles.maxWidth === "95vw") {
              mobileOptimized++;
            }
          } else {
            mobileOptimized++; // Desktop is fine
          }
        });
        return mobileOptimized === modals.length;
      },
      fix: "Use ResponsiveDialog component with mobileFullScreen option",
    },
  ];

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCurrentBreakpoint("mobile");
      } else if (width < 1024) {
        setCurrentBreakpoint("tablet");
      } else {
        setCurrentBreakpoint("desktop");
      }
    };

    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, []);

  const runTests = () => {
    const results: Record<string, boolean> = {};
    layoutTests.forEach((test) => {
      try {
        results[test.id] = test.test();
      } catch (error) {
        console.error(`Test ${test.id} failed:`, error);
        results[test.id] = false;
      }
    });
    setTestResults(results);
  };

  useEffect(() => {
    if (isVisible) {
      runTests();
    }
  }, [isVisible]);

  const getBreakpointIcon = () => {
    switch (currentBreakpoint) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getBreakpointColor = () => {
    switch (currentBreakpoint) {
      case "mobile":
        return "bg-green-100 text-green-800 border-green-200";
      case "tablet":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-purple-100 text-purple-800 border-purple-200";
    }
  };

  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = layoutTests.length;
  const scorePercentage = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-50 bg-white shadow-lg hidden sm:flex"
      >
        <Settings className="h-4 w-4 mr-2" />
        Layout Check
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Mobile Layout Checker
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className={`capitalize ${getBreakpointColor()}`}
            >
              {getBreakpointIcon()}
              <span className="ml-2">{currentBreakpoint}</span>
              <span className="ml-1 text-xs">({window.innerWidth}px)</span>
            </Badge>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Score:</span>
              <Badge
                variant={
                  scorePercentage >= 80
                    ? "default"
                    : scorePercentage >= 60
                      ? "secondary"
                      : "destructive"
                }
              >
                {passedTests}/{totalTests} ({scorePercentage.toFixed(0)}%)
              </Badge>
            </div>

            <Button onClick={runTests} size="sm" variant="outline">
              Re-test
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[60vh]">
          <Accordion type="single" collapsible className="w-full">
            {layoutTests.map((test) => {
              const passed = testResults[test.id];
              return (
                <AccordionItem key={test.id} value={test.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 w-full">
                      {passed ? (
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      )}
                      <div className="flex-1 text-left">
                        <div className="font-medium">{test.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {test.description}
                        </div>
                      </div>
                      <Badge
                        variant={passed ? "default" : "destructive"}
                        className="flex-shrink-0"
                      >
                        {passed ? "Pass" : "Fail"}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 space-y-2">
                      <div className="text-sm">
                        <strong>Status:</strong>{" "}
                        <span
                          className={passed ? "text-green-600" : "text-red-600"}
                        >
                          {passed ? "✓ Passed" : "✗ Failed"}
                        </span>
                      </div>
                      {!passed && test.fix && (
                        <div className="text-sm">
                          <strong>Suggested Fix:</strong>{" "}
                          <span className="text-muted-foreground">
                            {test.fix}
                          </span>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Quick Mobile Tips:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Test on actual devices, not just browser dev tools</li>
              <li>• Ensure content is accessible without horizontal scroll</li>
              <li>
                • Use relative units (rem, %, vw/vh) instead of fixed pixels
              </li>
              <li>• Test form inputs and modals thoroughly on mobile</li>
              <li>• Consider thumb-friendly navigation placement</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileLayoutChecker;
