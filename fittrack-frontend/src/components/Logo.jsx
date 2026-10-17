import { useTheme } from '../hooks/useTheme';
import logoLight from '../assets/logo-light.png';
import logoDark from '../assets/logo-dark.png';

function Logo({ size = 32 }) {
  const { theme } = useTheme();

  return (
    <img
      className="logo"
      src={theme === 'dark' ? logoDark : logoLight}
      alt="FitTrack"
      height={size}
    />
  );
}

export default Logo;