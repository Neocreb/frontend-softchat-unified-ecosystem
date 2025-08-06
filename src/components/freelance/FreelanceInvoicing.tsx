import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Plus,
  Download,
  Send,
  Eye,
  Copy,
  Edit3,
  MoreVertical,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Building,
  Mail,
  Trash2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAvatar?: string;
  projectTitle: string;
  issueDate: Date;
  dueDate: Date;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  paymentTerms: string;
}

const FreelanceInvoicing: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      clientName: "Alice Johnson",
      clientEmail: "alice@techcorp.com",
      projectTitle: "E-commerce Platform Development",
      issueDate: new Date("2024-01-15"),
      dueDate: new Date("2024-02-14"),
      status: "sent",
      items: [
        {
          id: "1",
          description: "Frontend Development",
          quantity: 40,
          rate: 75,
          amount: 3000
        },
        {
          id: "2", 
          description: "API Integration",
          quantity: 20,
          rate: 85,
          amount: 1700
        }
      ],
      subtotal: 4700,
      tax: 470,
      total: 5170,
      paymentTerms: "Net 30"
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      clientName: "David Rodriguez",
      clientEmail: "david@startup.io",
      projectTitle: "Mobile App Design",
      issueDate: new Date("2024-01-20"),
      dueDate: new Date("2024-02-19"),
      status: "paid",
      items: [
        {
          id: "3",
          description: "UI/UX Design",
          quantity: 60,
          rate: 65,
          amount: 3900
        }
      ],
      subtotal: 3900,
      tax: 390,
      total: 4290,
      paymentTerms: "Net 15"
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      clientName: "Sarah Chen",
      clientEmail: "sarah@agency.com",
      projectTitle: "Website Redesign",
      issueDate: new Date("2024-01-10"),
      dueDate: new Date("2024-01-25"),
      status: "overdue",
      items: [
        {
          id: "4",
          description: "Website Development",
          quantity: 35,
          rate: 80,
          amount: 2800
        }
      ],
      subtotal: 2800,
      tax: 280,
      total: 3080,
      paymentTerms: "Net 15"
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [newInvoice, setNewInvoice] = useState({
    clientName: "",
    clientEmail: "",
    projectTitle: "",
    dueDate: "",
    paymentTerms: "Net 30",
    items: [{ description: "", quantity: 1, rate: 0 }],
    notes: "",
  });

  const { toast } = useToast();

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Sent</Badge>;
      case "paid":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Paid</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Overdue</Badge>;
      case "cancelled":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredInvoices = invoices.filter(invoice => 
    statusFilter === "all" || invoice.status === statusFilter
  );

  const addInvoiceItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, rate: 0 }]
    }));
  };

  const removeInvoiceItem = (index: number) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateInvoiceItem = (index: number, field: string, value: any) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateTotals = () => {
    const subtotal = newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleCreateInvoice = () => {
    if (!newInvoice.clientName || !newInvoice.clientEmail || !newInvoice.projectTitle) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const { subtotal, tax, total } = calculateTotals();
    
    const invoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      clientName: newInvoice.clientName,
      clientEmail: newInvoice.clientEmail,
      projectTitle: newInvoice.projectTitle,
      issueDate: new Date(),
      dueDate: new Date(newInvoice.dueDate),
      status: "draft",
      items: newInvoice.items.map((item, i) => ({
        id: i.toString(),
        ...item,
        amount: item.quantity * item.rate
      })),
      subtotal,
      tax,
      total,
      notes: newInvoice.notes,
      paymentTerms: newInvoice.paymentTerms,
    };

    setInvoices(prev => [...prev, invoice]);
    setShowCreateModal(false);
    setNewInvoice({
      clientName: "",
      clientEmail: "",
      projectTitle: "",
      dueDate: "",
      paymentTerms: "Net 30",
      items: [{ description: "", quantity: 1, rate: 0 }],
      notes: "",
    });

    toast({
      title: "Invoice created",
      description: `Invoice ${invoice.invoiceNumber} has been created successfully`,
    });
  };

  const handleSendInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, status: "sent" as const } : invoice
    ));
    
    toast({
      title: "Invoice sent",
      description: "Invoice has been sent to the client",
    });
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Simulate PDF download
    toast({
      title: "Download started",
      description: `${invoice.invoiceNumber} is being downloaded`,
    });
  };

  const handleDuplicateInvoice = (invoice: Invoice) => {
    const duplicated: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: "draft",
    };

    setInvoices(prev => [...prev, duplicated]);
    toast({
      title: "Invoice duplicated",
      description: `Created ${duplicated.invoiceNumber} based on ${invoice.invoiceNumber}`,
    });
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoicing</h2>
          <p className="text-gray-600 dark:text-gray-400">Create and manage client invoices</p>
        </div>
        
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Client Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client-name">Client Name *</Label>
                  <Input
                    id="client-name"
                    value={newInvoice.clientName}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, clientName: e.target.value }))}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label htmlFor="client-email">Client Email *</Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={newInvoice.clientEmail}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, clientEmail: e.target.value }))}
                    placeholder="client@example.com"
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project-title">Project Title *</Label>
                  <Input
                    id="project-title"
                    value={newInvoice.projectTitle}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, projectTitle: e.target.value }))}
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <Label htmlFor="due-date">Due Date *</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>

              {/* Invoice Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Invoice Items</Label>
                  <Button variant="outline" size="sm" onClick={addInvoiceItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {newInvoice.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-6">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateInvoiceItem(index, "description", e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(index, "quantity", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Rate"
                          value={item.rate}
                          onChange={(e) => updateInvoiceItem(index, "rate", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          ${(item.quantity * item.rate).toFixed(2)}
                        </span>
                        {newInvoice.items.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInvoiceItem(index)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>${totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Additional Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payment-terms">Payment Terms</Label>
                  <Select 
                    value={newInvoice.paymentTerms} 
                    onValueChange={(value) => setNewInvoice(prev => ({ ...prev, paymentTerms: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                      <SelectItem value="Due on receipt">Due on receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={newInvoice.notes}
                  onChange={(e) => setNewInvoice(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or payment instructions"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateInvoice} className="flex-1">
                  Create Invoice
                </Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoices Grid */}
      <div className="space-y-4">
        {filteredInvoices.map((invoice) => (
          <Card key={invoice.id} className="transition-all duration-200 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={invoice.clientAvatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {invoice.clientName[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {invoice.invoiceNumber}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{invoice.projectTitle}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {invoice.clientName} • {invoice.clientEmail}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {getStatusBadge(invoice.status)}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowPreviewModal(true);
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadInvoice(invoice)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </DropdownMenuItem>
                      {invoice.status === "draft" && (
                        <DropdownMenuItem onClick={() => handleSendInvoice(invoice.id)}>
                          <Send className="mr-2 h-4 w-4" />
                          Send Invoice
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleDuplicateInvoice(invoice)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Issue Date</p>
                  <p className="font-medium">{invoice.issueDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Due Date</p>
                  <p className="font-medium">{invoice.dueDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Total</p>
                  <p className="font-bold text-lg text-green-600">${invoice.total.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Payment Terms</p>
                  <p className="font-medium">{invoice.paymentTerms}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No invoices found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {statusFilter !== "all" 
                ? "Try adjusting your filter criteria"
                : "Create your first invoice to get started"
              }
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Invoice Preview Modal */}
      {selectedInvoice && (
        <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Invoice Preview - {selectedInvoice.invoiceNumber}</DialogTitle>
            </DialogHeader>
            
            <div className="bg-white p-8 rounded-lg border">
              {/* Invoice Header */}
              <div className="flex justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                  <p className="text-gray-600">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-semibold text-gray-900">Your Business Name</h2>
                  <p className="text-gray-600">your@email.com</p>
                </div>
              </div>
              
              {/* Client and Invoice Details */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                  <p className="font-medium">{selectedInvoice.clientName}</p>
                  <p className="text-gray-600">{selectedInvoice.clientEmail}</p>
                </div>
                <div className="text-right">
                  <div className="space-y-1">
                    <p><span className="text-gray-600">Issue Date:</span> {selectedInvoice.issueDate.toLocaleDateString()}</p>
                    <p><span className="text-gray-600">Due Date:</span> {selectedInvoice.dueDate.toLocaleDateString()}</p>
                    <p><span className="text-gray-600">Terms:</span> {selectedInvoice.paymentTerms}</p>
                  </div>
                </div>
              </div>
              
              {/* Invoice Items */}
              <div className="border rounded-lg overflow-hidden mb-8">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">Description</th>
                      <th className="text-right p-4 font-medium text-gray-900">Qty</th>
                      <th className="text-right p-4 font-medium text-gray-900">Rate</th>
                      <th className="text-right p-4 font-medium text-gray-900">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="p-4">{item.description}</td>
                        <td className="p-4 text-right">{item.quantity}</td>
                        <td className="p-4 text-right">${item.rate}</td>
                        <td className="p-4 text-right">${item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Invoice Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${selectedInvoice.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${selectedInvoice.tax}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${selectedInvoice.total}</span>
                  </div>
                </div>
              </div>
              
              {selectedInvoice.notes && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Notes:</h4>
                  <p className="text-gray-700">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FreelanceInvoicing;
