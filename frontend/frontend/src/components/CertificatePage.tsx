import React from 'react';
import { useLocation } from 'react-router-dom';
import { Award } from 'lucide-react';

interface Certificate {
  event: string;
  date: string;
  issuer: string;
}

export default function CertificatePage() {
  const location = useLocation();
  const { cert } = location.state as { cert: Certificate };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Certificate Container */}
      <div
        className="relative bg-white p-8 rounded-lg shadow-lg text-center max-w-2xl mx-auto"
        style={{
          border: '4px solid #f3e5ab',
          backgroundImage: "url('https://www.transparenttextures.com/patterns/old-wall.png')",
        }}
      >
        {/* Header Section */}
        <div className="mb-6">
          <Award className="w-20 h-20 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-indigo-800">Certificate of Appreciation</h1>
          <p className="text-lg text-gray-600 mt-2">For Outstanding Contribution</p>
        </div>

        {/* Main Content */}
        <div className="mt-6">
          <p className="text-xl text-gray-700">
            This is to certify that{' '}
            <strong className="text-indigo-800 font-semibold">{cert.event}</strong> was successfully
            completed on{' '}
            <strong className="text-indigo-800 font-semibold">{cert.date}</strong>.
          </p>
          <p className="text-gray-600 mt-4">
            Issued by <strong className="text-indigo-800 font-semibold">{cert.issuer}</strong>
          </p>
        </div>

        {/* Decorative Footer with Seal */}
        <div className="mt-8 flex justify-center">
          <img
            src="https://static.wixstatic.com/media/0868f8_36732a75251c4c6baeccacc84a396710~mv2.jpg/v1/fit/w_2500,h_1330,al_c/0868f8_36732a75251c4c6baeccacc84a396710~mv2.jpg"
            alt="Certificate Seal"
            className="w-48 h-48 object-cover rounded-lg"
          />
        </div>

        {/* Signature Section */}
        <div className="mt-8">
          <hr className="border-t-2 border-gray-300 w-1/2 mx-auto" />
          <p className="text-lg text-gray-700 mt-2">John David</p>
          <p className="text-sm text-gray-600">Director, {cert.issuer}</p>
        </div>
      </div>
    </div>
  );
}