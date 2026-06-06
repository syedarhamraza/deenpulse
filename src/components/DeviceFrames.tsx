import mainAppImg from '../assets/main_app.jpeg';
import wearosImg from '../assets/wearos.jpeg';

export function MobilePhoneFrame() {
  return (
    <div className="w-[280px] h-[550px] bg-[#0c1212] rounded-[44px] border-[6px] border-white/[0.08] p-1 relative shadow-[0_25px_60px_rgba(0,10,10,0.9),0_0_1px_1px_rgba(255,255,255,0.05),inset_0_2px_4px_rgba(255,255,255,0.2)] flex flex-col overflow-hidden select-none">
      {/* Top Speaker grill & Bezel Detail */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-black rounded-full z-30" />

      {/* Screen Interface Frame */}
      <div className="flex-1 bg-[#060A0A] rounded-[36px] overflow-hidden relative border border-white/[0.03] flex flex-col">
        <img
          src={mainAppImg}
          alt="Phone screen: DeenPulse Dashboard"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export function WearOSWatchFrame() {
  return (
    <div className="w-[190px] h-[190px] rounded-full bg-gradient-to-br from-[#121616] via-[#2a3030] to-[#040606] border-[5px] border-[#252828] p-1 relative flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_2px_4px_rgba(255,255,255,0.1)] select-none">
      {/* Side crown button */}
      <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#252828] rounded-r border border-l-0 border-white/10 shadow" />
      
      {/* Inner Screen circular viewport */}
      <div className="w-full h-full rounded-full bg-black relative overflow-hidden border border-white/[0.04] flex items-center justify-center">
        <img
          src={wearosImg}
          alt="Wear OS Complication Dial"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
