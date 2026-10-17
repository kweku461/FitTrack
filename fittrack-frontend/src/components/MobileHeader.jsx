import { Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useLogout } from '../hooks/useLogout';
import Logo from './Logo';

function MobileHeader() {
  const { theme, toggleTheme } = useTheme();
  const logout = useLogout();

  return (
    <header className="mobile-header">
      <Logo size={40} />
      <div className="mobile-header-actions">
        <button onClick={toggleTheme} aria-label="Toggle light or dark mode">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button onClick={logout} aria-label="Log out">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export default MobileHeader;