import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PenSquare, 
  CalendarDays, 
  Settings,
  ChevronLeft,
  Sparkles,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: PenSquare, label: 'Create Tweet', path: '/create' },
  { icon: CalendarDays, label: 'Schedule', path: '/schedule' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-6 border-b border-border/50',
        collapsed && 'justify-center px-2'
      )}>
        <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent text-white shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-lg text-foreground whitespace-nowrap">Tweet Planner</h1>
            <p className="text-xs text-muted-foreground">Content Scheduler</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                'hover:bg-primary/10 hover:text-primary',
                isActive && 'bg-primary/10 text-primary font-medium shadow-sm',
                !isActive && 'text-muted-foreground',
                collapsed && 'justify-center px-2'
              )}
            >
              <item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-primary')} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button - Desktop only */}
      <div className="p-3 border-t border-border/50 hidden lg:block">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'w-full gap-2 text-muted-foreground hover:text-foreground',
            collapsed && 'px-2'
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn(
            'w-4 h-4 transition-transform duration-200',
            collapsed && 'rotate-180'
          )} />
          {!collapsed && <span>Collapse</span>}
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <NavContent />
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-accent text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-semibold text-foreground">Tweet Planner</span>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col bg-card border-r border-border/50 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}>
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pt-0 pt-16 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
