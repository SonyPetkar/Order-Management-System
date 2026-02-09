import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ActiveOrderWidget = ({ orderId }) => {
  const navigate = useNavigate();
  if (!orderId) return null;

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileHover={{ scale: 1.1 }}
      onClick={() => navigate(`/track-order/${orderId}`)}
      className="fixed bottom-20 right-10 z-[100] cursor-grab active:cursor-grabbing"
    >
      <div className="bg-blue-600 text-white p-4 rounded-3xl shadow-2xl flex items-center gap-3 border-4 border-white">
        <span className="text-2xl animate-bounce">🛵</span>
        <div className="pr-2">
          <p className="text-[8px] font-black uppercase opacity-80 leading-none">Order Active</p>
          <p className="font-black italic text-xs uppercase tracking-tight">Track Live</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ActiveOrderWidget;