import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDateTime, getDetailedTimeRemaining } from '../../utils/timeUtils';
import './CommitmentCard.css';

const CommitmentCard = ({ commitment, onJudgeRequest, onDelete }) => {
  const { status, goal, sacrifice, deadline, penalty, reward } = commitment;

  // A card is only rendered here if it's locked or pending.
  // Success/Fail goes to the History page.
  
  const isPending = status === 'pending_judgment';

  const [timeLeft, setTimeLeft] = useState(() => getDetailedTimeRemaining(deadline));

  useEffect(() => {
    if (isPending) return;

    const interval = setInterval(() => {
      const remaining = getDetailedTimeRemaining(deadline);
      setTimeLeft(remaining);
      
      // If it just unlocked, you might want to call onJudgeRequest to pop it immediately,
      // but the CommitmentList handles the state migration already.
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, isPending]);

  return (
    <div className={`glass-panel commitment-card ${isPending ? 'pending-glow' : ''}`}>
      <div className="card-header">
        <span className="status-badge">
          {isPending ? '⚠️ Unlocked - Judgment Required' : '🔒 Locked'}
        </span>
        {status === 'locked' && (
          <button className="btn-delete" onClick={() => onDelete(commitment.id)}>🗑️</button>
        )}
      </div>

      <div className="card-body">
        <h4>Goal</h4>
        <p className="card-primary-text">{goal}</p>
        
        <h4>Sacrifice</h4>
        <p className="card-secondary-text">{sacrifice}</p>

        {(penalty || reward) && (
          <div className="stakes-box">
            {penalty && <div><span className="stake-label danger">If fail:</span> {penalty}</div>}
            {reward && <div><span className="stake-label success">If win:</span> {reward}</div>}
          </div>
        )}
      </div>

      <div className="card-footer">
        {!isPending && (
          <div className="live-countdown">
            <h5 className="countdown-title">⏳ UNLOCKS IN</h5>
            <div className="countdown-boxes">
              <div className="time-box">
                <span className="time-val">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="time-lbl">DAYS</span>
              </div>
              <div className="time-box">
                <span className="time-val">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="time-lbl">HRS</span>
              </div>
              <div className="time-box">
                <span className="time-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="time-lbl">MIN</span>
              </div>
              <div className="time-box">
                <span className="time-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="time-lbl">SEC</span>
              </div>
            </div>
            <div className="time-info-date">
              📅 on {formatDateTime(deadline)}
            </div>
          </div>
        )}
        
        {isPending && (
          <button 
            className="btn-judge-now" 
            onClick={() => onJudgeRequest(commitment)}
          >
            Face Your Judgment
          </button>
        )}
      </div>
    </div>
  );
};

CommitmentCard.propTypes = {
  commitment: PropTypes.object.isRequired,
  onJudgeRequest: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CommitmentCard;
