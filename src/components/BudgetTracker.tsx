import { useState } from 'react';
import { IndianRupee, Plus, Trash2, TrendingUp, TrendingDown, PieChart, BarChart3, Target, AlertTriangle, CheckCircle, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface BudgetItem {
  id: number;
  category: string;
  budgeted: number;
  spent: number;
  notes?: string;
  dateAdded: string;
  priority: 'high' | 'medium' | 'low';
}

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  vendor?: string;
  receipt?: string;
}

const defaultBudgetItems: BudgetItem[] = [
  { id: 1, category: 'Venue', budgeted: 200000, spent: 200000, priority: 'high', dateAdded: '2024-01-15' },
  { id: 2, category: 'Catering', budgeted: 300000, spent: 0, priority: 'high', dateAdded: '2024-01-15' },
  { id: 3, category: 'Photography', budgeted: 50000, spent: 50000, priority: 'medium', dateAdded: '2024-01-15' },
  { id: 4, category: 'Decoration', budgeted: 100000, spent: 0, priority: 'medium', dateAdded: '2024-01-15' },
  { id: 5, category: 'Clothing', budgeted: 150000, spent: 0, priority: 'high', dateAdded: '2024-01-15' },
  { id: 6, category: 'Makeup & Beauty', budgeted: 30000, spent: 0, priority: 'medium', dateAdded: '2024-01-15' },
  { id: 7, category: 'Invitations', budgeted: 20000, spent: 0, priority: 'low', dateAdded: '2024-01-15' },
  { id: 8, category: 'Transportation', budgeted: 50000, spent: 0, priority: 'medium', dateAdded: '2024-01-15' },
  { id: 9, category: 'Jewelry', budgeted: 200000, spent: 0, priority: 'high', dateAdded: '2024-01-15' },
  { id: 10, category: 'Miscellaneous', budgeted: 50000, spent: 0, priority: 'low', dateAdded: '2024-01-15' },
];

const defaultExpenses: Expense[] = [
  { id: 1, description: 'Venue Booking Deposit', amount: 200000, category: 'Venue', date: '2024-01-20', vendor: 'Grand Palace Hotel' },
  { id: 2, description: 'Photography Package', amount: 50000, category: 'Photography', date: '2024-02-15', vendor: 'Royal Photography' },
];

export function BudgetTracker() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(defaultBudgetItems);
  const [expenses, setExpenses] = useState<Expense[]>(defaultExpenses);
  const [showAddBudgetDialog, setShowAddBudgetDialog] = useState(false);
  const [showAddExpenseDialog, setShowAddExpenseDialog] = useState(false);
  const [newBudgetItem, setNewBudgetItem] = useState({ category: '', budgeted: 0, priority: 'medium' as const });
  const [newExpense, setNewExpense] = useState({ description: '', amount: 0, category: '', date: '', vendor: '' });
  const [activeTab, setActiveTab] = useState('overview');

  const addBudgetItem = () => {
    if (newBudgetItem.category && newBudgetItem.budgeted > 0) {
      const newItem: BudgetItem = {
        id: Date.now(),
        ...newBudgetItem,
        spent: 0,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      setBudgetItems([...budgetItems, newItem]);
      setNewBudgetItem({ category: '', budgeted: 0, priority: 'medium' });
      setShowAddBudgetDialog(false);
    }
  };

  const addExpense = () => {
    if (newExpense.description && newExpense.amount > 0 && newExpense.category) {
      const expense: Expense = {
        id: Date.now(),
        ...newExpense
      };
      setExpenses([...expenses, expense]);
      
      // Update budget item spent amount
      setBudgetItems(prev => prev.map(item => 
        item.category === newExpense.category 
          ? { ...item, spent: item.spent + newExpense.amount }
          : item
      ));
      
      setNewExpense({ description: '', amount: 0, category: '', date: '', vendor: '' });
      setShowAddExpenseDialog(false);
    }
  };

  const deleteBudgetItem = (id: number) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const deleteExpense = (id: number) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      // Update budget item spent amount
      setBudgetItems(prev => prev.map(item => 
        item.category === expense.category 
          ? { ...item, spent: item.spent - expense.amount }
          : item
      ));
    }
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetPercent = Math.round((totalSpent / totalBudget) * 100);

  const overBudgetItems = budgetItems.filter(item => item.spent > item.budgeted);
  const nearBudgetItems = budgetItems.filter(item => 
    item.spent > 0 && item.spent / item.budgeted > 0.8 && item.spent <= item.budgeted
  );

  const categories = [...new Set(budgetItems.map(item => item.category))];

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4">Wedding Budget Tracker</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your wedding expenses and stay within budget with our comprehensive budget management tool
          </p>
        </div>

        {/* Budget Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphism border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-gold rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
                  <p className="text-2xl text-primary">Rs.{(totalBudget/100000).toFixed(1)}L</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-maroon rounded-full flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                  <p className="text-2xl text-primary">Rs.{(totalSpent/100000).toFixed(1)}L</p>
                  <Progress value={budgetPercent} className="mt-2 h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-pink rounded-full flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                  <p className="text-2xl text-primary">Rs.{(remainingBudget/100000).toFixed(1)}L</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-blue rounded-full flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Budget Used</p>
                  <p className="text-2xl text-primary">{budgetPercent}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {overBudgetItems.length > 0 && (
          <Card className="glassmorphism border-red-200 bg-red-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-900">Over Budget Alert</h3>
              </div>
              <p className="text-sm text-red-700 mt-1">
                You have exceeded budget in {overBudgetItems.length} category(ies): {overBudgetItems.map(item => item.category).join(', ')}
              </p>
            </CardContent>
          </Card>
        )}

        {nearBudgetItems.length > 0 && (
          <Card className="glassmorphism border-yellow-200 bg-yellow-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-900">Near Budget Limit</h3>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                You're approaching budget limit in: {nearBudgetItems.map(item => item.category).join(', ')}
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex w-full justify-start">
            <TabsTrigger value="overview" className="flex-1">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="budget" className="flex-1">
              <Target className="w-4 h-4 mr-2" />
              Budget Items
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex-1">
              <IndianRupee className="w-4 h-4 mr-2" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex-1">
              <PieChart className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Budget Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgetItems.map((item) => {
                      const spentPercent = Math.round((item.spent / item.budgeted) * 100);
                      return (
                        <div key={item.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.category}</span>
                              <Badge variant={
                                item.spent > item.budgeted ? 'destructive' :
                                spentPercent > 80 ? 'secondary' : 'outline'
                              }>
                                {item.priority}
                              </Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Rs.{item.spent.toLocaleString()} / Rs.{item.budgeted.toLocaleString()}
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(spentPercent, 100)} 
                            className={`h-2 ${
                              item.spent > item.budgeted ? '[&>div]:bg-red-500' :
                              spentPercent > 80 ? '[&>div]:bg-yellow-500' : ''
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Recent Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {expenses.slice(-5).map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-muted-foreground">{expense.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">Rs.{expense.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{expense.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Budget Items Tab */}
          <TabsContent value="budget">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Budget Categories</span>
                  <Button onClick={() => setShowAddBudgetDialog(true)} className="gradient-maroon">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetItems.map((item) => {
                    const spentPercent = Math.round((item.spent / item.budgeted) * 100);
                    return (
                      <div key={item.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{item.category}</h3>
                            <Badge variant={
                              item.spent > item.budgeted ? 'destructive' :
                              spentPercent > 80 ? 'secondary' : 'outline'
                            }>
                              {item.priority}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteBudgetItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Spent: Rs.{item.spent.toLocaleString()}</span>
                            <span>Budget: Rs.{item.budgeted.toLocaleString()}</span>
                            <span className={item.spent > item.budgeted ? 'text-red-600' : 'text-green-600'}>
                              {item.spent > item.budgeted ? 'Over by Rs.' + (item.spent - item.budgeted).toLocaleString() : 'Remaining Rs.' + (item.budgeted - item.spent).toLocaleString()}
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(spentPercent, 100)} 
                            className={`h-3 ${
                              item.spent > item.budgeted ? '[&>div]:bg-red-500' :
                              spentPercent > 80 ? '[&>div]:bg-yellow-500' : ''
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Expense Tracking</span>
                  <Button onClick={() => setShowAddExpenseDialog(true)} className="gradient-maroon">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium">{expense.description}</p>
                        <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                          <Badge variant="outline">{expense.category}</Badge>
                          {expense.vendor && <Badge variant="outline">{expense.vendor}</Badge>}
                          <span>{expense.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-semibold">Rs.{expense.amount.toLocaleString()}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteExpense(expense.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Budget Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Budget</span>
                      <span className="font-semibold">Rs.{totalBudget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Spent</span>
                      <span className="font-semibold">Rs.{totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining</span>
                      <span className={`font-semibold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Rs.{remainingBudget.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget Utilization</span>
                      <span className="font-semibold">{budgetPercent}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Top Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {budgetItems
                      .sort((a, b) => b.spent - a.spent)
                      .slice(0, 5)
                      .map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.category}</span>
                          <span className="font-semibold">Rs.{item.spent.toLocaleString()}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Budget Item Dialog */}
        <Dialog open={showAddBudgetDialog} onOpenChange={setShowAddBudgetDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Budget Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newBudgetItem.category}
                  onChange={(e) => setNewBudgetItem({ ...newBudgetItem, category: e.target.value })}
                  placeholder="e.g., Photography, Catering"
                />
              </div>
              <div>
                <Label htmlFor="budgeted">Budget Amount</Label>
                <Input
                  id="budgeted"
                  type="number"
                  value={newBudgetItem.budgeted}
                  onChange={(e) => setNewBudgetItem({ ...newBudgetItem, budgeted: parseInt(e.target.value) || 0 })}
                  placeholder="Enter budget amount"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newBudgetItem.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewBudgetItem({ ...newBudgetItem, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddBudgetDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={addBudgetItem}>
                  Add Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Expense Dialog */}
        <Dialog open={showAddExpenseDialog} onOpenChange={setShowAddExpenseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="e.g., Venue deposit, Photography package"
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: parseInt(e.target.value) || 0 })}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="vendor">Vendor (Optional)</Label>
                <Input
                  id="vendor"
                  value={newExpense.vendor}
                  onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
                  placeholder="Vendor name"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddExpenseDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={addExpense}>
                  Add Expense
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

