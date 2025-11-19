import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Definiranje konstante statusa
const STATUS_COLORS = { 
  "Nije započeto": "#9CA3AF", 
  "Neusklađeno": "#EF4444", 
  "Djelomično": "#F59E0B", 
  "Usklađeno": "#10B981" 
};


export default function Dashboard({ data, onDataChange, isPro, onPdfExport }) {
  // 1. 💥 PROVJERA - Osigurava da je 'data' uvijek niz (array)
  const complianceData = data || []; 

  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(null);

  const total = complianceData.length;
  // Sada koristimo complianceData umjesto data
  const compliance = total > 0 ? Math.round(complianceData.filter(i => i.status === t("Usklađeno")).length / total * 100) : 0;
    
  // Podaci za Pie Chart (koristimo complianceData)
  const statusCounts = complianceData.reduce((acc, item) => {
    // Koristimo i18n key za prebrojavanje
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(STATUS_COLORS).map(statusKey => ({
    name: t(statusKey), // Prikazujemo prevedeno ime
    value: statusCounts[statusKey] || 0,
    color: STATUS_COLORS[statusKey],
    key: statusKey // Ključ za dohvaćanje boje/statusa
  })).filter(item => item.value > 0);


  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <div className="text-6xl font-bold text-blue-600">{compliance}%</div>
        <p className="text-xl text-gray-600">{t('compliance')}</p>
        {!isPro && <p className="mt-4 text-orange-600 font-bold">{t('demoLimit')}</p>}
      </div>

      {/* Grafikon */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Pregled usklađenosti po statusu</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} kontrole`, name]}/>
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
        
      {/* Lista kontrola */}
      <div className="space-y-4">
        {complianceData.map(item => ( // Koristimo complianceData
          <div key={item.id} className="bg-white rounded-xl shadow p-6 border">
            <div onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="cursor-pointer flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">{item.category}</span>
                <h3 className="text-lg font-semibold">{item.requirement}</h3>
              </div>
              <span className={`px-4 py-2 rounded-full text-white text-sm font-bold flex items-center gap-2`}
                style={{backgroundColor: STATUS_COLORS[item.status] || '#888'}}>
                {t(item.status)} {expanded === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </div>
            {/* Prošireni detalji */}
            {expanded === item.id && (
                <div className="mt-4 pt-4 border-t space-y-3">
                    <p><strong>Vlasnik:</strong> {item.owner}</p>
                    <p><strong>Prioritet:</strong> {item.priority}</p>
                    <p><strong>Bilješke:</strong> {item.notes || "Nema bilješki."}</p>
                    {/* Placeholder za promjenu statusa – Dodajte pravu logiku */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Promijeni Status:</label>
                        <select
                            value={item.status}
                            onChange={(e) => {
                                const newStatus = e.target.value;
                                const newData = data.map(d => d.id === item.id ? { ...d, status: newStatus } : d);
                                onDataChange(newData);
                            }}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            {Object.keys(STATUS_COLORS).map(s => (
                                <option key={s} value={s}>{t(s)}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button 
            onClick={onPdfExport} 
            className="bg-green-600 hover:bg-green-700 transition-colors text-white px-8 py-4 rounded-xl text-xl font-bold flex items-center gap-3 mx-auto">
          <Download /> Preuzmi PDF Izvještaj
        </button>
      </div>
    </div>
  );
}