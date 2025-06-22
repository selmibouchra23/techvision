import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function AddAdmin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create the new user in Firebase Auth (the current admin will be signed out, so avoid this in production)
      const newUser = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = newUser.user;

      const adminData = {
        uid: user.uid,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: "admin",
        createdAt: serverTimestamp(),
      };

      // Add to Admins collection
      await setDoc(doc(db, "Admins", user.uid), adminData);
      // Optional: Also add to Users
      await setDoc(doc(db, "Users", user.uid), adminData);

      toast.success("Admin created successfully!");
    } catch (error) {
      console.error("Error creating admin:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 shadow-lg bg-white rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Admin</h2>
      <form onSubmit={handleAddAdmin} className="space-y-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="w-full p-3 border rounded"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="w-full p-3 border rounded"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 border rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 border rounded"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </form>
    </div>
  );
}
