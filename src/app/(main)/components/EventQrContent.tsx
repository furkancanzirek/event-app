import React from "react";
import { useQRCode } from "next-qrcode";
interface Props {}

const EventQrContent = (props: Props) => {
  const { Canvas } = useQRCode();
  return (
    <div className="flex justify-center items-center">
      <Canvas
        text={"https://github.com/bunlong/next-qrcode"}
        options={{
          errorCorrectionLevel: "M",
          margin: 3,
          scale: 4,
          width: 400,
          color: {
            dark: "#000000FF",
            light: "#2DC44D",
          },
        }}
      />
    </div>
  );
};

export default EventQrContent;
