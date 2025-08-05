import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, CheckCircle, Clock, FileText } from "lucide-react";
import { toast } from "sonner";

interface QuotationsListProps {
  quotations: any[];
  onApprove: (id: string) => void;
}

export function QuotationsList({ quotations, onApprove }: QuotationsListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="secondary" className="bg-status-pending text-white"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "Approved":
        return <Badge variant="secondary" className="bg-status-approved text-white"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "Converted":
        return <Badge variant="secondary" className="bg-status-uploaded text-white"><FileText className="w-3 h-3 mr-1" />Converted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleDownload = (pdfLink: string, id: string) => {
    toast.success(`Downloading quotation ${id}`);
    // Simulate PDF download
  };

  const handleApprove = (id: string) => {
    onApprove(id);
    toast.success("Quotation approved and sent to Finance!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>My Quotations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {quotations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No quotations created yet</p>
            <p className="text-sm">Create your first quotation to get started</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.id}</TableCell>
                  <TableCell>{quote.clientName}</TableCell>
                  <TableCell>{quote.productName}</TableCell>
                  <TableCell>${parseFloat(quote.totalAmount).toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(quote.status)}</TableCell>
                  <TableCell>{new Date(quote.submittedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownload(quote.pdfLink, quote.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {quote.status === "Pending" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(quote.id)}
                          className="bg-status-approved hover:bg-status-approved/90"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                    </div>
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