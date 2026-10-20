import { Link, Navigate } from 'react-router-dom';
import { Footprints, Droplets, Moon, Target } from 'lucide-react';
import Logo from '../components/Logo';
import '../styles/Landing.css';

const FEATURES = [
  {
    title: 'Activities',
    text: 'Log your steps, calories and active minutes.',
    icon: Footprints,
  },
  {
    title: 'Hydration',
    text: 'Track water intake against a daily goal.',
    icon: Droplets,
  },
  {
    title: 'Sleep',
    text: 'Record your bedtime and wake time each night.',
    icon: Moon,
  },
  {
    title: 'Goals',
    text: 'Set daily targets and watch your progress fill up.',
    icon: Target,
  },
];

function Landing() {
  if (localStorage.getItem('token')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing">
      <header className="landing-header">
        <Logo size={44} />
        <Link className="landing-btn landing-btn-secondary" to="/login">
          Sign in
        </Link>
      </header>

      <section className="landing-hero">
        <p className="landing-eyebrow">Fitness tracking, simplified</p>
        <h1 className="landing-title">
          Everything you do for your health, in one clean dashboard.
        </h1>
        <p className="landing-subtitle">
          Track steps, calories, hydration and sleep. FitTrack turns your daily
          logs into weekly progress you can actually read.
        </p>
        <div className="landing-actions">
          <Link className="landing-btn landing-btn-primary" to="/signup">
            Get started free
          </Link>
          <Link className="landing-btn landing-btn-secondary" to="/login">
            I already have an account
          </Link>
        </div>
      </section>

      <section className="landing-features">
        {FEATURES.map(({ title, text, icon: Icon }) => (
          <div className="landing-feature-card" key={title}>
            <span className="landing-feature-icon">
              <Icon size={22} />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Landing;