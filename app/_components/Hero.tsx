import React from 'react';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className="bg-black text-white py-20 text-center">
      <h1 className="text-7xl font-normal max-w-4xl mx-auto mb-6">
        The complete platform for trusted AI customer support
      </h1>
      <p className="text-gray-400 max-w-3xl mx-auto mb-8">
        Resolve support issues accurately with AI trained on your knowledge and workflows. Then, get
        reports on top support topics of the week to focus on what matters most to your customers.
      </p>
      <Link
        href="/contact-sales"
        className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 inline-flex items-center"
      >
        Contact sales →
      </Link>
      <p className="text-gray-500 mt-4">100,000+ tasks automated</p>
    </div>
  );
};

export default Hero; 