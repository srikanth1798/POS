import React, { useState, useEffect } from 'react';
import { Download, Search, MoreHorizontal, MoreVertical, Edit2, ChevronDown } from 'lucide-react';
import './Ticket.css';
import { useNavigate } from 'react-router-dom';

// Types
interface Ticket {
  id: string;
  type: string;
  date: string;
  status: string;
  bootstrapColor: string;
  assignedTo?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

// Initial data
const initialTickets: Ticket[] = [
  {
    id: 'Madhu',
    type: 'Login Issue',
    date: '20/01/2023',
    status: 'open',
    bootstrapColor: 'purple',
    assignedTo: 'Madhu'
  },
  {
    id: 'Krishna',
    type: 'Payment Issue',
    date: '25/01/2023',
    status: 'Solved',
    bootstrapColor: 'success',
    assignedTo: 'Krishna'
  },
  {
    id: 'Shashi',
    type: 'Service Issue',
    date: '23/01/2023',
    status: 'Open',
    bootstrapColor: 'primary',
    assignedTo: 'Shashi'
  },
  {
    id: 'Kiran',
    type: 'Order Issue',
    date: '23/01/2023',
    status: 'Pending',
    bootstrapColor: 'danger',
    assignedTo: 'Kiran'
  }
];

const initialNewTickets: Ticket[] = [
  {
    id: 'Madhu',
    type: 'Login Issue',
    date: '20/01/2023',
    status: 'New',
    bootstrapColor: 'success',
  },
  {
    id: 'Krishna',
    type: 'Payment Issue',
    date: '25/01/2023',
    status: 'New',
    bootstrapColor: 'success'
  },
];

const faqs: FAQ[] = [
  {
    question: 'What is a POS system?',
    answer: 'A Point of Sale (POS) system is a combination of hardware and software that allows businesses to complete sales transactions, manage inventory, track customer data, and generate reports.'
  },
  {
    question: 'Who can use this POS system? ',
    answer: 'Our POS system is designed for small to medium-sized businesses, including retail stores, restaurants, cafes, and service providers'
  },
  {
    question: 'Is the POS system compatible with my existing hardware? ',
    answer: 'Our POS system is compatible with most standard hardware such as barcode scanners, receipt printers, and cash drawers. Please refer to our compatibility guide for details or contact support.'
  },
  {
    question: 'How do I set up the POS system? ',
    answer: 'Setting up the POS system involves installing the software, connecting hardware devices, and configuring settings. We provide step-by-step instructions in our setup guide and offer remote assistance if needed'
  }
];

export const TicketPSX: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('new');
  const [selectedPriority, setSelectedPriority] = useState('low');
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [newTickets, setNewTickets] = useState<Ticket[]>(initialNewTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Update state management to use localStorage
  useEffect(() => {
    const storedTickets = localStorage.getItem('tickets');
    const storedNewTickets = localStorage.getItem('newTickets');
    
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets));
    } else {
      localStorage.setItem('tickets', JSON.stringify(initialTickets));
    }
    
    if (storedNewTickets) {
      setNewTickets(JSON.parse(storedNewTickets));
    } else {
      localStorage.setItem('newTickets', JSON.stringify(initialNewTickets));
    }
  }, []);

  // Update the status change handler
  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    
    if (selectedTicket) {
      // Update the ticket in the tickets array
      const updatedTickets = tickets.map(ticket => {
        if (ticket.id === selectedTicket.id) {
          // Update the status and bootstrap color
          const bootstrapColor = getBootstrapColor(newStatus);
          return {
            ...ticket,
            status: newStatus,
            bootstrapColor
          };
        }
        return ticket;
      });

      // Update the tickets state and localStorage
      setTickets(updatedTickets);
      localStorage.setItem('tickets', JSON.stringify(updatedTickets));

      // Update the selected ticket
      setSelectedTicket({
        ...selectedTicket,
        status: newStatus,
        bootstrapColor: getBootstrapColor(newStatus)
      });
    }
  };

  // Helper function to get bootstrap color based on status
  const getBootstrapColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'primary';
      case 'open':
        return 'warning';
      case 'pending':
        return 'info';
      case 'solved':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const handleSearch = () => {
    // Search in both tickets and newTickets
    const allTickets = [...tickets, ...newTickets];
    const foundTicket = allTickets.find(
      ticket => ticket.id.toLowerCase() === searchQuery.toLowerCase()
    );

    if (foundTicket) {
      setSelectedTicket(foundTicket);
      setSelectedStatus(foundTicket.status);
      setShowTicketDetails(true);
    }
    
    // Clear the search input after submission
    setSearchQuery('');
  };

  const TicketSearch = () => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
    };

    return (
      <div className="col-md-6">
        <label className="form-label fs-4">Search Ticket</label>
        <div className="position-relative mb-3">
          <input
            type="text"
            className="form-control ps-5"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <Search 
            className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" 
            size={20} 
          />
        </div>
        <button 
          className="btn btn-primary px-4"
          onClick={handleSearch}
          type="button"
        >
          Submit
        </button>
      </div>
    );
  };

  const TicketContent = () => (
    <div className="col-lg-8">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <h1 className="h4 mb-0">{selectedTicket?.type || 'No Subject'}</h1>
            <button className="btn btn-link p-0">
              <MoreVertical size={20} className="text-secondary" />
            </button>
          </div>

          <p className="text-secondary mb-4">
            I updated all the plugins and the site theme yesterday, and since then the site has been
            loading very slowly. Some pages are not even loading properly.
          </p>

          <div className="mb-4">
            <div className="text-secondary">
              Site URL: <a href="#" className="text-primary">https://mywebsite.com</a>
            </div>
          </div>

          <Attachments />
          <Replies />
        </div>
      </div>
    </div>
  );

  const Attachments = () => (
    <div className="mb-4">
      <h3 className="h6 mb-3">Attachments (2)</h3>
      <div className="row g-3">
        <div className="col-auto">
          <div className="border rounded p-3">
            <div>home.png</div>
            <small className="text-secondary">116.7 KB</small>
          </div>
        </div>
        <div className="col-auto">
          <div className="border rounded p-3">
            <div>contact.png</div>
            <small className="text-secondary">116.7 KB</small>
          </div>
        </div>
      </div>
    </div>
  );

  const Replies = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="h6 mb-0">Replies (1)</h3>
        <button className="btn btn-link p-0">Reply</button>
      </div>

      <div className="border-top pt-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex">
            <div className="rounded-circle bg-secondary me-3" style={{ width: '32px', height: '32px' }}></div>
            <div>
              <div className="fw-medium">
                <h5>{selectedTicket?.assignedTo || 'Unassigned'}</h5>
              </div>
              <small className="text-secondary">August 15, 2024 at 10:45 am</small>
            </div>
          </div>
          <button className="btn btn-link p-0">
            <Edit2 size={16} className="text-secondary" />
          </button>
        </div>

        <div className="ps-5">
          <p>Hi there,</p>
          <p>
            We've identified the issue with your site. It appears that the cache wasn't cleared after the
            plugin updates, which caused some pages to appear broken.
          </p>
          <p>
            I've cleared the cache for you, and both the Home page and Contact Us page now seem to
            be working fine. Please check the site on your end.
          </p>
        </div>

        <div className="mb-3 mt-4">
          <label className="form-label"><b>Reply</b></label>
          <textarea className="form-control" rows={3}></textarea>
          <button className="btn btn-primary mt-2">Send</button>
        </div>
      </div>
    </div>
  );

  const TicketDetails = () => (
    <div className="col-lg-4">
      <div className="ticket-details p-2">
        <div className="rounded-lg shadow-sm p-14">
          <h2 className="text-lg font-medium mb-4">Ticket Details</h2>
          
          <div className="reported-by">
            <p><b>Reported by</b></p>
            <p>{selectedTicket?.id || 'N/A'}</p>
          </div>

          <div className="created-on">
            <div><b>Created on</b></div>
            <div>{selectedTicket?.date || 'N/A'}</div>
          </div>
          
          <hr/>
          
          <div className="status">
            <div><b>Status</b></div>
            <select
              className="form-select"
              value={selectedTicket?.status || selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="new">New</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="solved">Solved</option>
            </select>
          </div>

          <div className="priority">
            <div><b>Priority</b></div>
            <select
              className="form-select"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="assigned-too">
            <div><b>Assigned to</b></div>
            <div>{selectedTicket?.assignedTo || 'Unassigned'}</div>
          </div>

          <div className="email-notifications">
            <div><b>Email notifications</b></div>
            <input type="checkbox" className="form-check-input" id="emailNotifications"/>
          </div>
        </div>
      </div>
    </div>
  );

  const NewHistoryTable = () => (
    <>
      {/* Latest Tickets Section */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-2">Latest Tickets</h2>
              <p className="text-muted">New and unassigned tickets</p>
            </div>
            <button className="btn btn-link text-decoration-none d-flex align-items-center gap-2">
              <Download size={20} />
              Export
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Request</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.type}</td>
                  <td>{ticket.date}</td>
                  <td className={`text-${ticket.bootstrapColor}`}>{ticket.status}</td>
                  <td>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        // Store the ticket data in localStorage before navigation
                        localStorage.setItem('ticketToAssign', JSON.stringify(ticket));
                        navigate('/employees');
                      }}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const HistoryTable = () => (
    <>
    {/* Support History Section */}
    <div className="card mb-4">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 mb-2">Support History</h2>
          <p className="text-muted">Here is your most recent history</p>
        </div>
        <button className="btn btn-link text-decoration-none d-flex align-items-center gap-2">
          <Download size={20} />
          Export
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Request</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.type}</td>
              <td>{ticket.date}</td>
              <td className={`text-${ticket.bootstrapColor}`}>
                {ticket.status}
              </td>
              <td>{ticket.assignedTo}</td>
              <td>
                <button 
                  className="btn btn-link"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setSelectedStatus(ticket.status);
                    setShowTicketDetails(true);
                  }}
                >
                  <MoreHorizontal size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</>
        );

  const FAQSection = () => (
    <div className="card">
      <div className="card-body">
        <h2 className="h4 mb-4">Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="card mb-2">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center cursor-pointer">
                <h3 className="h6 mb-0">{faq.question}</h3>
                <ChevronDown size={20} className="text-muted" />
              </div>
              <p className="text-muted mt-2 mb-0">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>  
    </div>
  );

  const BackButton = () => (
    <button 
      className="btn btn-link p-0 mb-3" 
      onClick={() => setShowTicketDetails(false)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
      </svg>
    </button>
  );

  return (
    <div className="ticket-page">
      <div className="container">
        <div className="row mt-4">
          {showTicketDetails ? (
            <>
              <div className="d-flex align-items-center mb-3">
                <BackButton />
              </div>
              <TicketContent />
              <TicketDetails />
            </>
          ) : (
            <div className="col-12">
              <TicketSearch />
              <br />
              <NewHistoryTable />
              <br />
              <HistoryTable />
              <br />
              <FAQSection />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketPSX; 