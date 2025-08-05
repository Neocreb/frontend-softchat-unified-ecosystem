# Dialog Accessibility Fix Guide

This guide explains how to fix the DialogTitle accessibility error that occurs when using Radix UI Dialog components.

## The Error

```
DialogContent requires a DialogTitle for the component to be accessible for screen reader users.
If you want to hide the DialogTitle, you can wrap it with our VisuallyHidden component.
```

## Quick Fixes

### 1. Add a Visible DialogTitle

If you want the title to be visible:

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Your Dialog Title</DialogTitle>
    </DialogHeader>
    {/* Your content */}
  </DialogContent>
</Dialog>
```

### 2. Add a Hidden DialogTitle

If you want the title to be hidden but accessible to screen readers:

```tsx
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <VisuallyHidden>
      <DialogTitle>Hidden Dialog Title</DialogTitle>
    </VisuallyHidden>
    {/* Your content */}
  </DialogContent>
</Dialog>
```

### 3. Use the Quick Fix Component

For a rapid fix, use our DialogTitleFix component:

```tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitleFix } from "@/components/ui/dialog-title-fix";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogTitleFix title="Your Dialog Title" />
    {/* Your content */}
  </DialogContent>
</Dialog>
```

### 4. Use the Accessible Dialog Wrapper

For new dialogs, use the pre-built accessible wrapper:

```tsx
import { AccessibleDialogWrapper } from "@/components/ui/dialog-accessibility-wrapper";

<AccessibleDialogWrapper
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Your Dialog Title"
  hideTitle={false} // Set to true to hide visually
>
  {/* Your content */}
</AccessibleDialogWrapper>
```

## Common Issues and Solutions

### Issue: Modal without any title
**Solution**: Add a descriptive DialogTitle that explains the modal's purpose.

### Issue: Video player or media modal
**Solution**: Use VisuallyHidden with a descriptive title like "Video Player" or "Media Viewer".

### Issue: Simple confirmation dialog
**Solution**: Use a title like "Confirm Action" or describe what's being confirmed.

### Issue: Complex form modal
**Solution**: Use the form's purpose as the title, e.g., "Create New Job", "Edit Profile".

## Development Warning

The DialogContent component now includes a development warning that will log to console when a DialogTitle is missing. This helps identify problematic components during development.

## Files That Provide Accessibility Fixes

- `src/components/ui/dialog-title-fix.tsx` - Quick fix component
- `src/components/ui/dialog-accessibility-wrapper.tsx` - Complete wrapper
- `src/components/ui/accessible-dialog.tsx` - Alternative wrapper
- `src/utils/dialog-accessibility-fix.tsx` - Utility functions

## Example Fixes for Common Patterns

### Video/Media Modals
```tsx
<DialogContent className="max-w-4xl bg-black p-0">
  <VisuallyHidden>
    <DialogTitle>Video Player</DialogTitle>
  </VisuallyHidden>
  <VideoComponent />
</DialogContent>
```

### Confirmation Dialogs
```tsx
<DialogContent>
  <DialogHeader>
    <DialogTitle>Confirm Deletion</DialogTitle>
  </DialogHeader>
  <p>Are you sure you want to delete this item?</p>
</DialogContent>
```

### Form Modals
```tsx
<DialogContent>
  <DialogHeader>
    <DialogTitle>Create New Project</DialogTitle>
  </DialogHeader>
  <CreateProjectForm />
</DialogContent>
```

Remember: Every DialogContent MUST have a DialogTitle for proper accessibility!
