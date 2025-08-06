import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn, themeClasses, getCSSVariable } from '@/utils/themeUtils';
import { CheckCircle, XCircle, AlertTriangle, Palette, Sun, Moon, Monitor } from 'lucide-react';

interface ThemeValidationResult {
  category: string;
  tests: {
    name: string;
    passed: boolean;
    description: string;
    cssVar?: string;
    currentValue?: string;
  }[];
}

export function ThemeValidator() {
  const { theme, setTheme, isDark } = useTheme();
  const [validationResults, setValidationResults] = useState<ThemeValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const validateTheme = () => {
    setIsValidating(true);
    
    // Simulate validation delay for better UX
    setTimeout(() => {
      const results: ThemeValidationResult[] = [
        {
          category: 'Core Colors',
          tests: [
            {
              name: 'Background Color',
              passed: !!getCSSVariable('--background'),
              description: 'Main background color is defined',
              cssVar: '--background',
              currentValue: getCSSVariable('--background')
            },
            {
              name: 'Foreground Color',
              passed: !!getCSSVariable('--foreground'),
              description: 'Main text color is defined',
              cssVar: '--foreground',
              currentValue: getCSSVariable('--foreground')
            },
            {
              name: 'Primary Color',
              passed: !!getCSSVariable('--primary'),
              description: 'Primary brand color is defined',
              cssVar: '--primary',
              currentValue: getCSSVariable('--primary')
            },
            {
              name: 'Card Background',
              passed: !!getCSSVariable('--card'),
              description: 'Card background color is defined',
              cssVar: '--card',
              currentValue: getCSSVariable('--card')
            }
          ]
        },
        {
          category: 'Social Colors',
          tests: [
            {
              name: 'Like Color',
              passed: !!getCSSVariable('--social-like'),
              description: 'Like button color is defined',
              cssVar: '--social-like',
              currentValue: getCSSVariable('--social-like')
            },
            {
              name: 'Comment Color',
              passed: !!getCSSVariable('--social-comment'),
              description: 'Comment button color is defined',
              cssVar: '--social-comment',
              currentValue: getCSSVariable('--social-comment')
            },
            {
              name: 'Share Color',
              passed: !!getCSSVariable('--social-share'),
              description: 'Share button color is defined',
              cssVar: '--social-share',
              currentValue: getCSSVariable('--social-share')
            },
            {
              name: 'Bookmark Color',
              passed: !!getCSSVariable('--social-bookmark'),
              description: 'Bookmark button color is defined',
              cssVar: '--social-bookmark',
              currentValue: getCSSVariable('--social-bookmark')
            }
          ]
        },
        {
          category: 'Status Colors',
          tests: [
            {
              name: 'Success Color',
              passed: !!getCSSVariable('--success'),
              description: 'Success status color is defined',
              cssVar: '--success',
              currentValue: getCSSVariable('--success')
            },
            {
              name: 'Warning Color',
              passed: !!getCSSVariable('--warning'),
              description: 'Warning status color is defined',
              cssVar: '--warning',
              currentValue: getCSSVariable('--warning')
            },
            {
              name: 'Error Color',
              passed: !!getCSSVariable('--destructive'),
              description: 'Error status color is defined',
              cssVar: '--destructive',
              currentValue: getCSSVariable('--destructive')
            },
            {
              name: 'Info Color',
              passed: !!getCSSVariable('--info'),
              description: 'Info status color is defined',
              cssVar: '--info',
              currentValue: getCSSVariable('--info')
            }
          ]
        },
        {
          category: 'Platform Colors',
          tests: [
            {
              name: 'Platform Surface',
              passed: !!getCSSVariable('--platform-surface'),
              description: 'Platform surface color is defined',
              cssVar: '--platform-surface',
              currentValue: getCSSVariable('--platform-surface')
            },
            {
              name: 'Platform Outline',
              passed: !!getCSSVariable('--platform-outline'),
              description: 'Platform outline color is defined',
              cssVar: '--platform-outline',
              currentValue: getCSSVariable('--platform-outline')
            },
            {
              name: 'Softchat Primary',
              passed: !!getCSSVariable('--softchat-primary'),
              description: 'Softchat brand primary color is defined',
              cssVar: '--softchat-primary',
              currentValue: getCSSVariable('--softchat-primary')
            },
            {
              name: 'Softchat Accent',
              passed: !!getCSSVariable('--softchat-accent'),
              description: 'Softchat brand accent color is defined',
              cssVar: '--softchat-accent',
              currentValue: getCSSVariable('--softchat-accent')
            }
          ]
        },
        {
          category: 'Theme Functionality',
          tests: [
            {
              name: 'Dark Mode Toggle',
              passed: typeof setTheme === 'function',
              description: 'Theme can be switched programmatically'
            },
            {
              name: 'Theme State',
              passed: ['light', 'dark', 'system'].includes(theme),
              description: 'Current theme state is valid'
            },
            {
              name: 'Dark Mode Detection',
              passed: typeof isDark === 'boolean',
              description: 'Dark mode state is properly detected'
            },
            {
              name: 'CSS Classes',
              passed: document.documentElement.classList.contains(isDark ? 'dark' : 'light'),
              description: 'HTML element has correct theme class'
            }
          ]
        }
      ];

      setValidationResults(results);
      setIsValidating(false);
    }, 1000);
  };

  useEffect(() => {
    validateTheme();
  }, [theme, isDark]);

  const getOverallScore = () => {
    const totalTests = validationResults.reduce((sum, category) => sum + category.tests.length, 0);
    const passedTests = validationResults.reduce(
      (sum, category) => sum + category.tests.filter(test => test.passed).length,
      0
    );
    return totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const overallScore = getOverallScore();

  return (
    <div className="space-y-6">
      {/* Theme Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Theme Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Current Theme:</span>
            <Badge variant="outline">{theme}</Badge>
            <Badge variant={isDark ? "default" : "secondary"}>
              {isDark ? "Dark Mode" : "Light Mode"}
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('light')}
              className="flex items-center space-x-2"
            >
              <Sun className="w-4 h-4" />
              <span>Light</span>
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('dark')}
              className="flex items-center space-x-2"
            >
              <Moon className="w-4 h-4" />
              <span>Dark</span>
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('system')}
              className="flex items-center space-x-2"
            >
              <Monitor className="w-4 h-4" />
              <span>System</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Implementation Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className={cn("text-3xl font-bold", getScoreColor(overallScore))}>
              {overallScore}%
            </div>
            <div className="text-sm text-muted-foreground">
              {overallScore >= 90 && "Excellent theme implementation! 🎉"}
              {overallScore >= 75 && overallScore < 90 && "Good theme support with minor issues 👍"}
              {overallScore < 75 && "Theme implementation needs improvement ⚠️"}
            </div>
          </div>
          <Button
            onClick={validateTheme}
            disabled={isValidating}
            className="mt-4"
            size="sm"
          >
            {isValidating ? "Validating..." : "Re-validate Theme"}
          </Button>
        </CardContent>
      </Card>

      {/* Validation Results */}
      <div className="space-y-4">
        {validationResults.map((category) => (
          <Card key={category.category}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category.category}</span>
                <Badge variant="outline">
                  {category.tests.filter(test => test.passed).length}/{category.tests.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.tests.map((test) => (
                  <div key={test.name} className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {test.passed ? (
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{test.name}</span>
                        {test.cssVar && (
                          <code className="text-xs bg-muted px-1 rounded">
                            {test.cssVar}
                          </code>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{test.description}</p>
                      {test.currentValue && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Current value: <code>{test.currentValue}</code>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This validator checks if CSS custom properties are properly defined and if theme switching works correctly.
              For full validation, test the app in both light and dark modes to ensure all components are visible.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/app/feed" target="_blank">Test Feed Components</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/app/marketplace" target="_blank">Test Marketplace</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/app/freelance" target="_blank">Test Freelance</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/app/crypto" target="_blank">Test Crypto</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ThemeValidator;
