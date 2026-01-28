/* eslint-disable react-hooks/purity */
import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  CheckCircle,
  User,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";

export const BookingModal = ({ room, user, onClose, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Validation Error State

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: `${user.name.toLowerCase().replace(" ", ".")}@example.com`,
        phone: "555-0123",
      });
    }
  }, [user]);

  // Validate Step 1 before moving to Step 2
  const handleNextStep = () => {
    setError("");

    // Basic Validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setError("Please fill in all contact details to proceed.");
      return;
    }

    // Simple Email Regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setStep(2);
  };

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 2000);
  };

  const handleFinalize = () => {
    onConfirm(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <Card className="w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800">
            {step === 1
              ? "Contact Details"
              : step === 2
              ? "Payment"
              : "Confirmed"}
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-red-500" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6">
              {/* Room Summary */}
              <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <img
                  src={room.image}
                  className="w-20 h-20 rounded-lg object-cover shadow-sm"
                  alt="Room"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{room.name}</h4>
                  <p className="text-blue-600 font-bold">
                    ${room.price}{" "}
                    <span className="text-gray-400 text-xs font-normal">
                      / night
                    </span>
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center animate-pulse">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              {/* Input Fields */}
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setError("");
                    }}
                    readOnly={!!user}
                    className={`w-full pl-10 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      user
                        ? "bg-gray-100 cursor-not-allowed border-transparent"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setError("");
                    }}
                    readOnly={!!user}
                    className={`w-full pl-10 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      user
                        ? "bg-gray-100 cursor-not-allowed border-transparent"
                        : "border-gray-200"
                    }`}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      setError("");
                    }}
                    className="w-full pl-10 p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <Button onClick={handleNextStep} className="w-full py-3 text-lg">
                {user ? "Confirm Details" : "Continue to Payment"}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-6">
              {loading ? (
                <div className="py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="font-medium text-gray-600">
                    Processing Secure Transaction...
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Amount Due</p>
                    <p className="font-bold text-3xl text-gray-900">
                      ${room.price * 2}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-left space-y-3">
                    <input
                      placeholder="Card Number"
                      className="w-full p-3 bg-white border border-gray-200 rounded-lg"
                    />
                    <div className="flex gap-3">
                      <input
                        placeholder="MM/YY"
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg"
                      />
                      <input
                        placeholder="CVC"
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handlePay}
                      className="flex-[2] py-3 text-lg"
                    >
                      Pay Now
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Booking Confirmed!
                </h3>
                <p className="text-gray-500 mt-2">
                  Your Reservation ID is{" "}
                  <span className="font-mono font-bold text-gray-900">
                    #RES-{Math.floor(Math.random() * 1000)}
                  </span>
                </p>
              </div>
              <Button onClick={handleFinalize} className="w-full py-3">
                Done
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
