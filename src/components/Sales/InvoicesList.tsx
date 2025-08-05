import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Receipt, Clock, Upload, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface InvoicesListProps {
  invoices: any[];
}

export function InvoicesList({ invoices }: InvoicesListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Waiting":
        return <Badge variant="secondary" className="bg-status-pending text-white"><Clock className="w-3 h-3 mr-1" />Waiting</Badge>;
      case "Uploaded":
        return <Badge variant="secondary" className="bg-status-uploaded text-white"><Upload className="w-3 h-3 mr-1" />Uploaded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge variant="secondary" className="bg-status-paid text-white"><DollarSign className="w-3 h-3 mr-1" />Paid</Badge>;
      case "Partially Paid":
        return <Badge variant="secondary" className="bg-status-partial text-white"><DollarSign className="w-3 h-3 mr-1" />Partial</Badge>;
      case "Unpaid":
        return <Badge variant="secondary" className="bg-status-unpaid text-white"><DollarSign className="w-3 h-3 mr-1" />Unpaid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleDownload = (pdfLink: string, id: string) => {
    if (pdfLink) {
      toast.success(`Downloading invoice ${id}`);
    } else {
      toast.error("Invoice PDF not yet uploaded by Finance");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Receipt className="h-5 w-5" />
          <span>My Invoice Requests</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No invoice requests submitted yet</p>
            <p className="text-sm">Submit your first invoice request to get started</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Product/Service</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>{invoice.productService}</TableCell>
                  <TableCell>${parseFloat(invoice.totalAmount).toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>{getPaymentBadge(invoice.paymentStatus)}</TableCell>
                  <TableCell>{new Date(invoice.submittedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownload(invoice.invoicePdfLink, invoice.id)}
                      disabled={!invoice.invoicePdfLink}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}