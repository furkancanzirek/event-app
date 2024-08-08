import React from "react";
import LoadingSpinner from "@/app/components/Loading";
import Banner from "@/app/components/ui/Banner";
const Loading = () => {
  return (
    <div>
      <Banner
        title="Discount on every ticket purchase"
        description="Get 50% off on your ticket purchase"
      />
      <LoadingSpinner />
    </div>
  );
};

export default Loading;
