import React from 'react';
import { motion } from 'framer-motion';

const StepCard = ({ number, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex gap-6 items-start"
    >
      <div className="flex-shrink-0">
        <span className="text-6xl font-bold text-primary/20" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {number}
        </span>
      </div>
      <div className="flex-1 pt-2">
        <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export default StepCard;