import { useState } from 'react';
import './ClientManagement.css';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

interface FilterState {
  segment: {
    basic: boolean;
    standard: boolean;
    premium: boolean;
  };
  serviceCategory: {
    subscription: boolean;
    consulting: boolean;
    support: boolean;
  };
  showExpiring: boolean;
  pastClients: {
    inactive: boolean;
    removed: boolean;
  };
}

export const FilterDialog = ({ isOpen, onClose, onApply }: FilterDialogProps) => {
  const [filters, setFilters] = useState<FilterState>({
    segment: {
      basic: false,
      standard: false,
      premium: false
    },
    serviceCategory: {
      subscription: false,
      consulting: false,
      support: false
    },
    showExpiring: false,
    pastClients: {
      inactive: false,
      removed: false
    }
  });

  const getActiveFilterCount = (filters: FilterState) => {
    const segmentCount = Object.values(filters.segment).filter(Boolean).length;
    const serviceCategoryCount = Object.values(filters.serviceCategory).filter(Boolean).length;
    const pastClientsCount = Object.values(filters.pastClients).filter(Boolean).length;
    const expiringCount = filters.showExpiring ? 1 : 0;
    return segmentCount + serviceCategoryCount + pastClientsCount + expiringCount;
  };

  const handleReset = () => {
    setFilters({
      segment: {
        basic: false,
        standard: false,
        premium: false
      },
      serviceCategory: {
        subscription: false,
        consulting: false,
        support: false
      },
      showExpiring: false,
      pastClients: {
        inactive: false,
        removed: false
      }
    });
  };

  const handleApply = () => {
    onApply(filters);
  };

  if (!isOpen) return null;

  return (
    <div className="filter-overlay">
      <div className="filter-dialog">
        <div className="filter-header">
          <span>Filter Clients</span>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="filter-content">
          <div className="filter-section">
            <div className="section-title">Segment</div>
            <label className="checkbox-label">
              <input type="checkbox" checked={filters.segment.basic}
                onChange={e => setFilters(prev => ({
                  ...prev,
                  segment: { ...prev.segment, basic: e.target.checked }
                }))}
              />
              <span>Basic</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={filters.segment.standard}
                onChange={e => setFilters(prev => ({
                  ...prev,
                  segment: { ...prev.segment, standard: e.target.checked }
                }))}
              />
              <span>Standard</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={filters.segment.premium}
                onChange={e => setFilters(prev => ({
                  ...prev,
                  segment: { ...prev.segment, premium: e.target.checked }
                }))}
              />
              <span>Premium</span>
            </label>
          </div>

          <div className="filter-section">
            <div className="section-title">Services</div>
            <label className="checkbox-label">
              <input type="checkbox" checked={filters.serviceCategory.subscription}
                onChange={e => setFilters(prev => ({
                  ...prev,
                  serviceCategory: { ...prev.serviceCategory, subscription: e.target.checked }
                }))}
              />
              <span>Subscription</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={filters.serviceCategory.consulting}
                onChange={e => setFilters(prev => ({
                  ...prev,
                  serviceCategory: { ...prev.serviceCategory, consulting: e.target.checked }
                }))}
              />
              <span>Consulting</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={filters.serviceCategory.support}
                onChange={e => setFilters(prev => ({
                  ...prev,
                  serviceCategory: { ...prev.serviceCategory, support: e.target.checked }
                }))}
              />
              <span>Support</span>
            </label>
          </div>

          <div className="filter-section">
            <div className="section-title">Show Expiring</div>
            <label className="checkbox-label">
              <input type="checkbox" checked={filters.showExpiring}
                onChange={e => setFilters(prev => ({
                  ...prev,
                  showExpiring: e.target.checked
                }))}
              />
              <span>Show Expiring</span>
            </label>
          </div>

          <div className="filter-section">
            <div className="section-title">Past Clients</div>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={filters.pastClients.inactive}
                onChange={e => setFilters(prev => ({
                  ...prev,
                  pastClients: { 
                    ...prev.pastClients, 
                    inactive: e.target.checked 
                  }
                }))}
              />
              <span>Inactive Clients</span>
            </label>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={filters.pastClients.removed}
                onChange={e => setFilters(prev => ({
                  ...prev,
                  pastClients: { 
                    ...prev.pastClients, 
                    removed: e.target.checked 
                  }
                }))}
              />
              <span>Removed Clients</span>
            </label>
          </div>
        </div>

        <div className="filter-actions">
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
          <button className="apply-button" onClick={handleApply}>
            Apply {getActiveFilterCount(filters) > 0 && `(${getActiveFilterCount(filters)})`}
          </button>
        </div>
      </div>
    </div>
  );
}; 