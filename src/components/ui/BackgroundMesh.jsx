import { motion } from "framer-motion";

export default function BackgroundMesh() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none mesh-gradient">
      {/* Dynamic Orbs */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0], 
          y: [0, -50, 0],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-[120px]"
      />
      <motion.div 
        animate={{ 
          x: [0, -80, 0], 
          y: [0, 100, 0],
          scale: [1, 1.3, 1] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-secondary/10 blur-[100px]"
      />
      <motion.div 
        animate={{ 
          x: [0, 50, 0], 
          y: [0, 50, 0],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[50%] left-[45%] w-[20vw] h-[20vw] rounded-full bg-purple-500/10 blur-[80px]"
      />
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
