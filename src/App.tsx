import { useState, useEffect, useRef, MutableRefObject } from 'react';
import {
  formatPick,
  currentPickNumber,
  countPlayersByPosition,
  positionalPickNumber,
} from './utils';
import { fetchDraftDetails, fetchDraftPicks } from './utils/Sleeper';
import DraftPick from './components/DraftPick';
import PositionCounter from './components/PositionCounter';

function App() {
  // STATE
  const [draftPicks, setDraftPicks] = useState([]);
  const [currentPick, setCurrentPick] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [draftId, setDraftId] = useState('1135772916597456896');
  /**
   * 1130718283352748032 - few weeks ago
   * 1135772916597456896 - sat 8:51
   */
  const [draftDetails, setDraftDetails] = useState(null);

  const pollingInterval: MutableRefObject<null | NodeJS.Timeout> = useRef(null);

  // FUNCTIONS
  const updateDraftData = async () => {
    setLoading(true);
    try {
      const draftPicksData = await fetchDraftPicks(draftId);

      // Check if the new data is different from the current state
      if (
        draftPicksData.length !== draftPicks.length ||
        JSON.stringify(draftPicksData) !== JSON.stringify(draftPicks)
      ) {
        const int = currentPickNumber(draftPicksData);
        setCurrentPick(int);
        setDraftPicks(draftPicksData);
      }
    } catch (error) {
      console.error('Error fetching draft picks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDraft = async () => {
    setLoading(true);
    try {
      const draftData = await fetchDraftDetails(draftId);
      if (draftData) setDraftDetails(draftData);

      await updateDraftData();
    } catch (error) {
      console.error('Error loading draft:', error);
    } finally {
      setLoading(false);
    }
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
    setIsPolling(false);
  };

  const startPolling = () => {
    setIsPolling(true); // Set isPolling to true first
    pollingInterval.current = setInterval(updateDraftData, 15000); // Start polling
    updateDraftData(); // Load data immediately
  };

  const togglePolling = () => {
    if (isPolling) {
      stopPolling();
    } else {
      startPolling();
    }
  };

  // EFFECTS
  // Cleanup effect to stop polling when the component unmounts
  useEffect(() => {
    return () => {
      stopPolling(); // Clean up polling on unmount
    };
  }, []); // Empty dependency array means this runs only on unmount

  return (
    <main className="h-screen w-screen">
      <div className="hero bg-base-200 py-12">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">FF Draft Widget</h1>
            <p className="py-6">
              Live positional counts for a Sleeper draft session
            </p>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Sleeper Draft ID</span>
              </div>
              <input
                className="input input-bordered w-full max-w-xs"
                placeholder="Sleeper Draft ID"
                type="text"
                value={draftId}
                onChange={(e) => setDraftId(e.target.value)}
              />

              <div className="label">
                <span className="label-text-alt">{`https://sleeper.com/draftboards/<this_part>`}</span>
              </div>
            </label>
            <button className="btn btn-primary" onClick={loadDraft}>
              Load Draft
            </button>
          </div>
        </div>
      </div>

      <main className="container prose p-4 mx-auto">
        <h3 className="text-2xl">Draft Overview</h3>

        <div className="stats shadow w-full">
          <div className="stat place-items-center">
            <div className="stat-title">Curr Pick #</div>
            <div className="stat-value">
              {currentPick > 0 ? currentPick : '-'}
            </div>
            <div className="stat-desc">Ovr Pick</div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">Curr Pick</div>
            <div className="stat-value">
              {currentPick > 0
                ? formatPick(currentPick, draftDetails?.settings?.teams || 10)
                : '-'}
            </div>
            <div className="stat-desc">Round</div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">Session</div>
            <div className="stat-value">
              <input
                type="checkbox"
                className="toggle toggle-accent"
                checked={isPolling}
                onChange={togglePolling}
                disabled={!draftDetails}
              />
            </div>
            <div className="stat-desc w-12">
              {loading ? 'Updating...' : isPolling ? 'Sync: ON' : 'Sync: OFF'}
            </div>
          </div>
        </div>

        <h3 className="text-2xl">Picks by Position</h3>
        <PositionCounter
          positionCounts={countPlayersByPosition(draftPicks, currentPick)}
        />

        <h3 className="text-2xl">All Picks</h3>
        <div className="flex flex-col">
          {draftPicks.length > 0 ? (
            draftPicks.map((pick) => (
              <DraftPick
                key={pick.pick_no}
                pick={pick}
                currentPick={currentPick}
                position={pick.metadata.position}
                positionNumber={
                  pick.pick_no <= currentPick
                    ? positionalPickNumber(draftPicks, pick)
                    : -1
                }
              />
            ))
          ) : (
            <div>{loading ? 'Loading picks...' : 'No picks loaded yet'}</div>
          )}
        </div>
      </main>
    </main>
  );
}

export default App;
