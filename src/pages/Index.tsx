import { useState } from "react";
import { LoginScreen } from "@/components/Auth/LoginScreen";
import { Header } from "@/components/Layout/Header";
import { Sidebar } from "@/components/Layout/Sidebar";
import { SalesDashboard } from "@/components/Dashboard/SalesDashboard";
import { FinanceDashboard } from "@/components/Dashboard/FinanceDashboard";
import { QuotationForm } from "@/components/Sales/QuotationForm";
import { InvoiceRequestForm } from "@/components/Sales/InvoiceRequestForm";
import { QuotationsList } from "@/components/Sales/QuotationsList";
import { InvoicesList } from "@/components/Sales/InvoicesList";
import { PendingInvoices } from "@/components/Finance/PendingInvoices";
import { PaymentStatus } from "@/components/Finance/PaymentStatus";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: "", role: "" });
  const [activeSection, setActiveSection] = useState("dashboard");
  const [quotations, setQuotations] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  const handleLogin = (role: string, username: string) => {
    setCurrentUser({ name: username, role });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser({ name: "", role: "" });
  };

// This is the new function that sends data to Google Sheets
const handleQuotationSubmit = async (quotation: any) => {
  // Make sure your correct URL is here
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzleToSqw6zAX25KWZ0UnLE4lmiIe2UMNgNAqoFQACx4kwYTSTF9fGx-JgjEG6mk0Ah/exec"; 

  const payload = {
    type: "quotation",
    quoteId: quotation.id,
    clientName: quotation.clientName,
    items: quotation.items,
    totalAmount: quotation.totalAmount
  };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    // --- THIS IS THE KEY UPGRADE ---
    // Check if the script was successful AND sent back the URLs
    if (result.status === "success" && result.pdfUrl) {
      console.log("PDF created successfully! URL:", result.pdfUrl);

      // Create the new quotation object for our UI state,
      // now including the pdfUrl and docUrl from the response.
      const newQuotationForState = {
        ...quotation,
        pdfUrl: result.pdfUrl,
        docUrl: result.docUrl 
      };
      
      // Add the complete quotation object (with URLs) to our local state.
      setQuotations(prev => [...prev, newQuotationForState]);

    } else {
      // If something went wrong on the backend
      alert("Could not generate PDF: " + result.message);
      // We can still add the quote to the UI but without a PDF link
      setQuotations(prev => [...prev, quotation]);
    }
  } catch (error) {
    console.error('Error during PDF generation:', error);
    alert("A network error occurred while generating the PDF.");
  }
};

const handleInvoiceSubmit = (invoice: any) => {
  // Step 1 (Immediate Action): Add the new invoice object to the local state.
  // This makes it instantly available to the Finance component.
  setInvoices(prev => [...prev, invoice]);

  // Step 2 (Secondary Action): Try to save a copy to Google Sheets.
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzleToSqw6zAX25KWZ0UnLE4lmiIe2UMNgNAqoFQACx4kwYTSTF9fGx-JgjEG6mk0Ah/exec"; // <-- Make sure this is your latest URL
  const payload = {
    type: "invoiceRequest",
    clientName: invoice.clientName,
    items: invoice.items,
    totalAmount: invoice.totalAmount
  };

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      console.log("Backend direct invoice request successful.");
    } else {
      console.error("Backend direct invoice request failed:", data.message);
    }
  })
  .catch(error => console.error("Network error on direct invoice request:", error));
};


const handleQuotationApprove = (id: string) => {
  let approvedQuoteData: any = null;

  // Step 1: Update the local quotations state immediately.
  // This also finds the full data of the quote we just approved.
  const updatedQuotations = quotations.map(q => {
    if (q.id === id) {
      approvedQuoteData = { ...q, status: "Approved" };
      return approvedQuoteData;
    }
    return q;
  });
  setQuotations(updatedQuotations);

  // Step 2: If the quote was found, create the new invoice object and add it to the local invoices state.
  // THIS is the logic that makes it appear for the Finance user instantly.
  if (approvedQuoteData) {
    const invoiceForUi = {
      id: `INV-${Date.now()}`,
      quoteId: id,
      clientName: approvedQuoteData.clientName,
      items: approvedQuoteData.items,
      totalAmount: approvedQuoteData.totalAmount,
      status: "Waiting",
      submittedBy: approvedQuoteData.submittedBy,
      submittedDate: new Date().toISOString(),
      paymentStatus: "Unpaid"
    };
    setInvoices(prev => [...prev, invoiceForUi]);

    // Step 3 (Secondary Action): Now, try to save this to Google Sheets.
    // This no longer blocks the UI.
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzleToSqw6zAX25KWZ0UnLE4lmiIe2UMNgNAqoFQACx4kwYTSTF9fGx-JgjEG6mk0Ah/exec"; // <-- Make sure this is your latest URL
    const payload = {
      type: "updateQuoteStatus",
      quoteId: id,
      newStatus: "Approved"
    };
    
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        console.log("Backend approval and invoice creation successful.");
      } else {
        console.error("Backend update failed:", data.message);
      }
    })
    .catch(error => console.error("Network error on quote approval:", error));

  } else {
    console.error("Logic Error: Could not find the quote to approve in the local state.");
  }
};

  const handleUploadInvoice = (id: string, file: File) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id 
        ? { ...inv, status: "Uploaded", invoicePdfLink: `#${file.name}`, uploadedDate: new Date().toISOString() }
        : inv
    ));
  };

  const handleUpdatePaymentStatus = (id: string, status: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id ? { ...inv, paymentStatus: status } : inv
    ));
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (currentUser.role === "Sales") {
      switch (activeSection) {
        case "dashboard":
          return <SalesDashboard quotations={quotations} invoices={invoices} />;
        case "quotes":
          return (
            <div className="space-y-6">
              <QuotationForm onSubmit={handleQuotationSubmit} />
              <QuotationsList quotations={quotations} onApprove={handleQuotationApprove} />
            </div>
          );
        case "invoices":
          return (
            <div className="space-y-6">
              <InvoiceRequestForm onSubmit={handleInvoiceSubmit} />
              <InvoicesList invoices={invoices} />
            </div>
          );
        default:
          return <SalesDashboard quotations={quotations} invoices={invoices} />;
      }
    } else {
      switch (activeSection) {
        case "dashboard":
          return <FinanceDashboard invoices={invoices} />;
        case "pending-invoices":
          return <PendingInvoices invoices={invoices} onUploadInvoice={handleUploadInvoice} />;
        case "payments":
          return <PaymentStatus invoices={invoices} onUpdatePaymentStatus={handleUpdatePaymentStatus} />;
        default:
          return <FinanceDashboard invoices={invoices} />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
          userRole={currentUser.role}
        />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
