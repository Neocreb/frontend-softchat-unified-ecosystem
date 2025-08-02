import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  Users, 
  Tag, 
  Save, 
  Download,
  MoreVertical,
  SlidersHorizontal,
  Clock,
  Star,
  Eye,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DateRange } from 'react-day-picker';

export interface SearchFilter {
  id: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'boolean';
  label: string;
  key: string;
  value: any;
  options?: { label: string; value: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  description?: string;
  filters: SearchFilter[];
  createdAt: string;
  isPublic: boolean;
  createdBy: string;
  usageCount: number;
}

interface AdvancedSearchPanelProps {
  filters: SearchFilter[];
  onFiltersChange: (filters: SearchFilter[]) => void;
  onSearch: () => void;
  onClear: () => void;
  savedSearches?: SavedSearch[];
  onSaveSearch?: (name: string, description?: string) => void;
  onLoadSearch?: (searchId: string) => void;
  isLoading?: boolean;
  resultCount?: number;
}

export const AdvancedSearchPanel: React.FC<AdvancedSearchPanelProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  onClear,
  savedSearches = [],
  onSaveSearch,
  onLoadSearch,
  isLoading = false,
  resultCount
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  const updateFilter = (filterId: string, value: any) => {
    const updatedFilters = filters.map(filter => 
      filter.id === filterId ? { ...filter, value } : filter
    );
    onFiltersChange(updatedFilters);
  };
  
  const removeFilter = (filterId: string) => {
    const updatedFilters = filters.filter(filter => filter.id !== filterId);
    onFiltersChange(updatedFilters);
  };
  
  const addFilter = (filterTemplate: Omit<SearchFilter, 'id' | 'value'>) => {
    const newFilter: SearchFilter = {
      ...filterTemplate,
      id: `filter_${Date.now()}`,
      value: filterTemplate.type === 'multiselect' ? [] : 
             filterTemplate.type === 'boolean' ? false :
             filterTemplate.type === 'daterange' ? { from: undefined, to: undefined } : ''
    };
    onFiltersChange([...filters, newFilter]);
  };
  
  const activeFiltersCount = filters.filter(f => {
    if (f.type === 'text') return f.value && f.value.trim() !== '';
    if (f.type === 'multiselect') return f.value && f.value.length > 0;
    if (f.type === 'daterange') return f.value && (f.value.from || f.value.to);
    return f.value !== '' && f.value !== null && f.value !== undefined;
  }).length;
  
  const availableFilterTemplates = [
    { type: 'text' as const, label: 'Email', key: 'email', placeholder: 'Enter email address' },
    { type: 'text' as const, label: 'Name', key: 'name', placeholder: 'Enter name' },
    { type: 'select' as const, label: 'Status', key: 'status', options: [
      { label: 'Active', value: 'active' },
      { label: 'Suspended', value: 'suspended' },
      { label: 'Pending', value: 'pending' }
    ]},
    { type: 'multiselect' as const, label: 'Roles', key: 'roles', options: [
      { label: 'User', value: 'user' },
      { label: 'Premium', value: 'premium' },
      { label: 'Seller', value: 'seller' },
      { label: 'Freelancer', value: 'freelancer' }
    ]},
    { type: 'daterange' as const, label: 'Registration Date', key: 'registrationDate' },
    { type: 'daterange' as const, label: 'Last Activity', key: 'lastActivity' },
    { type: 'number' as const, label: 'Min Age', key: 'minAge', min: 0, max: 120 },
    { type: 'boolean' as const, label: 'Email Verified', key: 'emailVerified' },
    { type: 'boolean' as const, label: 'KYC Verified', key: 'kycVerified' }
  ];
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <CardTitle className="text-lg">Advanced Search</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} filters</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {resultCount !== undefined && (
              <span className="text-sm text-muted-foreground">
                {resultCount} results
              </span>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {isExpanded ? 'Simple' : 'Advanced'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Search */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Quick search..."
              value={filters.find(f => f.key === 'quickSearch')?.value || ''}
              onChange={(e) => {
                const quickSearchFilter = filters.find(f => f.key === 'quickSearch');
                if (quickSearchFilter) {
                  updateFilter(quickSearchFilter.id, e.target.value);
                } else {
                  addFilter({
                    type: 'text',
                    label: 'Quick Search',
                    key: 'quickSearch',
                    placeholder: 'Quick search...'
                  });
                }
              }}
              className="h-9"
            />
          </div>
          
          <Button onClick={onSearch} disabled={isLoading} className="h-9">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={onClear} className="h-9">
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
        
        {/* Advanced Filters */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-4">
            {/* Active Filters */}
            {filters.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Active Filters</h4>
                  <AddFilterDropdown 
                    availableFilters={availableFilterTemplates}
                    onAddFilter={addFilter}
                  />
                </div>
                
                <div className="space-y-2">
                  {filters.map((filter) => (
                    <FilterEditor
                      key={filter.id}
                      filter={filter}
                      onChange={(value) => updateFilter(filter.id, value)}
                      onRemove={() => removeFilter(filter.id)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Saved Searches */}
            {savedSearches.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Saved Searches</h4>
                  {onSaveSearch && (
                    <SaveSearchDialog
                      onSave={(name, description) => {
                        onSaveSearch(name, description);
                        setShowSaveDialog(false);
                      }}
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {savedSearches.slice(0, 6).map((search) => (
                    <div
                      key={search.id}
                      className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => onLoadSearch?.(search.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-medium text-sm truncate">{search.name}</h5>
                        <div className="flex items-center gap-1">
                          {search.isPublic && <Eye className="h-3 w-3 text-muted-foreground" />}
                          <span className="text-xs text-muted-foreground">{search.usageCount}</span>
                        </div>
                      </div>
                      {search.description && (
                        <p className="text-xs text-muted-foreground truncate">{search.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {search.filters.length} filters
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(search.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Search Actions */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
              
              {onSaveSearch && (
                <SaveSearchDialog
                  onSave={(name, description) => onSaveSearch(name, description)}
                />
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

// Filter Editor Component
const FilterEditor: React.FC<{
  filter: SearchFilter;
  onChange: (value: any) => void;
  onRemove: () => void;
}> = ({ filter, onChange, onRemove }) => {
  const renderFilterInput = () => {
    switch (filter.type) {
      case 'text':
        return (
          <Input
            placeholder={filter.placeholder}
            value={filter.value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="h-8"
          />
        );
        
      case 'select':
        return (
          <Select value={filter.value || ''} onValueChange={onChange}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        
      case 'multiselect':
        return (
          <MultiSelectFilter
            options={filter.options || []}
            value={filter.value || []}
            onChange={onChange}
            placeholder={`Select ${filter.label.toLowerCase()}`}
          />
        );
        
      case 'daterange':
        return (
          <DatePickerWithRange
            date={filter.value}
            onDateChange={onChange}
          />
        );
        
      case 'number':
        return (
          <Input
            type="number"
            min={filter.min}
            max={filter.max}
            placeholder={filter.placeholder}
            value={filter.value || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
            className="h-8"
          />
        );
        
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={filter.value || false}
              onCheckedChange={onChange}
            />
            <Label className="text-sm">Yes</Label>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="flex items-center gap-2 p-3 border rounded-lg">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
        <Label className="text-sm font-medium">{filter.label}</Label>
        <div className="md:col-span-2">
          {renderFilterInput()}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Multi-Select Filter Component
const MultiSelectFilter: React.FC<{
  options: { label: string; value: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}> = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-8 justify-between">
          <span className="truncate">
            {value.length === 0 ? placeholder : `${value.length} selected`}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <ScrollArea className="max-h-48">
          <div className="p-2 space-y-1">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={value.includes(option.value)}
                  onCheckedChange={() => handleToggle(option.value)}
                />
                <Label className="text-sm flex-1">{option.label}</Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

// Add Filter Dropdown
const AddFilterDropdown: React.FC<{
  availableFilters: Omit<SearchFilter, 'id' | 'value'>[];
  onAddFilter: (filter: Omit<SearchFilter, 'id' | 'value'>) => void;
}> = ({ availableFilters, onAddFilter }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Add Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0">
        <div className="p-2">
          <h4 className="font-medium text-sm mb-2">Add Filter</h4>
          <div className="space-y-1">
            {availableFilters.map((filter, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => onAddFilter(filter)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Save Search Dialog
const SaveSearchDialog: React.FC<{
  onSave: (name: string, description?: string) => void;
}> = ({ onSave }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), description.trim() || undefined);
      setOpen(false);
      setName('');
      setDescription('');
    }
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Save className="h-4 w-4 mr-2" />
          Save Search
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Save Search</h4>
          
          <div className="space-y-2">
            <Label htmlFor="searchName">Name</Label>
            <Input
              id="searchName"
              placeholder="Enter search name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="searchDescription">Description (optional)</Label>
            <Input
              id="searchDescription"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
