import { useEffect, useState } from 'react';

function App() {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [newEntry, setNewEntry] = useState({
    title: '',
    body: '',
    lat: '',
    lon: ''
  });

  // Load entries.json on mount
  useEffect(() => {
    fetch('/entries.json')
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setEntries(sorted);
      })
      .catch((err) => console.error("Failed to load entries:", err));
  }, []);

  // Add new entry to state
  const handleAddEntry = (e) => {
    e.preventDefault();

    const entry = {
      id: Date.now(),
      title: newEntry.title,
      body: newEntry.body,
      timestamp: new Date().toISOString(),
      location: newEntry.lat && newEntry.lon
        ? {
            lat: parseFloat(newEntry.lat),
            lon: parseFloat(newEntry.lon)
          }
        : undefined
    };

    setEntries([entry, ...entries]);
    setShowModal(false);
    setNewEntry({ title: '', body: '', lat: '', lon: '' });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🪖 Platoon Logbook</h1>

      <button onClick={() => setShowModal(true)} style={{ marginBottom: '1rem' }}>
        ➕ New Entry
      </button>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <form onSubmit={handleAddEntry} style={{
            background: '#fff', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '400px'
          }}>
            <h2>New Log Entry</h2>

            <label>
              Title:<br />
              <input
                required
                value={newEntry.title}
                onChange={e => setNewEntry({ ...newEntry, title: e.target.value })}
                style={{ width: '100%' }}
              />
            </label>
            <br /><br />

            <label>
              Body:<br />
              <textarea
                required
                value={newEntry.body}
                onChange={e => setNewEntry({ ...newEntry, body: e.target.value })}
                style={{ width: '100%', height: '80px' }}
              />
            </label>
            <br /><br />

            <label>
              Latitude (optional):<br />
              <input
                value={newEntry.lat}
                onChange={e => setNewEntry({ ...newEntry, lat: e.target.value })}
                style={{ width: '100%' }}
              />
            </label>
            <br /><br />

            <label>
              Longitude (optional):<br />
              <input
                value={newEntry.lon}
                onChange={e => setNewEntry({ ...newEntry, lon: e.target.value })}
                style={{ width: '100%' }}
              />
            </label>
            <br /><br />

            <button type="submit">✅ Add Entry</button>
            <button type="button" onClick={() => setShowModal(false)} style={{ marginLeft: '10px' }}>
              ❌ Cancel
            </button>
          </form>
        </div>
      )}

      {/* Entries */}
      <ul>
        {entries.map((entry) => (
          <li key={entry.id} style={{
            border: '1px solid #ccc',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '6px'
          }}>
            <h3>{entry.title}</h3>
            <p>{entry.body}</p>
            <small>{new Date(entry.timestamp).toLocaleString()}</small>
            {entry.location && (
              <p>📍 Lat: {entry.location.lat}, Lon: {entry.location.lon}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
