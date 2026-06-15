import React, { useState, useEffect, useRef } from 'react';
import { RefreshCcw } from 'lucide-react';

interface CaptchaCustomProps {
  onVerify: (isValid: boolean) => void;
}

export const CaptchaCustom: React.FC<CaptchaCustomProps> = ({ onVerify }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    setUserInput('');
    onVerify(false);
    drawCaptcha(text);
  };

  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgba(0,0,0, ${Math.random() * 0.4})`;
      ctx.lineWidth = Math.random() * 2;
      ctx.stroke();
    }

    for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,0,0, ${Math.random() * 0.3})`;
        ctx.fill();
    }

    ctx.font = 'bold 22px "JetBrains Mono", monospace, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((Math.random() - 0.5) * 0.2);
    
    const letterSpacing = 16;
    const startX = -((text.length - 1) * letterSpacing) / 2;
    for(let i=0; i<text.length; i++) {
        ctx.save();
        ctx.translate(startX + i * letterSpacing, (Math.random() - 0.5) * 8);
        ctx.rotate((Math.random() - 0.5) * 0.4);
        ctx.fillText(text[i], 0, 0);
        ctx.restore();
    }
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserInput(val);
    onVerify(val === captchaText);
  };

  return (
    <div className="flex flex-col gap-2 p-3 border border-slate-300 rounded-lg bg-slate-50 mt-1">
      <label className="text-xs font-medium text-slate-700">Verifikasi Keamanan (Captcha)</label>
      <div className="flex items-center gap-3">
        <canvas ref={canvasRef} width="140" height="40" className="border border-slate-200 rounded bg-white shadow-sm" />
        <button type="button" onClick={generateCaptcha} className="p-2 text-slate-500 hover:text-navy hover:bg-slate-200 rounded-md transition-colors cursor-pointer" title="Refresh Captcha">
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>
      <input 
        type="text" 
        value={userInput}
        onChange={handleChange}
        placeholder="Ketik huruf/angka di atas"
        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple/50 transition-all text-navy"
        required
      />
    </div>
  );
};
