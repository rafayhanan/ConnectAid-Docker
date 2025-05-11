import React from 'react';

const DonationFilterBar = ({ searchTerm, onSearchChange, onSortChange, selectedCategory, onCategoryChange }) => {
  const categories = ["All", "Education", "Health", "Environment", "Community"];

  return (
    <div className="filter-bar bg-white p-4 md:p-6 flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
      <input 
        type="text" 
        placeholder="Search by title..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
      />

      <select 
        onChange={e => onSortChange(e.target.value)}
        className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="recent">Most Recent</option>
        <option value="goal_asc">Goal: Low to High</option>
        <option value="goal_desc">Goal: High to Low</option>
      </select>

      <select
        value={selectedCategory}
        onChange={e => onCategoryChange(e.target.value)}
        className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {categories.map(cat => (
          <option value={cat} key={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
};

export default DonationFilterBar;
