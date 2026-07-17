import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { ShieldCheck, BarChart4, FileSearch, ArrowRight, PlayCircle, Bot, Zap, Database } from 'lucide-react';
import { motion } from 'motion/react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: FileSearch, title: 'Document Intelligence', desc: 'Automatically classify and extract tabular data, transactions, and entities from uploads.' },
    { icon: BarChart4, title: 'Business Intelligence', desc: 'Generate KPIs, trend analysis, and variance heatmaps instantly.' },
    { icon: ShieldCheck, title: 'Risk Assessment', desc: 'Compare documents against RCMs to spot weak controls and missing evidence.' },
    { icon: Database, title: 'Enterprise Memory', desc: 'Recall historical findings and escalation paths across prior audits.' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="z-10 container max-w-5xl mx-auto px-6 pt-24 pb-12 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground mb-8"
        >
          <Bot className="h-4 w-4 text-primary" />
          <span>Enterprise Proof of Concept v1.0</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl"
        >
          Autonomous Decision Intelligence for <span className="text-primary">Internal Audit</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
        >
          Reduce weeks of manual audit work into minutes using AI-powered document intelligence, analytics, compliance validation, and executive reporting.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-4"
        >
          <Button size="lg" onClick={() => navigate('/dashboard')} className="gap-2">
            Start New Audit <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <PlayCircle className="h-4 w-4" /> Explore Demo
          </Button>
        </motion.div>
      </div>

      <div className="z-10 container max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.4 }}
              className="p-6 rounded-xl bg-card border border-border/50 flex flex-col items-start text-left"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
