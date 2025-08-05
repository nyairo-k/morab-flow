import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Send } from "lucide-react";
import { toast } from "sonner";

interface QuotationFormProps {
  onSubmit: (quotation: any) => void;
}

export function QuotationForm({ onSubmit }: QuotationFormProps) {
  const [formData, setFormData] = useState({
    clientName: "",
    productName: "",
    description: "",
    quantity: "",
    unitPrice: "",
    totalAmount: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate total when quantity or unit price changes
      if (field === "quantity" || field === "unitPrice") {
        const qty = parseFloat(updated.quantity) || 0;
        const price = parseFloat(updated.unitPrice) || 0;
        updated.totalAmount = (qty * price).toFixed(2);
      }
      
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const quotation = {
      id: `QT-${Date.now()}`,
      ...formData,
      status: "Pending",
      submittedBy: "Current User",
      submittedDate: new Date().toISOString(),
      pdfLink: `#quote-${Date.now()}.pdf`
    };
    
    onSubmit(quotation);
    toast.success("Quotation created successfully!");
    
    // Reset form
    setFormData({
      clientName: "",
      productName: "",
      description: "",
      quantity: "",
      unitPrice: "",
      totalAmount: ""
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Create New Quotation</span>
        </CardTitle>
        <CardDescription>
          Generate a professional quotation for your client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
                placeholder="Enter client company name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productName">Product/Service *</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => handleInputChange("productName", e.target.value)}
                placeholder="Medical equipment or service"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Detailed description of the product or service"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="0"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price ($) *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => handleInputChange("unitPrice", e.target.value)}
                placeholder="0.00"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount ($)</Label>
              <Input
                id="totalAmount"
                value={formData.totalAmount}
                readOnly
                className="bg-muted"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit" className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Generate Quotation</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}