import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller } from 'react-hook-form';
import { es } from 'date-fns/locale';
import { subYears } from 'date-fns';

function DatePickerInput({ control, name, label, error }) {
  const maxSelectableDate = subYears(new Date(), 18);
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Controller
        control={control}
        name={name}
        rules={{ required: 'Se requiere Fecha de Nacimiento' }}
        render={({ field }) => (
          <DatePicker
            {...field}
            selected={field.value}
            onChange={(date) => field.onChange(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona una fecha"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            locale={es}
            maxDate={maxSelectableDate} 
          />
        )}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

export default DatePickerInput;
