import { useState } from 'react';
import { Check, ChevronsUpDown, Plus, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface Account {
  id: string;
  handle: string;
  name: string;
  avatar?: string;
}

const mockAccounts: Account[] = [
  { id: '1', handle: '@techguru', name: 'Tech Guru', avatar: '' },
  { id: '2', handle: '@saasbuilder', name: 'SaaS Builder', avatar: '' },
];

interface AccountSwitcherProps {
  collapsed?: boolean;
}

export const AccountSwitcher = ({ collapsed = false }: AccountSwitcherProps) => {
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [selectedAccount, setSelectedAccount] = useState<Account>(mockAccounts[0]);

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    setOpen(false);
  };

  const handleAddAccount = () => {
    // Mock adding a new account
    const newAccount: Account = {
      id: String(accounts.length + 1),
      handle: `@newuser${accounts.length + 1}`,
      name: `New User ${accounts.length + 1}`,
      avatar: '',
    };
    setAccounts([...accounts, newAccount]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between gap-2 px-3 py-2.5 h-auto hover:bg-primary/10',
            collapsed && 'justify-center px-2'
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-8 w-8 shrink-0 border-2 border-primary/20">
              <AvatarImage src={selectedAccount.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
                {selectedAccount.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-col items-start min-w-0">
                <span className="font-medium text-sm text-foreground truncate max-w-[120px]">
                  {selectedAccount.name}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {selectedAccount.handle}
                </span>
              </div>
            )}
          </div>
          {!collapsed && <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start" sideOffset={8}>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground px-2 py-1.5">
            Switch Account
          </p>
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => handleSelectAccount(account)}
              className={cn(
                'w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors',
                'hover:bg-muted/80',
                selectedAccount.id === account.id && 'bg-primary/10'
              )}
            >
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={account.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-accent/80 text-white text-xs">
                  {account.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start min-w-0 flex-1">
                <span className="font-medium text-sm text-foreground truncate max-w-full">
                  {account.name}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-full">
                  {account.handle}
                </span>
              </div>
              {selectedAccount.id === account.id && (
                <Check className="h-4 w-4 text-primary shrink-0" />
              )}
            </button>
          ))}
        </div>
        
        <Separator className="my-2" />
        
        <button
          onClick={handleAddAccount}
          className={cn(
            'w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors',
            'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
          )}
        >
          <div className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
            <Plus className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">Add Account</span>
        </button>
      </PopoverContent>
    </Popover>
  );
};
