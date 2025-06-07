
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const BankAccountSettings = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [accountNumber, setAccountNumber] = useState(user?.profile?.bank_account_number || "");
  const [accountName, setAccountName] = useState(user?.profile?.bank_account_name || "");
  const [bankName, setBankName] = useState(user?.profile?.bank_name || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update the user's bank account information
      await updateProfile({
        bank_account_number: accountNumber,
        bank_account_name: accountName,
        bank_name: bankName,
      });

      toast({
        title: "Bank account updated",
        description: "Your bank account information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your bank account information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Account Settings</CardTitle>
        <CardDescription>
          Add or update your bank account information for withdrawals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Select value={bankName} onValueChange={setBankName} required>
              <SelectTrigger id="bankName">
                <SelectValue placeholder="Select your bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chase">Chase Bank</SelectItem>
                <SelectItem value="bankofamerica">Bank of America</SelectItem>
                <SelectItem value="wellsfargo">Wells Fargo</SelectItem>
                <SelectItem value="citibank">Citibank</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="000123456789"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Bank Information"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BankAccountSettings;
