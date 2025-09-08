
import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const BarcodeScanner = ({ onScanSuccess, onScanError }) => {
    const scannerRef = useRef(null);

    useEffect(() => {
        if (!scannerRef.current) {
            return;
        }

        const html5QrcodeScanner = new Html5QrcodeScanner(
            scannerRef.current.id,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        const handleScanSuccess = (decodedText, decodedResult) => {
            html5QrcodeScanner.clear();
            onScanSuccess(decodedText, decodedResult);
        };

        const handleScanError = (errorMessage) => {
            // handle scan error, usually you want to ignore it.
            if (onScanError) {
                onScanError(errorMessage);
            }
        };

        html5QrcodeScanner.render(handleScanSuccess, handleScanError);

        // Cleanup function to stop the scanner when the component unmounts
        return () => {
            if (html5QrcodeScanner) {
                html5QrcodeScanner.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner.", error);
                });
            }
        };
    }, [onScanSuccess, onScanError]);

    return <div id="barcode-scanner" ref={scannerRef} />;
};

export default BarcodeScanner;
