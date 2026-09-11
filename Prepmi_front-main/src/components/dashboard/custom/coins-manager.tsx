import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconCoins, IconPlus, IconMinus } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { addCoins, spendCoins, updateCoins } from "@/store/slices/userSlice";
import React from "react";
import { toast } from "sonner";

export default function CoinsManager() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const [amount, setAmount] = React.useState<number>(100);

  const handleAddCoins = () => {
    dispatch(addCoins(amount));
    toast.success(`Added ${amount} coins to your account!`);
  };

  const handleSpendCoins = () => {
    if (currentUser?.coins && currentUser.coins >= amount) {
      dispatch(spendCoins(amount));
      toast.success(`Spent ${amount} coins from your account!`);
    } else {
      toast.error("Insufficient coins!");
    }
  };

  const handleSetCoins = () => {
    dispatch(updateCoins(amount));
    toast.success(`Set coins to ${amount}!`);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconCoins className="w-5 h-5 text-yellow-500" />
          Coins Manager (Admin)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {currentUser?.coins || 0}
          </div>
          <div className="text-sm text-gray-500">Current Coins</div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="1"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={handleAddCoins}
            variant="default"
            size="sm"
            className="flex items-center gap-1"
          >
            <IconPlus className="w-4 h-4" />
            Add
          </Button>
          <Button
            onClick={handleSpendCoins}
            variant="destructive"
            size="sm"
            className="flex items-center gap-1"
            disabled={!currentUser?.coins || currentUser.coins < amount}
          >
            <IconMinus className="w-4 h-4" />
            Spend
          </Button>
          <Button
            onClick={handleSetCoins}
            variant="secondary"
            size="sm"
          >
            Set
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
