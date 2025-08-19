import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EloityLogo from '@/components/ui/logo';

const ColorLayoutTest = () => {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <EloityLogo size="md" variant="icon" />
            Color & Layout Test
          </CardTitle>
          <CardDescription>
            Testing Eloity brand colors and font sizes for proper contrast and layout
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Tests */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Logo Variants</h3>
            <div className="flex items-center gap-6 flex-wrap">
              <EloityLogo variant="full" size="md" />
              <EloityLogo variant="icon" size="lg" />
              <EloityLogo variant="text" />
            </div>
          </div>

          {/* Color Tests */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Color Contrast Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border rounded-lg">
                <p className="text-eloity-primary font-semibold">Eloity Primary on White</p>
                <p className="text-eloity-600">Eloity 600 on White</p>
                <p className="text-eloity-700">Eloity 700 on White</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-eloity-primary font-semibold">Eloity Primary on Gray</p>
                <p className="text-eloity-600">Eloity 600 on Gray</p>
                <p className="text-eloity-700">Eloity 700 on Gray</p>
              </div>
            </div>
          </div>

          {/* Font Size Tests */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Font Size Tests</h3>
            <div className="space-y-2">
              <p className="text-xs">Extra Small Text (12px)</p>
              <p className="text-sm">Small Text (14px)</p>
              <p className="text-base">Base Text (16px) - Default body text</p>
              <p className="text-lg">Large Text (18px)</p>
              <p className="text-xl">Extra Large Text (20px)</p>
              <p className="text-2xl">2XL Text (24px)</p>
            </div>
          </div>

          {/* Button Tests */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Button Tests</h3>
            <div className="flex gap-4 flex-wrap">
              <Button variant="default">Default Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button className="bg-eloity-primary hover:bg-eloity-600 text-white">
                Eloity Primary
              </Button>
              <Button variant="outline" className="border-eloity-primary text-eloity-primary hover:bg-eloity-primary hover:text-white">
                Eloity Outline
              </Button>
            </div>
          </div>

          {/* Gradient Tests */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Gradient Tests</h3>
            <div className="space-y-3">
              <div className="p-4 eloity-gradient text-white rounded-lg">
                <p className="font-semibold">Eloity Gradient Background</p>
                <p>This should be readable on the gradient background</p>
              </div>
              <p className="text-2xl font-bold eloity-text-gradient">
                Eloity Text Gradient Effect
              </p>
            </div>
          </div>

          {/* Layout Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Layout Test</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Normal Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This card should have proper spacing and text sizes.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Another Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Testing consistent layout and typography.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Third Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    All cards should look consistent.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorLayoutTest;
