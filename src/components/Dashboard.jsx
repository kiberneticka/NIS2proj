// src/components/Dashboard.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Save, 
  Trash2, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Settings 
} from 'lucide-react';

export default function Dashboard({ data = [], onDataChange, isPro, onPdfExport }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, Nije započeto, Djelomično, Usklađeno
  const [editingId, setEditingId] = useState(null);
  const [localData, setLocalData] = useState(data);
  const navigate = useNavigate();

  // Sync sa parent data
  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Filter i search
  const filteredData = useMemo(() => {
    return localData.filter(item => {
      const matchesSearch = item.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.owner.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [localData, searchTerm, filterStatus]);

  // Edit mode
  const startEdit = (id) => setEditingId(id);
  const cancelEdit = () => setEditingId(null);
  const saveEdit = (id, updatedItem) => {
    const newData = localData.map(item => item.id === id ? { ...item, ...updatedItem } : item);
    setLocalData(newData);
    setEditingId(null);
    onDataChange(newData); // Spremi u Firebase
  };

  const deleteItem = (id) => {
    if (window.confirm('Sigurno obrisati ovu kontrolu?')) {
      const newData = localData.filter(item => item.id !== id);
      setLocalData(newData);
      onDataChange(newData);
    }
  };

  // PDF Export (premium feature)
  const exportToPdf = async () => {
    const element = document.getElementById('dashboard-table');
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape za tablicu
    const imgWidth = 280;
    const pageHeight = 200;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('NIS2-Compliance-Izvjestaj.pdf');
  };

  // Progress calculation
  const progress = useMemo(() => {
    if (filteredData.length === 0) return 0;
    const completed = filteredData.filter(item => item.status === 'Usklađeno').length;
    return Math.round((completed / filteredData.length) * 100);
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/')} className="p-2 text-gray-500 hover:text-blue-600 transition">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <Shield className="w-10 h-10 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">NIS2 Dashboard</h1>
                  <p className="text-gray-600">Upravljanje usklađenošću</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isPro && (
                <button onClick={exportToPdf} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
                  <Download className="w-4 h-4" />
                  <span>PDF Izvještaj</span>
                </button>
              )}
              <button className="p-2 text-gray-500 hover:text-blue-600">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Napredak usklađenosti</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-600">{filteredData.length}/{localData.length} kontrola</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Pretraži po zahtjevu, kategoriji ili vlasniku..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Svi statusi</option>
              <option value="Nije započeto">Nije započeto</option>
              <option value="Djelomično">Djelomično</option>
              <option value="Usklađeno">Usklađeno</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" id="dashboard-table">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategorija</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zahtjev</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vlasnik</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioritet</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bilješke</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p>Nema rezultata. Pokušaj promijeniti pretragu ili filter.</p>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.category === 'A1' ? 'bg-red-100 text-red-800' :
                          item.category === 'B2' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            defaultValue={item.requirement}
                            className="w-full px-2 py-1 border rounded text-sm"
                            onBlur={(e) => saveEdit(item.id, { requirement: e.target.value })}
                          />
                        ) : (
                          <div className="text-sm font-medium text-gray-900">{item.requirement}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.owner}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.priority === 'Kritičan' ? 'bg-red-100 text-red-800' :
                          item.priority === 'Visok' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === 'Usklađeno' ? 'bg-green-100 text-green-800' :
                          item.status === 'Djelomično' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            defaultValue={item.notes}
                            className="w-full px-2 py-1 border rounded text-sm"
                            onBlur={(e) => saveEdit(item.id, { notes: e.target.value })}
                          />
                        ) : (
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={item.notes}>
                            {item.notes || 'Nema bilješki'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => editingId === item.id ? saveEdit(item.id, item) : startEdit(item.id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          {editingId === item.id ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                        </button>
                        <button onClick={() => deleteItem(item.id)} className="text-red-600 hover:text-red-900 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Kritičnih', value: localData.filter(d => d.priority === 'Kritičan').length, icon: AlertCircle, color: 'text-red-600' },
            { label: 'Započeto', value: localData.filter(d => d.status !== 'Nije započeto').length, icon: CheckCircle, color: 'text-yellow-600' },
            { label: 'Usklađeno', value: localData.filter(d => d.status === 'Usklađeno').length, icon: Shield, color: 'text-green-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-lg text-center">
              <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}