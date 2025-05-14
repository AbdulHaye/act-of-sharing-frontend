"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CreditCard, Heart } from "lucide-react"

interface DonationFormProps {
  eventId: string
  organizationName?: string
}

const DonationForm: React.FC<DonationFormProps> = ({ eventId, organizationName = "Meals With A Mission" }) => {
  const [amount, setAmount] = useState<string>("0.00")
  const [subscriptionType, setSubscriptionType] = useState<"one-time" | "monthly">("one-time")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const navigate = useNavigate()

const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const raw = e.target.value;

  // Allow only numbers and a single decimal point, up to 2 decimal places
  if (!/^\d*\.?\d{0,2}$/.test(raw) && raw !== "") return;

  setAmount(raw);

  const num = parseFloat(raw);
  if (!isNaN(num) && (num < 1 || num > 5000)) {
    setErrorMessage("Enter an amount between $1.00 and $5,000.00");
  } else {
    setErrorMessage(null);
  }
};


const handleAmountBlur = () => {
  const num = parseFloat(amount);

  if (!isNaN(num)) {
    setAmount(num.toFixed(2)); // Ensures 2 decimal places
  }
};



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = Number.parseFloat(amount)
    if (numAmount < 1 || numAmount > 5000) {
      setErrorMessage("Enter an amount between $1.00 and $5,000.00")
      return
    }
    setIsProcessing(true)
    setErrorMessage(null)
    setTimeout(() => {
      navigate(`/checkout/${eventId}?amount=${amount}&subscription=${subscriptionType}`)
      setIsProcessing(false)
    }, 500)
  }

  const presetAmounts = [25, 50, 100, 250]

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 donation-card max-w-md mx-auto border border-gray-100">
      <div className="flex justify-center mb-4">
        <div className="bg-blue-50 p-3 rounded-full">
          <Heart className="text-[#5144A1]" size={24} />
        </div>
      </div>

      <h2 className="text-center text-2xl font-bold mb-6 text-[#4D5E80]">Tax Deductible Donation</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <p className="uppercase text-xs font-bold mb-3 tracking-wider text-[#2B3E50]">ENTER DONATION AMOUNT</p>

          <div className="relative mb-2">
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden transition-all hover:border-blue-300 focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400">
              <div className="flex items-center h-14 relative">
                <div className="absolute left-0 pl-4 text-gray-500 text-lg font-medium">$</div>
                <input
                  type="text"
                  id="donationAmount"
                  value={amount}
                  onChange={handleAmountChange}
                  onBlur={handleAmountBlur}
                  className="border-0 bg-transparent w-full h-full py-3"
                  style={{
                    paddingLeft: "1.75rem",
                    paddingRight: subscriptionType === "monthly" ? "5rem" : "1rem",
                    outline: "none",
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#333",
                  }}
                  required
                />
                {subscriptionType === "monthly" && (
                  <div className="absolute right-0 pr-4 text-gray-500 text-sm">/ month</div>
                )}
              </div>
            </div>
            {errorMessage && <p className="text-red-500 text-xs text-center mt-1 font-medium">{errorMessage}</p>}
          </div>

          <div className="grid grid-cols-4 gap-2 mt-3 mb-4">
            {presetAmounts.map((presetAmount) => (
              <button
                key={presetAmount}
                type="button"
                className={`py-2 px-1 rounded-md text-sm font-medium transition-all ${
                  Number(amount) === presetAmount
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => setAmount(presetAmount.toFixed(2))}
              >
                ${presetAmount}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-700 text-sm leading-relaxed">
            Help <span className="font-semibold">{organizationName}</span> bless others in our local community through a
            one-time or recurring donation.
          </p>
        </div>

        <div className="pt-2">
          {/* <div className="flex justify-center mb-4">
            <div className="bg-gray-50 rounded-lg p-1 inline-flex w-full">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  subscriptionType === "one-time"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setSubscriptionType("one-time")}
              >
                One-time
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  subscriptionType === "monthly"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setSubscriptionType("monthly")}
              >
                Monthly
              </button>
            </div>
          </div> */}

          <button
            type="submit"
            className="w-full py-4 btn-primary text-white font-medium text-base rounded-lg transition-all transform hover:translate-y-[-2px]"
            // style={{
            //   backgroundColor: "#0D6EFD",
            //   boxShadow: "0 4px 14px rgba(13, 110, 253, 0.25)",
            // }}
            disabled={isProcessing || Number.parseFloat(amount) <= 0}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Checkout"
            )}
          </button>
        </div>
      </form>

      <div className="text-center mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-center items-center mb-2">
          <div className="bg-gray-100 p-2 rounded-md">
            <CreditCard size={16} className="text-gray-500" />
          </div>
        </div>
        <p className="text-gray-500 text-xs">Secure payment by Stripe</p>
      </div>
    </div>
  )
}

export default DonationForm
