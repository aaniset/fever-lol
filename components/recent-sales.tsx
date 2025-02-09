import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePrice } from "@/hooks/use-price";
interface RecentSalesProps {
  sales: {
    id: string;
    name: string;
    email: string;
    amount: number;
    avatar: string;
  }[];
}

export function RecentSales({ sales }: RecentSalesProps) {
  const { formatPrice } = usePrice();

  return (
    <div className="space-y-8">
      {sales.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={sale.avatar} alt="Avatar" />
            <AvatarFallback>
              {sale.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.name}</p>
            <p className="text-sm text-muted-foreground">{sale.email}</p>
          </div>
          <div className="ml-auto font-medium">
            +{formatPrice(sale.amount.toFixed(2))}
          </div>
        </div>
      ))}
    </div>
  );
}
