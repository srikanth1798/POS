import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <h1>Spice Dashboard</h1>
      </div>
      <div className="header-right">
        <div className="user-profile">
          <img src="/avatar-placeholder.png" alt="Profile" className="avatar" />
          <span className="user-name">Meduri Madhukrishna</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 