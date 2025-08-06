import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { themeComponents, themeClasses, cn } from '@/utils/themeUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import ThemeValidator from './ThemeValidator';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  User,
  Settings,
  Home,
  Search,
  Bell,
  Plus,
  TrendingUp,
  Zap,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info
} from 'lucide-react';

export function ThemeTestPage() {
  const { theme, isDark } = useTheme();

  return (
    <div className={cn(themeClasses.background, "min-h-screen p-8 space-y-8")}>
      <div className={themeComponents.header()}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Theme Test Page</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Current theme: {theme} ({isDark ? 'Dark' : 'Light'})
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-8">
        {/* Color Palette Test */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={cn(themeClasses.surface, "p-4 rounded-lg border", themeClasses.border)}>
                <div className="text-sm font-medium">Surface</div>
                <div className="text-xs text-muted-foreground">Card/Modal backgrounds</div>
              </div>
              <div className={cn(themeClasses.surfaceVariant, "p-4 rounded-lg border", themeClasses.border)}>
                <div className="text-sm font-medium">Surface Variant</div>
                <div className="text-xs text-muted-foreground">Table headers, sidebars</div>
              </div>
              <div className={cn("bg-primary text-primary-foreground p-4 rounded-lg")}>
                <div className="text-sm font-medium">Primary</div>
                <div className="text-xs opacity-90">Main action color</div>
              </div>
              <div className={cn("bg-secondary text-secondary-foreground p-4 rounded-lg")}>
                <div className="text-sm font-medium">Secondary</div>
                <div className="text-xs opacity-90">Secondary actions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Button Variants Test */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="destructive">Destructive Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="link">Link Button</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small Button</Button>
              <Button size="default">Default Button</Button>
              <Button size="lg">Large Button</Button>
            </div>
          </CardContent>
        </Card>

        {/* Social Interaction Test */}
        <Card>
          <CardHeader>
            <CardTitle>Social Interactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className={themeClasses.socialLike}>
                <Heart className="w-4 h-4 mr-2" />
                Like (1.2k)
              </Button>
              <Button variant="ghost" size="sm" className={themeClasses.socialComment}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Comment (45)
              </Button>
              <Button variant="ghost" size="sm" className={themeClasses.socialShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share (12)
              </Button>
              <Button variant="ghost" size="sm" className={themeClasses.socialBookmark}>
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements Test */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="test-input">Text Input</Label>
                  <Input id="test-input" placeholder="Enter some text..." />
                </div>
                <div>
                  <Label htmlFor="test-textarea">Textarea</Label>
                  <Textarea id="test-textarea" placeholder="Enter a longer message..." rows={3} />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="test-switch" />
                  <Label htmlFor="test-switch">Toggle Switch</Label>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Badges</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                  </div>
                </div>
                <div>
                  <Label>Status Indicators</Label>
                  <div className="space-y-2 mt-2">
                    <div className={cn("flex items-center space-x-2 p-2 rounded-md", themeClasses.statusSuccess)}>
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Success message</span>
                    </div>
                    <div className={cn("flex items-center space-x-2 p-2 rounded-md", themeClasses.statusWarning)}>
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Warning message</span>
                    </div>
                    <div className={cn("flex items-center space-x-2 p-2 rounded-md", themeClasses.statusError)}>
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm">Error message</span>
                    </div>
                    <div className={cn("flex items-center space-x-2 p-2 rounded-md", themeClasses.statusInfo)}>
                      <Info className="w-4 h-4" />
                      <span className="text-sm">Info message</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Test */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="home">
              <TabsList>
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="explore">Explore</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>
              <TabsContent value="home" className="mt-4">
                <div className={themeComponents.postCard()}>
                  <div className={themeComponents.postHeader()}>
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">Sample User</div>
                      <div className="text-sm text-muted-foreground">2 hours ago</div>
                    </div>
                  </div>
                  <div className={themeComponents.postContent()}>
                    <p>This is a sample post to test the theme colors and layout. It should be clearly visible in both light and dark modes.</p>
                  </div>
                  <div className={themeComponents.postActions()}>
                    <div className="flex space-x-4">
                      <Button variant="ghost" size="sm" className={themeClasses.socialLike}>
                        <Heart className="w-4 h-4 mr-1" />
                        24
                      </Button>
                      <Button variant="ghost" size="sm" className={themeClasses.socialComment}>
                        <MessageCircle className="w-4 h-4 mr-1" />
                        5
                      </Button>
                      <Button variant="ghost" size="sm" className={themeClasses.socialShare}>
                        <Share2 className="w-4 h-4 mr-1" />
                        2
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className={themeClasses.socialBookmark}>
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="explore" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Trending', 'Popular', 'Recent'].map((item) => (
                    <div key={item} className={cn(themeClasses.card, "p-4")}>
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="font-medium">{item}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Sample content for {item.toLowerCase()} section
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Sidebar Navigation Test */}
        <Card>
          <CardHeader>
            <CardTitle>Sidebar Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64">
              <div className={cn(themeComponents.sidebar(), "w-64 p-4")}>
                <nav className="space-y-2">
                  {[
                    { icon: Home, label: 'Home', active: true },
                    { icon: Search, label: 'Search', active: false },
                    { icon: Bell, label: 'Notifications', active: false },
                    { icon: User, label: 'Profile', active: false },
                    { icon: Settings, label: 'Settings', active: false },
                  ].map(({ icon: Icon, label, active }) => (
                    <div
                      key={label}
                      className={cn(
                        themeComponents.navMenu(),
                        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer",
                        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </div>
                  ))}
                </nav>
              </div>
              <div className="flex-1 p-4 bg-background">
                <h3 className="font-medium mb-2">Main Content Area</h3>
                <p className="text-sm text-muted-foreground">
                  This represents the main content area next to the sidebar.
                  The contrast should be clear between the sidebar and content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Text Variants Test */}
        <Card>
          <CardHeader>
            <CardTitle>Text Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Heading 1 - Large title</h1>
              <h2 className="text-2xl font-semibold">Heading 2 - Section title</h2>
              <h3 className="text-xl font-semibold">Heading 3 - Subsection title</h3>
              <p className={themeClasses.textPrimary}>Primary text - Main content text</p>
              <p className={themeClasses.textSecondary}>Secondary text - Supporting information</p>
              <p className={themeClasses.textMuted}>Muted text - Less important details</p>
              <p className={themeClasses.textSubtle}>Subtle text - Minimal emphasis</p>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Elements Test */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive States</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className={cn("p-3 rounded-md border", themeClasses.border, themeClasses.interactive)}>
                Hover over this element to test hover states
              </div>
              <div className={cn("p-3 rounded-md border focus:outline-none", themeClasses.border, themeClasses.interactive)} tabIndex={0}>
                Tab to this element to test focus states
              </div>
              <div className={cn("p-3 rounded-md border", themeClasses.border, "bg-accent text-accent-foreground")}>
                This element shows the active/selected state
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Validator */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Validation & Testing</CardTitle>
            <CardDescription>
              Comprehensive validation of theme implementation and CSS variables
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeValidator />
          </CardContent>
        </Card>

        {/* Theme Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Implementation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">✅ Implemented Features</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Complete CSS variable system</li>
                    <li>• Theme-aware component utilities</li>
                    <li>• Social interaction colors</li>
                    <li>• Status indicator colors</li>
                    <li>• Consistent focus states</li>
                    <li>• Platform-specific colors</li>
                    <li>• Interactive state feedback</li>
                    <li>• Comprehensive dark mode support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">🎯 Benefits</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Seamless theme switching</li>
                    <li>• Consistent color usage</li>
                    <li>• Better accessibility</li>
                    <li>• Unified design system</li>
                    <li>• Maintainable codebase</li>
                    <li>• Mobile-optimized colors</li>
                    <li>• High contrast support</li>
                    <li>• Future-proof theming</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ThemeTestPage;
