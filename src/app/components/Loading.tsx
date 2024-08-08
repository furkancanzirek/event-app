import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="loader bg-lightGreen p-5 rounded-full flex space-x-3">
        <div className="w-3 h-3 md:w-5 md:h-5 bg-white rounded-full animate-bounce delay-[0.1s]"></div>
        <div className="w-3 h-3 md:w-5 md:h-5 bg-white rounded-full animate-bounce delay-[0.3s]"></div>
        <div className="w-3 h-3 md:w-5 md:h-5 bg-white rounded-full animate-bounce delay-[0.6s]"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
