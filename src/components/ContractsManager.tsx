import { useState } from 'react';
import { FileText, Upload, Download, Check, X, Clock, AlertCircle, Eye, Trash2, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';

interface Contract {
  id: number;
  vendorName: string;
  category: string;
  amount: number;
  advancePaid: number;
  signedDate: string;
  validUntil: string;
  status: 'signed' | 'pending' | 'expired';
  documentUrl?: string;
  notes: string;
}

export function ContractsManager() {
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: 1,
      vendorName: 'Royal Palace Banquet',
      category: 'Venue',
      amount: 250000,
      advancePaid: 125000,
      signedDate: '2024-10-01',
      validUntil: '2025-12-15',
      status: 'signed',
      notes: 'Includes decoration and catering',
    },
    {
      id: 2,
      vendorName: 'Rahul Photography',
      category: 'Photographer',
      amount: 80000,
      advancePaid: 40000,
      signedDate: '2024-10-05',
      validUntil: '2025-12-15',
      status: 'signed',
      notes: 'Pre-wedding shoot included',
    },
    {
      id: 3,
      vendorName: 'Spice Garden Catering',
      category: 'Caterer',
      amount: 150000,
      advancePaid: 0,
      signedDate: '',
      validUntil: '2025-12-15',
      status: 'pending',
      notes: 'Awaiting contract signature',
    },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const [newContract, setNewContract] = useState<Partial<Contract>>({
    vendorName: '',
    category: '',
    amount: 0,
    advancePaid: 0,
    signedDate: '',
    validUntil: '',
    status: 'pending',
    notes: '',
  });

  const categories = ['Venue', 'Photographer', 'Caterer', 'Decorator', 'Makeup Artist', 'DJ', 'Other'];

  const totalAmount = contracts.reduce((sum, c) => sum + c.amount, 0);
  const totalAdvance = contracts.reduce((sum, c) => sum + c.advancePaid, 0);
  const totalBalance = totalAmount - totalAdvance;

  const handleAddContract = () => {
    if (!newContract.vendorName || !newContract.category || !newContract.amount) {
      toast.error('Please fill all required fields');
      return;
    }

    const contract: Contract = {
      id: Date.now(),
      vendorName: newContract.vendorName,
      category: newContract.category,
      amount: newContract.amount || 0,
      advancePaid: newContract.advancePaid || 0,
      signedDate: newContract.signedDate || '',
      validUntil: newContract.validUntil || '',
      status: newContract.status || 'pending',
      notes: newContract.notes || '',
    };

    setContracts([...contracts, contract]);
    setShowAddDialog(false);
    setNewContract({
      vendorName: '',
      category: '',
      amount: 0,
      advancePaid: 0,
      signedDate: '',
      validUntil: '',
      status: 'pending',
      notes: '',
    });
    toast.success('Contract added successfully!');
  };

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setShowViewDialog(true);
  };

  const handleDeleteContract = (id: number) => {
    setContracts(contracts.filter(c => c.id !== id));
    toast.success('Contract deleted');
  };

  const handleFileUpload = () => {
    toast.success('Document uploaded successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'expired':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return Check;
      case 'pending':
        return Clock;
      case 'expired':
        return X;
      default:
        return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <h1>Vendor Contracts & Documents</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Manage all your wedding vendor contracts and documents in one secure place
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-pink rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Contracts</p>
                  <p className="text-2xl text-primary">{contracts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Signed</p>
                  <p className="text-2xl text-primary">
                    {contracts.filter(c => c.status === 'signed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-maroon rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl text-primary">
                    {contracts.filter(c => c.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Payment Progress</p>
                <Progress value={(totalAdvance / totalAmount) * 100} className="mb-2" />
                <p className="text-sm">
                  Rs.{totalAdvance.toLocaleString()} / Rs.{totalAmount.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end mb-6">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gradient-maroon">
                <Plus className="w-4 h-4 mr-2" />
                Add Contract
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Contract</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendorName">Vendor Name *</Label>
                  <Input
                    id="vendorName"
                    value={newContract.vendorName}
                    onChange={(e) => setNewContract({ ...newContract, vendorName: e.target.value })}
                    placeholder="Enter vendor name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={newContract.category}
                    onValueChange={(value) => setNewContract({ ...newContract, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Total Amount (Rs.) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newContract.amount}
                    onChange={(e) => setNewContract({ ...newContract, amount: Number(e.target.value) })}
                    placeholder="250000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advance">Advance Paid (Rs.)</Label>
                  <Input
                    id="advance"
                    type="number"
                    value={newContract.advancePaid}
                    onChange={(e) => setNewContract({ ...newContract, advancePaid: Number(e.target.value) })}
                    placeholder="125000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signedDate">Signed Date</Label>
                  <Input
                    id="signedDate"
                    type="date"
                    value={newContract.signedDate}
                    onChange={(e) => setNewContract({ ...newContract, signedDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={newContract.validUntil}
                    onChange={(e) => setNewContract({ ...newContract, validUntil: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newContract.notes}
                    onChange={(e) => setNewContract({ ...newContract, notes: e.target.value })}
                    placeholder="Add any notes about this contract"
                    rows={3}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="document">Upload Contract Document</Label>
                  <div className="flex gap-2">
                    <Input
                      id="document"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>

                <Button className="w-full gradient-maroon md:col-span-2" onClick={handleAddContract}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contract
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Contracts List */}
        <div className="space-y-4">
          {contracts.map((contract) => {
            const StatusIcon = getStatusIcon(contract.status);
            const balance = contract.amount - contract.advancePaid;
            const paymentProgress = (contract.advancePaid / contract.amount) * 100;

            return (
              <Card key={contract.id} className="glassmorphism hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 gradient-pink rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="mb-1">{contract.vendorName}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {contract.category}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                      <p className="text-lg text-primary">Rs.{contract.amount.toLocaleString()}</p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Balance Due</p>
                      <p className="text-lg text-primary">Rs.{balance.toLocaleString()}</p>
                      <Progress value={paymentProgress} className="mt-2 h-1.5" />
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge className={`${getStatusColor(contract.status)} flex items-center gap-1 w-fit`}>
                        <StatusIcon className="w-3 h-3" />
                        {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="md:col-span-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewContract(contract)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteContract(contract.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {contract.notes && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground italic">{contract.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View Contract Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Contract Details</DialogTitle>
            </DialogHeader>
            {selectedContract && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Vendor Name</p>
                    <p>{selectedContract.vendorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <Badge>{selectedContract.category}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                    <p className="text-xl text-primary">Rs.{selectedContract.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Advance Paid</p>
                    <p className="text-xl text-green-600">Rs.{selectedContract.advancePaid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Balance Due</p>
                    <p className="text-xl text-orange-600">
                      Rs.{(selectedContract.amount - selectedContract.advancePaid).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Badge className={getStatusColor(selectedContract.status)}>
                      {selectedContract.status.charAt(0).toUpperCase() + selectedContract.status.slice(1)}
                    </Badge>
                  </div>
                  {selectedContract.signedDate && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Signed Date</p>
                      <p>{new Date(selectedContract.signedDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedContract.validUntil && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Valid Until</p>
                      <p>{new Date(selectedContract.validUntil).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {selectedContract.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="p-3 bg-secondary rounded-lg">{selectedContract.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button className="flex-1 gradient-maroon">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
