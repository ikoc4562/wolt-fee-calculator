"use client"
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FormData {
  cartValue: number;
  deliveryDistance: number;
  amountOfItems: number;
  time: Date;
}

const DeliveryForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    cartValue: 0,
    deliveryDistance: 0,
    amountOfItems: 1,
    time: new Date(),
  });
  const [deliveryPrice, setDeliveryPrice] = useState<number | null>(null);

  // Function to handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const numericValue = parseInt(value, 10); // Convert string to integer
    setFormData((prevData) => ({
      ...prevData,
      [name]: numericValue,
    }));
  };

  // Function to handle date changes
  const handleDateChange = (date: Date | null): void => {
    setFormData((prevData) => ({
      ...prevData,
      time: date || new Date(),
    }));
  };

  // Function to calculate delivery price
  const calculateDeliveryPrice = () => {
    const basePrice = 2; // Base delivery price
    let deliveryFee = basePrice;

    // Small order fee
    if (formData.cartValue < 10) {
      const smallOrderFee = 10 - formData.cartValue;
      deliveryFee += smallOrderFee;
    }

    // Additional fee for delivery distance
    const additionalDistance = formData.deliveryDistance - 1000;
    if (additionalDistance > 0) {
      const additionalFee = Math.ceil(additionalDistance / 500);
      deliveryFee += additionalFee;
    }

      // Additional fee for number of items
    if (formData.amountOfItems >= 5) {
      const additionalSurcharge = (formData.amountOfItems - 4) * 0.5; // Calculate additional surcharge for each item above the fifth
      const bulkFee = formData.amountOfItems > 12 ? 1.20 : 0; // Check if bulk fee applies for more than 12 items
      
      const itemFee = additionalSurcharge + bulkFee; // Combine additional surcharge and bulk fee
      deliveryFee += itemFee; // Add item fee to delivery fee
    }

    // Maximum fee constraint
    if (deliveryFee > 15) {
      deliveryFee = 15;
    }

    // Apply price coefficient on Fridays between 15:00-17:00
    const day = formData.time.getDay(); // Day of the week (0=Sunday, 1=Monday, ..., 6=Saturday)
    const hour = formData.time.getHours(); // Hour of the day (0-23)
    if (day === 5 && hour >= 15 && hour < 17) {
      deliveryFee *= 1.2; // 1.2x price coefficient
      if (deliveryFee > 15) {
        deliveryFee = 15;
      }
    }

    setDeliveryPrice(deliveryFee);
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-center mt-8">Wolt Delivery Fee Calculator</h1>
      {/* Form */}
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Form fields */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cartValue">
            Cart Value
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="cartValue"
            type="number"
            placeholder="Cart Value"
            name="cartValue"
            min="0" 
            value={formData.cartValue}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deliveryDistance">
            Delivery Distance
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="deliveryDistance"
            type="number"
            placeholder="Delivery Distance"
            name="deliveryDistance"
            min="0" 
            value={formData.deliveryDistance}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amountOfItems">
            Amount of Items
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="amountOfItems"
            type="number"
            placeholder="Amount of Items"
            name="amountOfItems"
            value={formData.amountOfItems}
            min="1" 
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
            Time
          </label>
          <DatePicker
            selected={formData.time}
            onChange={handleDateChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="time"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select Time"
          />
        </div>
        {/* Button to calculate delivery price */}
        <div className="mb-6 text-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={calculateDeliveryPrice}
          >
            Calculate Delivery Price
          </button>
        </div>
        {/* Display delivery price */}
        {deliveryPrice !== null && (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Delivery Price</label>
            <p className="text-gray-700">{deliveryPrice.toFixed(2)} €</p>
          </div>
        )}
      </form>
           {/* JSON data */}
           {deliveryPrice !== null && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2"> (JSON Datas)</h2>
          <pre className="bg-gray-200 p-4">{JSON.stringify({ formData }, null, 2)}</pre>
          
          <pre className="bg-gray-200 p-4">{JSON.stringify({ deliveryPrice }, null, 2)}</pre>
        </div>
      )}
      {/* Footer */}
     <span className="text-right text-gray-400 mt-4">Made by Isa Koc</span>
     </div>
     
  );
};

export default DeliveryForm;

