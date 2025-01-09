import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface AddressForm {
 address: string;
 city: string;
 postalCode: string;
}

interface PaymentMethodForm {
 paymentType: string;
 cardNumber: string;
 expiryDate: string;
 isDefault: boolean;
}

interface SignupFormData {
 username: string;
 password: string;
 name: string;
 contact: string;
 address: AddressForm;
 paymentMethod: PaymentMethodForm;
}

const SignupForm = () => {
 const navigate = useNavigate();
 const [formData, setFormData] = useState<SignupFormData>({
   username: '',
   password: '',
   name: '',
   contact: '',
   address: {
     address: '',
     city: '',
     postalCode: ''
   },
   paymentMethod: {
     paymentType: 'CREDIT_CARD',
     cardNumber: '',
     expiryDate: '',
     isDefault: true
   }
 });

 const [error, setError] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    setFormData(prev => ({
      ...prev,
      [parent]: parent === 'address' 
        ? { ...prev.address, [child]: value }
        : { ...prev.paymentMethod, [child]: value }
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
};

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setError(null);
   setLoading(true);

   try {
     const response = await fetch('/api/auth/signup', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(formData),
     });

     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.message || 'Signup failed');
     }

     const data = await response.json();
     console.log('Signup successful:', data);
     navigate('/login');
   } catch (err) {
     setError(err instanceof Error ? err.message : 'An error occurred');
   } finally {
     setLoading(false);
   }
 };

 return (
   <div className="w-full max-w-lg mx-auto">
     <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
       <div className="mb-4">
         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
           Username
         </label>
         <input
           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
           id="username"
           type="text"
           name="username"
           value={formData.username}
           onChange={handleChange}
           required
         />
       </div>

       <div className="mb-4">
         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
           Password
         </label>
         <input
           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
           id="password"
           type="password"
           name="password"
           value={formData.password}
           onChange={handleChange}
           required
         />
       </div>

       <div className="mb-4">
         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
           Name
         </label>
         <input
           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
           id="name"
           type="text"
           name="name"
           value={formData.name}
           onChange={handleChange}
           required
         />
       </div>

       <div className="mb-4">
         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact">
           Contact
         </label>
         <input
           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
           id="contact"
           type="text"
           name="contact"
           value={formData.contact}
           onChange={handleChange}
           required
         />
       </div>

       <div className="mb-6">
         <h3 className="block text-gray-700 font-bold mb-2">Address</h3>
         <div className="grid grid-cols-1 gap-4">
           <div>
             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
               Street Address
             </label>
             <input
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               id="address"
               type="text"
               name="address.address"
               value={formData.address.address}
               onChange={handleChange}
               required
             />
           </div>
           <div>
             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
               City
             </label>
             <input
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               id="city"
               type="text"
               name="address.city"
               value={formData.address.city}
               onChange={handleChange}
               required
             />
           </div>
           <div>
             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">
               Postal Code
             </label>
             <input
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               id="postalCode"
               type="text"
               name="address.postalCode"
               value={formData.address.postalCode}
               onChange={handleChange}
               required
             />
           </div>
         </div>
       </div>

       <div className="mb-6">
         <h3 className="block text-gray-700 font-bold mb-2">Payment Method</h3>
         <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardNumber">
               Card Number
             </label>
             <input
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               id="cardNumber"
               type="text"
               name="paymentMethod.cardNumber"
               value={formData.paymentMethod.cardNumber}
               onChange={handleChange}
               required
             />
           </div>
           <div>
             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expiryDate">
               Expiry Date
             </label>
             <input
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               id="expiryDate"
               type="text"
               name="paymentMethod.expiryDate"
               placeholder="MM/YY"
               value={formData.paymentMethod.expiryDate}
               onChange={handleChange}
               required
             />
           </div>
         </div>
       </div>

       {error && (
         <div className="mb-4 text-red-500 text-sm">
           {error}
         </div>
       )}

       <div className="flex items-center justify-between">
         <button
           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
           type="submit"
           disabled={loading}
         >
           {loading ? 'Signing up...' : 'Sign Up'}
         </button>
         <Link
           to="/login"
           className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
         >
           Already have an account?
         </Link>
       </div>
     </form>
   </div>
 );
};

export default SignupForm;