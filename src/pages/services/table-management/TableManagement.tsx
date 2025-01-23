import { useState } from 'react';
import { FaEye, FaTable, FaUserFriends, FaCalendarAlt, FaBell } from 'react-icons/fa';
import './TableManagement.css';

interface Table {
  id: number;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  reservation?: {
    customerName: string;
    time: string;
    guests: number;
  };
}

const initialTables: Table[] = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  number: index + 1,
  capacity: index % 3 === 0 ? 6 : index % 2 === 0 ? 4 : 2,
  status: 'available'
}));

const features = [
  {
    id: 1,
    title: 'Real-time Table Status',
    description: 'Monitor table availability, reservations, and occupancy in real-time',
    icon: <FaTable />,
  },
  {
    id: 2,
    title: 'Smart Reservations',
    description: 'Efficiently manage bookings with automated capacity checking',
    icon: <FaUserFriends />,
  },
  {
    id: 3,
    title: 'Scheduling System',
    description: 'Schedule reservations with time management and conflict prevention',
    icon: <FaCalendarAlt />,
  },
  {
    id: 4,
    title: 'Notifications',
    description: 'Get alerts for new reservations, cancellations, and table status changes',
    icon: <FaBell />,
  },
];

const TableManagement = () => {
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showReservationDetails, setShowReservationDetails] = useState(false);
  const [reservationData, setReservationData] = useState({
    customerName: '',
    time: '',
    guests: 1
  });

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setShowReservationForm(true);
  };

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) return;

    setTables(tables.map(table => 
      table.id === selectedTable.id 
        ? {
            ...table,
            status: 'reserved',
            reservation: {
              customerName: reservationData.customerName,
              time: reservationData.time,
              guests: reservationData.guests
            }
          }
        : table
    ));

    setShowReservationForm(false);
    setReservationData({ customerName: '', time: '', guests: 1 });
  };

  const handleClearTable = (tableId: number) => {
    setTables(tables.map(table => 
      table.id === tableId 
        ? { ...table, status: 'available', reservation: undefined }
        : table
    ));
  };

  const handleViewDetails = (e: React.MouseEvent, table: Table) => {
    e.stopPropagation();
    setSelectedTable(table);
    setShowReservationDetails(true);
  };

  return (
    <div className="table-management">
      <div className="header">
        <h1>Table Management</h1>
        <div className="table-actions">
          <div className="legend">
            <span className="status-indicator available">Available</span>
            <span className="status-indicator occupied">Occupied</span>
            <span className="status-indicator reserved">Reserved</span>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Features & Capabilities</h2>
        <div className="features-grid">
          {features.map(feature => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="tables-container">
        <div className="section">
          <h2>Indoor Tables</h2>
          <div className="tables-grid">
            {tables.slice(0, 4).map(table => (
              <div
                key={table.id}
                className={`table-item ${table.status}`}
                onClick={() => table.status === 'available' && handleTableClick(table)}
              >
                <div className="table-header">
                  <div>
                    <div className="table-number">Table {table.number}</div>
                    <div className="table-capacity">{table.capacity} seats</div>
                  </div>
                  {table.status === 'reserved' && (
                    <button 
                      className="view-details"
                      onClick={(e) => handleViewDetails(e, table)}
                    >
                      <FaEye />
                    </button>
                  )}
                </div>
                <div className="table-status">
                  {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>Outdoor Tables</h2>
          <div className="tables-grid">
            {tables.slice(4, 8).map(table => (
              <div
                key={table.id}
                className={`table-item ${table.status}`}
                onClick={() => table.status === 'available' && handleTableClick(table)}
              >
                <div className="table-header">
                  <div>
                    <div className="table-number">Table {table.number}</div>
                    <div className="table-capacity">{table.capacity} seats</div>
                  </div>
                  {table.status === 'reserved' && (
                    <button 
                      className="view-details"
                      onClick={(e) => handleViewDetails(e, table)}
                    >
                      <FaEye />
                    </button>
                  )}
                </div>
                <div className="table-status">
                  {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>VIP Tables</h2>
          <div className="tables-grid">
            {tables.slice(8, 12).map(table => (
              <div
                key={table.id}
                className={`table-item ${table.status}`}
                onClick={() => table.status === 'available' && handleTableClick(table)}
              >
                <div className="table-header">
                  <div>
                    <div className="table-number">Table {table.number}</div>
                    <div className="table-capacity">{table.capacity} seats</div>
                  </div>
                  {table.status === 'reserved' && (
                    <button 
                      className="view-details"
                      onClick={(e) => handleViewDetails(e, table)}
                    >
                      <FaEye />
                    </button>
                  )}
                </div>
                <div className="table-status">
                  {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showReservationForm && selectedTable && (
        <div className="reservation-modal">
          <div className="modal-content">
            <h2>Reserve Table {selectedTable.number}</h2>
            <div className="reservation-info-box">
              <div className="info-item">
                <span className="label">Table Capacity:</span>
                <span className="value">{selectedTable.capacity} seats</span>
              </div>
              <div className="info-item">
                <span className="label">Location:</span>
                <span className="value">
                  {selectedTable.number <= 4 ? 'Indoor' : 
                   selectedTable.number <= 8 ? 'Outdoor' : 'VIP Section'}
                </span>
              </div>
            </div>
            <form onSubmit={handleReservation}>
              <div className="form-group">
                <label>Customer Name:</label>
                <input
                  type="text"
                  value={reservationData.customerName}
                  onChange={e => setReservationData({
                    ...reservationData,
                    customerName: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time:</label>
                <input
                  type="time"
                  value={reservationData.time}
                  onChange={e => setReservationData({
                    ...reservationData,
                    time: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Number of Guests:</label>
                <input
                  type="number"
                  min="1"
                  max={selectedTable.capacity}
                  value={reservationData.guests}
                  onChange={e => setReservationData({
                    ...reservationData,
                    guests: parseInt(e.target.value)
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Special Requests:</label>
                <textarea
                  placeholder="Any special arrangements or requests..."
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <button type="submit">Confirm Reservation</button>
                <button 
                  type="button" 
                  onClick={() => setShowReservationForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReservationDetails && selectedTable?.reservation && (
        <div className="reservation-modal" onClick={() => setShowReservationDetails(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Reservation Details</h2>
            <div className="details-content">
              <div className="detail-item">
                <label>Table Number:</label>
                <span>{selectedTable.number}</span>
              </div>
              <div className="detail-item">
                <label>Customer Name:</label>
                <span>{selectedTable.reservation.customerName}</span>
              </div>
              <div className="detail-item">
                <label>Time:</label>
                <span>{selectedTable.reservation.time}</span>
              </div>
              <div className="detail-item">
                <label>Number of Guests:</label>
                <span>{selectedTable.reservation.guests}</span>
              </div>
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => {
                  handleClearTable(selectedTable.id);
                  setShowReservationDetails(false);
                }}
              >
                Clear Reservation
              </button>
              <button 
                type="button" 
                onClick={() => setShowReservationDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManagement; 