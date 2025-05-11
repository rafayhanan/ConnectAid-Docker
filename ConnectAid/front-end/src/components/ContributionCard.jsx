import React from "react";

const ContributionCard = ({ contribution }) => {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 text-blue-600">
            {contribution.donationAppeal.title}
          </h3>
          <div className="text-gray-600 mb-4">
            <p className="text-sm">Amount: <span className="font-medium">PKR {contribution.amount}</span></p>
            <p className="text-sm">Date: <span className="font-medium">{new Date(contribution.createdAt).toLocaleDateString()}</span></p>
            <p className="text-sm">Status: <span className={`font-medium capitalize ${contribution.status === 'completed' ? 'text-green-600' : 'text-gray-600'}`}>
              {contribution.status}
            </span></p>
          </div>
          {contribution.message && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md border-l-4 border-blue-600">
              <p className="text-sm italic">{contribution.message}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

export default ContributionCard;