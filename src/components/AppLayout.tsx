import { ReactNode } from "react";
import BottomNavigation from "./BottomNavigation";
import Header from "./Header";

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  showHeader?: boolean;
  headerTitle?: string;
}

const AppLayout = ({ children, showNav = true, showHeader = true, headerTitle }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {showHeader && <Header title={headerTitle} />}
      <div className="max-w-lg mx-auto">
        {children}
      </div>
      {showNav && <BottomNavigation />}
    </div>
  );
};

export default AppLayout;
