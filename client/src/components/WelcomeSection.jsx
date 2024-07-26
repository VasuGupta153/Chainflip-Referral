import { useNavigate } from 'react-router-dom';

function WelcomeSection() {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    navigate('/active');
  };

  return (
    <div className="welcome-section">
      <div className="welcome-content">
        <div className="icon-container">
          <div className="icon">⛓</div>
        </div>
        <h1>Welcome to our Affiliate Program</h1>
        <p>Apply to become an affiliate</p>
        <button className="apply-button" onClick={handleApplyNow}>Apply Now</button>
      </div>
      <div className="how-it-works">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">
              <span className="icon">🔗</span>
            </div>
            <h3>Copy and share your code</h3>
            <p>Send directly or share with your Friends</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <span className="icon">⏳</span>
            </div>
            <h3>Wait until someone verifies and do swap</h3>
            <p>Swap should be made on ChainFlip before participating</p>
          </div>
          <div className="step">
            <div className="step-icon">
              <span className="icon">💰</span>
            </div>
            <h3>Both will get rewards</h3>
            <p>Bonus rewards will be provided for a successful refer</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;