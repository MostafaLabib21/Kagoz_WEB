import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

const VariantBuilder = ({ variants = [], onChange }) => {
  const addVariant = () => {
    onChange([...variants, { label: '', value: '', priceModifier: 0 }]);
  };

  const updateVariant = (idx, field, val) => {
    const updated = variants.map((v, i) =>
      i === idx ? { ...v, [field]: field === 'priceModifier' ? parseFloat(val) || 0 : val } : v
    );
    onChange(updated);
  };

  const removeVariant = (idx) => {
    onChange(variants.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <p className="text-xs text-gray-500 mb-2">Add variants for size, colour, paper weight, etc.</p>
      {variants.length > 0 && (
        <div className="border rounded-lg overflow-hidden mb-2">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-gray-600">Label</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">Value</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">Price +৳</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-2 py-1.5">
                    <input value={v.label} onChange={(e) => updateVariant(idx, 'label', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm" placeholder="Size" />
                  </td>
                  <td className="px-2 py-1.5">
                    <input value={v.value} onChange={(e) => updateVariant(idx, 'value', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm" placeholder="A4" />
                  </td>
                  <td className="px-2 py-1.5">
                    <input type="number" step="0.01" value={v.priceModifier}
                      onChange={(e) => updateVariant(idx, 'priceModifier', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm" />
                  </td>
                  <td className="px-2 py-1.5">
                    <button onClick={() => removeVariant(idx)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={addVariant}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg py-2 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 flex items-center justify-center gap-2">
        <PlusCircle size={16} /> Add Variant
      </button>
    </div>
  );
};

export default VariantBuilder;
