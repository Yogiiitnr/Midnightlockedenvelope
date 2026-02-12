import { useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  data?: string;
  onGenerate?: (dataURL: string) => void;
}

export function QRCodeGenerator({ data: initialData, onGenerate }: QRCodeGeneratorProps) {
  const [inputData, setInputData] = useState(initialData || '');
  const [qrDataURL, setQrDataURL] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    if (!inputData.trim()) return;

    setLoading(true);
    try {
      const dataURL = await QRCode.toDataURL(inputData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#8b5cf6',
          light: '#ffffff',
        },
      });
      setQrDataURL(dataURL);
      onGenerate?.(dataURL);
    } catch (error) {
      console.error('QR generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataURL) return;
    
    const link = document.createElement('a');
    link.download = 'htlc-qr-code.png';
    link.href = qrDataURL;
    link.click();
  };

  return (
    <div className="space-y-5 scale-in">
      <div className="glass rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 aurora-text">QR Code Generator</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Data to Encode:</label>
            <textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="Enter hash, secret, transaction ID, or any data..."
              className="w-full p-3 rounded-lg glass border border-purple-500/30 focus:border-purple-500 outline-none transition-all"
              rows={4}
            />
          </div>

          <button
            onClick={generateQR}
            disabled={loading || !inputData.trim()}
            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? '⏳ Generating...' : '✨ Generate QR Code'}
          </button>
        </div>

        {qrDataURL && (
          <div className="mt-6 text-center fade-in">
            <div className="inline-block p-4 glass rounded-2xl">
              <img src={qrDataURL} alt="QR Code" className="mx-auto rounded-lg" />
            </div>
            
            <button
              onClick={downloadQR}
              className="mt-4 py-2 px-6 rounded-lg glass border border-purple-500/30 font-semibold hover:scale-105 transition-transform"
            >
              💾 Download QR Code
            </button>
            
            <div className="mt-2 text-sm opacity-70">
              Scan this code to share envelope information
            </div>
          </div>
        )}
      </div>

      <div className="glass rounded-2xl p-4 holographic text-sm opacity-80">
        <div className="flex items-start gap-2">
          <span>💡</span>
          <div>
            <strong>Pro Tip:</strong> Generate QR codes for secrets or hashes to easily share with others. 
            Receivers can scan the code instead of manually copying long strings.
          </div>
        </div>
      </div>
    </div>
  );
}
