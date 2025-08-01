import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useWalletContext } from "@/contexts/WalletContext";
import { useToast } from "@/components/ui/use-toast";
import { Transaction } from "@/types/wallet";
import TransactionItem from "./TransactionItem";
import { virtualScrolling } from "@/utils/virtualScrolling";
import {
  Search,
  Filter,
  Download,
  Calendar as CalendarIcon,
  SortAsc,
  SortDesc,
  FileText,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  X,
  Tag,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { format, parseISO, isWithinInterval } from "date-fns";

interface FilterState {
  search: string;
  sources: string[];
  types: string[];
  status: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  amountRange: {
    min: string;
    max: string;
  };
  tags: string[];
}

interface SortState {
  field: keyof Transaction;
  direction: "asc" | "desc";
}

const AdvancedTransactionManager = () => {
  const { transactions } = useWalletContext();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    sources: [],
    types: [],
    status: [],
    dateRange: { from: null, to: null },
    amountRange: { min: "", max: "" },
    tags: [],
  });
  
  const [sort, setSort] = useState<SortState>({
    field: "timestamp",
    direction: "desc",
  });
  
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchLower) ||
        t.id.toLowerCase().includes(searchLower) ||
        t.source.toLowerCase().includes(searchLower)
      );
    }

    // Source filter
    if (filters.sources.length > 0) {
      filtered = filtered.filter(t => filters.sources.includes(t.source));
    }

    // Type filter
    if (filters.types.length > 0) {
      filtered = filtered.filter(t => filters.types.includes(t.type));
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(t => filters.status.includes(t.status));
    }

    // Date range filter
    if (filters.dateRange.from && filters.dateRange.to) {
      filtered = filtered.filter(t => {
        const transactionDate = parseISO(t.timestamp);
        return isWithinInterval(transactionDate, {
          start: filters.dateRange.from!,
          end: filters.dateRange.to!,
        });
      });
    }

    // Amount range filter
    if (filters.amountRange.min || filters.amountRange.max) {
      const min = filters.amountRange.min ? parseFloat(filters.amountRange.min) : -Infinity;
      const max = filters.amountRange.max ? parseFloat(filters.amountRange.max) : Infinity;
      filtered = filtered.filter(t => Math.abs(t.amount) >= min && Math.abs(t.amount) <= max);
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      
      if (sort.field === "timestamp") {
        const aDate = new Date(aValue as string);
        const bDate = new Date(bValue as string);
        return sort.direction === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
      }
      
      if (sort.field === "amount") {
        return sort.direction === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      }
      
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      return sort.direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });

    return filtered;
  }, [transactions, filters, sort]);

  // Handle filter changes
  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayFilter = useCallback((key: 'sources' | 'types' | 'status' | 'tags', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      sources: [],
      types: [],
      status: [],
      dateRange: { from: null, to: null },
      amountRange: { min: "", max: "" },
      tags: [],
    });
  }, []);

  // Handle sorting
  const handleSort = useCallback((field: keyof Transaction) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Handle transaction selection
  const toggleTransactionSelection = useCallback((transactionId: string) => {
    setSelectedTransactions(prev =>
      prev.includes(transactionId)
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  }, []);

  const selectAllTransactions = useCallback(() => {
    setSelectedTransactions(
      selectedTransactions.length === filteredTransactions.length
        ? []
        : filteredTransactions.map(t => t.id)
    );
  }, [selectedTransactions.length, filteredTransactions]);

  // Export functions
  const exportToCSV = useCallback(() => {
    const selectedData = selectedTransactions.length > 0 
      ? filteredTransactions.filter(t => selectedTransactions.includes(t.id))
      : filteredTransactions;

    const csvContent = [
      ["ID", "Date", "Type", "Source", "Amount", "Description", "Status"].join(","),
      ...selectedData.map(t => [
        t.id,
        format(parseISO(t.timestamp), "yyyy-MM-dd HH:mm:ss"),
        t.type,
        t.source,
        t.amount.toString(),
        `"${t.description.replace(/"/g, '""')}"`,
        t.status,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${selectedData.length} transactions to CSV`,
    });
  }, [filteredTransactions, selectedTransactions, toast]);

  const exportToPDF = useCallback(() => {
    // This would integrate with a PDF library like jsPDF
    toast({
      title: "PDF Export",
      description: "PDF export functionality would be implemented here",
    });
  }, [toast]);

  const printTransactions = useCallback(() => {
    const selectedData = selectedTransactions.length > 0 
      ? filteredTransactions.filter(t => selectedTransactions.includes(t.id))
      : filteredTransactions;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Transaction Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              .header { margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Transaction Report</h1>
              <p>Generated on: ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}</p>
              <p>Total Transactions: ${selectedData.length}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Source</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${selectedData.map(t => `
                  <tr>
                    <td>${format(parseISO(t.timestamp), "yyyy-MM-dd HH:mm")}</td>
                    <td>${t.type}</td>
                    <td>${t.source}</td>
                    <td>$${t.amount.toFixed(2)}</td>
                    <td>${t.description}</td>
                    <td>${t.status}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }, [filteredTransactions, selectedTransactions]);

  // Get unique values for filter options
  const uniqueSources = [...new Set(transactions.map(t => t.source))];
  const uniqueTypes = [...new Set(transactions.map(t => t.type))];
  const uniqueStatuses = [...new Set(transactions.map(t => t.status))];

  const activeFiltersCount = [
    filters.search,
    ...filters.sources,
    ...filters.types,
    ...filters.status,
    filters.dateRange.from,
    filters.dateRange.to,
    filters.amountRange.min,
    filters.amountRange.max,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header with Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Transactions</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  {selectedTransactions.length > 0 
                    ? `Exporting ${selectedTransactions.length} selected transactions`
                    : `Exporting all ${filteredTransactions.length} filtered transactions`
                  }
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <Button onClick={exportToCSV} className="justify-start">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export as CSV
                  </Button>
                  <Button onClick={exportToPDF} variant="outline" className="justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button onClick={printTransactions} variant="outline" className="justify-start">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Advanced Filters</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Source Filter */}
              <div className="space-y-2">
                <Label>Sources</Label>
                <div className="space-y-2">
                  {uniqueSources.map(source => (
                    <div key={source} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.sources.includes(source)}
                        onCheckedChange={() => toggleArrayFilter("sources", source)}
                      />
                      <Label className="capitalize">{source}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <Label>Transaction Types</Label>
                <div className="space-y-2">
                  {uniqueTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.types.includes(type)}
                        onCheckedChange={() => toggleArrayFilter("types", type)}
                      />
                      <Label className="capitalize">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="space-y-2">
                  {uniqueStatuses.map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.status.includes(status)}
                        onCheckedChange={() => toggleArrayFilter("status", status)}
                      />
                      <Label className="capitalize flex items-center gap-2">
                        {status === "completed" && <CheckCircle className="h-3 w-3 text-green-500" />}
                        {status === "pending" && <Clock className="h-3 w-3 text-yellow-500" />}
                        {status === "failed" && <XCircle className="h-3 w-3 text-red-500" />}
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Range Filter */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.from ? format(filters.dateRange.from, "MMM dd, yyyy") : "From"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from || undefined}
                        onSelect={(date) => updateFilter("dateRange", { ...filters.dateRange, from: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.to ? format(filters.dateRange.to, "MMM dd, yyyy") : "To"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to || undefined}
                        onSelect={(date) => updateFilter("dateRange", { ...filters.dateRange, to: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Amount Range Filter */}
              <div className="space-y-2">
                <Label>Amount Range</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min amount"
                    value={filters.amountRange.min}
                    onChange={(e) => updateFilter("amountRange", { ...filters.amountRange, min: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Max amount"
                    value={filters.amountRange.max}
                    onChange={(e) => updateFilter("amountRange", { ...filters.amountRange, max: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary and Bulk Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0}
                  onCheckedChange={selectAllTransactions}
                />
                <Label>
                  {selectedTransactions.length > 0 
                    ? `${selectedTransactions.length} selected`
                    : `${filteredTransactions.length} transactions`
                  }
                </Label>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600">Sort by:</Label>
              <Select
                value={`${sort.field}-${sort.direction}`}
                onValueChange={(value) => {
                  const [field, direction] = value.split("-") as [keyof Transaction, "asc" | "desc"];
                  setSort({ field, direction });
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timestamp-desc">Date (Newest)</SelectItem>
                  <SelectItem value="timestamp-asc">Date (Oldest)</SelectItem>
                  <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                  <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                  <SelectItem value="description-asc">Description (A-Z)</SelectItem>
                  <SelectItem value="description-desc">Description (Z-A)</SelectItem>
                  <SelectItem value="source-asc">Source (A-Z)</SelectItem>
                  <SelectItem value="status-asc">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTransactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-3 p-4">
                  <Checkbox
                    checked={selectedTransactions.includes(transaction.id)}
                    onCheckedChange={() => toggleTransactionSelection(transaction.id)}
                  />
                  <div className="flex-1">
                    <TransactionItem transaction={transaction} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm mt-1">
                Try adjusting your filters or search terms
              </p>
              {activeFiltersCount > 0 && (
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedTransactionManager;
