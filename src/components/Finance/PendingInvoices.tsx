import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, FileUp, List } from "lucide-react";

interface PendingInvoicesProps {
  invoices: any[];
  onUploadInvoice: (id: string, file: File) => void;
}

export function PendingInvoices({ invoices, onUploadInvoice }: PendingInvoicesProps) {
  // NEW: This state variable will store the ID of the currently expanded invoice.
  // It's null if no invoice is expanded.
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  const handleToggleExpand = (invoiceId: string) => {
    // If the clicked invoice is already expanded, close it. Otherwise, expand it.
    setExpandedInvoiceId(prevId => (prevId === invoiceId ? null : invoiceId));
  };

  // A simple file input handler for the "Upload PDF" button
  const handleFileUpload = (invoiceId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onUploadInvoice(invoiceId, event.target.files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <List className="h-5 w-5" />
          <span>Pending Invoice Requests</span>
          <Badge variant="secondary">{invoices.filter(inv => inv.status === 'Waiting').length}</Badge>
        </CardTitle>
        <CardDescription>Review requests and upload finalized invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead> {/* Column for expand button */}
              <TableHead>Invoice ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.filter(inv => inv.status === 'Waiting').map((invoice) => (
              // We use a React Fragment (<>) to group the main row and the details row
              <>
                <TableRow key={invoice.id}>
                  <TableCell>
                    {/* The expand/collapse button */}
                    <Button variant="ghost" size="icon" onClick={() => handleToggleExpand(invoice.id)}>
                      {expandedInvoiceId === invoice.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>${invoice.totalAmount}</TableCell>
                  <TableCell>{new Date(invoice.submittedDate).toLocaleDateString()}</TableCell>
                  <TableCell><Badge variant="outline" className="bg-yellow-100 text-yellow-800">{invoice.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                       <label className="flex items-center space-x-2 cursor-pointer">
                            <FileUp className="h-4 w-4" />
                            <span>Upload PDF</span>
                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(invoice.id, e)} />
                       </label>
                    </Button>
                  </TableCell>
                </TableRow>

                {/* THIS IS THE NEW PART: The expandable details section */}
                {expandedInvoiceId === invoice.id && (
                  <TableRow>
                    <TableCell colSpan={7} className="p-0">
                      <div className="p-4 bg-muted">
                        <h4 className="font-semibold mb-2">Requested Items:</h4>
                        <div className="space-y-1 pl-4">
                          {invoice.items.map((item: any, index: number) => (
                            <div key={index} className="grid grid-cols-3 gap-4 text-sm">
                              <span>- {item.productName}</span>
                              <span>Qty: {item.quantity}</span>
                              <span>Price: ${item.unitPrice}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}