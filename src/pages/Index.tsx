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

  const handleQuotationSubmit = (quotation: any) => {
    setQuotations(prev => [...prev, quotation]);
  };

  const handleInvoiceSubmit = (invoice: any) => {
    setInvoices(prev => [...prev, invoice]);
  };

  const handleQuotationApprove = (id: string) => {
    setQuotations(prev => prev.map(q => 
      q.id === id ? { ...q, status: "Approved" } : q
    ));
    // Convert to invoice request
    const quote = quotations.find(q => q.id === id);
    if (quote) {
      const invoice = {
        id: `INV-${Date.now()}`,
        quoteId: id,
        clientName: quote.clientName,
        productService: quote.productName,
        totalAmount: quote.totalAmount,
        status: "Waiting",
        submittedBy: quote.submittedBy,
        submittedDate: new Date().toISOString(),
        paymentStatus: "Unpaid"
      };
      setInvoices(prev => [...prev, invoice]);
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
