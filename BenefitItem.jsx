import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const BenefitItem = ({ text, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-start gap-3"
    >
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
        <Check className="w-4 h-4 text-primary" />
      </div>
      <p className="text-foreground leading-relaxed">{text}</p>
    </motion.div>
  );
};

export default BenefitItem;