import React, { useEffect } from "react";
import Quagga from "@ericblade/quagga2";

const BarcodeScanner = () => {
  const startScanner = async () => {
    if (
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function"
    ) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        Quagga.init(
          {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              constraints: {
                facingMode: "environment",
              },
              target: document.querySelector("#interactive"),
              constraints: {
                video: {
                  width: { min: 640 },
                  height: { min: 480 },
                },
              },
              area: {
                // defines rectangle of the detection/localization area
                top: "0%", // top offset
                right: "0%", // right offset
                left: "0%", // left offset
                bottom: "0%", // bottom offset
              },
            },
            locate: true,
            decoder: {
              readers: ["upc_reader", "code_128_reader"],
            },
          },
          function (err) {
            if (err) {
              console.log(err);
              return;
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
          }
        );
        Quagga.onDetected((data) => {
          let countDecodedCodes = 0;
          let err = 0;
          for (let id in data.codeResult.decodedCodes) {
            let error = data.codeResult.decodedCodes[id];
            if (error.error != undefined) {
              countDecodedCodes++;
              err += parseFloat(error.error);
            }
          }
          if (err / countDecodedCodes < 0.1) {
            console.log(data.codeResult.code);
            Quagga.stop();
          } else {
            console.log("Error: probably wrong code");
          }
        });
      } catch (err) {
        console.log("Camera permissions error: " + err);
      }
    } else {
      console.log("getUserMedia function is not available in this browser.");
    }
  };

  const stopScanner = () => {
    Quagga.stop();
  };

  useEffect(() => {
    startScanner();
    return stopScanner;
  }, []);

  return <div id="interactive" className="viewport"></div>;
};

export default BarcodeScanner;
