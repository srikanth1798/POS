// import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import './emp.css';

interface Employee {
  id: number;
  name: string;
  class: string;
  mark: number;
}

const employees: Employee[] = [
  { id: 1, name: "John Deo", class: "Madhukrishna@gmail.com", mark: 9014443159},
  { id: 2, name: "Max Ruin", class: "MaxRuin@gmail.com", mark: 949849823 },
  { id: 3, name: "Arnold", class: "Arnold@gmail.com", mark: 955789456 },
  { id: 4, name: "Krish Star", class: "KrishStar@gmail.com", mark: 9837467823 },
  { id: 5, name: "John Mike", class: "JohnMike@gmail.com", mark: 847827437},
  { id: 6, name: "Alex John", class: "AlexJohn@gmail.com", mark: 809484638},
  { id: 7, name: "My John Rob", class: "MyJohnRob@gmail.com", mark: 789456123},
];

export const EmployeePage: React.FC = () => {
  const navigate = useNavigate();

  const handleAssign = (employeeName: string) => {
    // Get the ticket data from localStorage
    const ticketData = localStorage.getItem('ticketToAssign');
    if (ticketData) {
      const ticket = JSON.parse(ticketData);
      
      // Update both tables' data in localStorage
      const existingTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      const newTickets = JSON.parse(localStorage.getItem('newTickets') || '[]');
      
      // Create the assigned ticket
      const assignedTicket = {
        ...ticket,
        status: 'Open',
        bootstrapColor: 'primary',
        assignedTo: employeeName
      };

      // Update localStorage
      localStorage.setItem('tickets', JSON.stringify([...existingTickets, assignedTicket]));
      localStorage.setItem('newTickets', JSON.stringify(
        newTickets.filter((t: any) => t.id !== ticket.id)
      ));

      // Clear the temporary ticket data
      localStorage.removeItem('ticketToAssign');

      // Navigate back to tickets page
      navigate('/support/ticket');
    }
  };

  return (
    <div className="employee-page">
      <div className="employee-table-container">
        <div className="card shadow">
          <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom">
            <h2 className="h5 mb-0">Assign Ticket to Employee</h2>
            <div>
              <button
                onClick={() => navigate('/support/ticket')}
                className="btn btn-link p-0"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Employee Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.id}</td>
                      <td>{employee.name}</td>
                      <td>{employee.class}</td>
                      <td>{employee.mark}</td>
                      <td>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAssign(employee.name)}
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
        </div>
      </div>
    </div>
  );
};

export default EmployeePage; 