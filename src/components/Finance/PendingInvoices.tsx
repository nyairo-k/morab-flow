import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Receipt, Clock, FileUp } from "lucide-react";
import { toast } from "sonner";

interface PendingInvoicesProps {
  invoices: any[];
  onUploadInvoice: (id: string, file: File) => void;
}

export function PendingInvoices({ invoices, onUploadInvoice }: PendingInvoicesProps) {
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const handleFileUpload = (invoiceId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadingId(invoiceId);
      // Simulate upload process
      setTimeout(() => {
        onUploadInvoice(invoiceId, file);
        setUploadingId(null);
        toast.success(`Invoice PDF uploaded for ${invoiceId}`);
      }, 1500);
    } else {
      toast.error("Please select a PDF file");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Waiting":
        return <Badge variant="secondary" className="bg-status-pending text-white"><Clock className="w-3 h-3 mr-1" />Waiting</Badge>;
      case "Uploaded":
        return <Badge variant="secondary" className="bg-status-uploaded text-white"><FileUp className="w-3 h-3 mr-1" />Uploaded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingInvoices = invoices.filter(inv => inv.status === "Waiting");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Receipt className="h-5 w-5" />
          <span>Pending Invoice Requests</span>
          <Badge variant="secondary" className="ml-2">{pendingInvoices.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingInvoices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No pending invoice requests</p>
            <p className="text-sm">All invoices have been processed</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Product/Service</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Upload PDF</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>{invoice.productService}</TableCell>
                  <TableCell>${parseFloat(invoice.totalAmount).toLocaleString()}</TableCell>
                  <TableCell>{invoice.submittedBy}</TableCell>
                  <TableCell>{new Date(invoice.submittedDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`file-${invoice.id}`} className="cursor-pointer">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={uploadingId === invoice.id}
                          asChild
                        >
                          <span>
                            {uploadingId === invoice.id ? (
                              <>
                                <Upload className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload PDF
                              </>
                            )}
                          </span>
                        </Button>
                      </Label>
                      <Input
                        id={`file-${invoice.id}`}
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => handleFileUpload(invoice.id, e)}
                      />
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