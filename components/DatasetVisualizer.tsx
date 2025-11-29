import React from 'react';
import { APP_DATASET } from '../constants';
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const style = {
  top: '50%',
  right: 0,
  transform: 'translate(0, -50%)',
  lineHeight: '24px',
};

export const DatasetVisualizer: React.FC = () => {
  const { stats, features, troubleshooting, faq } = APP_DATASET;

  // Prepare data for the chart, adding fill colors
  const chartData = stats.map((s, index) => ({
    name: s.name,
    uv: s.value,
    max: s.fullMark,
    fill: ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'][index % 5]
  }));

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-8 custom-scrollbar">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          {APP_DATASET.productName}
        </h2>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
          Context Data
        </p>
        <p className="text-sm text-slate-300 mt-3 leading-relaxed">
          {APP_DATASET.description}
        </p>
      </div>

      {/* Stats Chart */}
      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Status
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" barSize={10} data={chartData}>
              <RadialBar
                background
                dataKey="uv"
              />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                itemStyle={{ color: '#f1f5f9' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Features List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Capabilities</h3>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(features).map(([key, value]) => (
            <div key={key} className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
              <div className="font-semibold text-indigo-300 text-sm mb-1">{key}</div>
              <div className="text-xs text-slate-400">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Troubleshooting</h3>
        {troubleshooting.map((item, idx) => (
          <div key={idx} className="bg-slate-800/40 p-3 rounded-lg border-l-2 border-amber-500">
             <div className="font-medium text-slate-200 text-xs mb-1">Issue: {item.problem}</div>
             <div className="text-xs text-slate-400">Fix: {item.solution}</div>
          </div>
        ))}
      </div>

       {/* FAQ */}
       <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">FAQ</h3>
        {faq.map((item, idx) => (
          <div key={idx} className="bg-slate-800/40 p-3 rounded-lg border-l-2 border-cyan-500">
             <div className="font-medium text-slate-200 text-xs mb-1">Q: {item.question}</div>
             <div className="text-xs text-slate-400">A: {item.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
