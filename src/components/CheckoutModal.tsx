import React, { useState } from 'react';
import { SubscriptionFormula, UserProfile } from '../types';
import { CreditCard, Lock, ShieldCheck, CheckCircle2, Smartphone, X, ArrowRight, Sparkles, Receipt, Tag } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFormula: SubscriptionFormula;
  user: UserProfile;
  onPaymentSuccess: (formula: SubscriptionFormula) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedFormula,
  user,
  onPaymentSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_money'>('card');
  const [cardHolder, setCardHolder] = useState(user.email ? user.email.split('@')[0].toUpperCase() : 'KAMILA THOSSENI');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [phoneNumber, setPhoneNumber] = useState('+229 97 00 00 00');
  
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  if (!isOpen) return null;

  const prices: Record<SubscriptionFormula, number> = {
    'Découverte': 0,
    'Pro': 19,
    'Illimité': 39
  };

  const quotas: Record<SubscriptionFormula, number> = {
    'Découverte': 3,
    'Pro': 20,
    'Illimité': 100
  };

  const basePrice = prices[selectedFormula];
  const finalPrice = discountApplied ? Math.round(basePrice * 0.8) : basePrice;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'CVGEN20' || promoCode.trim().toUpperCase() === 'PROMO20') {
      setDiscountApplied(true);
    } else {
      alert('Code promo invalide. Essayez "CVGEN20" pour 20% de réduction !');
    }
  };

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate real SSL encrypted payment processing
    await new Promise(r => setTimeout(r, 1800));
    setIsProcessing(false);
    setIsPaid(true);

    // Call payment success callback
    onPaymentSuccess(selectedFormula);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-black">
              <Lock className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Paiement Sécurisé SSL <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-[10px] text-slate-400">Transaction cryptée 256-bit Stripe / CinetPay</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs">
          
          {!isPaid ? (
            <>
              {/* Order Recap */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">Formule {selectedFormula}</span>
                  <span className="font-extrabold text-slate-900 text-base">{finalPrice} € <span className="text-[10px] text-slate-500 font-normal">/ mois</span></span>
                </div>
                <div className="flex justify-between items-center text-slate-500 text-[11px]">
                  <span>Quota inclus :</span>
                  <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    +{quotas[selectedFormula]} CVs & Lettres
                  </span>
                </div>
                {discountApplied && (
                  <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 pt-1 border-t border-slate-200">
                    <Tag className="w-3.5 h-3.5" /> Réduction Code Promo 20% appliquée (-{(basePrice - finalPrice).toFixed(2)} €)
                  </div>
                )}
              </div>

              {/* Promo Code Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Code Promo (ex: CVGEN20)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={discountApplied}
                  className="flex-1 p-2.5 border border-slate-300 rounded-lg text-xs uppercase tracking-wider focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  disabled={discountApplied || !promoCode}
                  className="px-3 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
                >
                  Appliquer
                </button>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Moyen de paiement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition ${
                      paymentMethod === 'card' ? 'border-teal-600 bg-teal-50/50 text-teal-900' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-teal-600" />
                    Carte Bancaire
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile_money')}
                    className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold transition ${
                      paymentMethod === 'mobile_money' ? 'border-teal-600 bg-teal-50/50 text-teal-900' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-amber-500" />
                    Mobile Money
                  </button>
                </div>
              </div>

              {/* Form Input based on selected payment method */}
              {paymentMethod === 'card' ? (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Nom sur la carte</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Numéro de Carte</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Expiration</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-[11px] text-slate-600">
                    Paiement instantané via <strong>MTN Mobile Money, Orange Money, Moov ou Wave</strong>.
                  </p>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Numéro Téléphone Mobile Money</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Submit Pay Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-sm transition shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Traitement sécurisé en cours...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-emerald-300" />
                    <span>Payer {finalPrice} € & Activer mon Quota</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                Paiement 100% sécurisé. Vous pouvez annuler votre abonnement à tout moment d'un simple clic.
              </p>
            </>
          ) : (
            /* PAYMENT SUCCESS STATE */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Paiement Réussi !</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Votre formule <strong>{selectedFormula}</strong> a été activée.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-[11px] space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Reçu N°:</span>
                  <span className="font-bold text-slate-900">INV-2026-{Math.floor(1000 + Math.random() * 9000)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Montant réglé:</span>
                  <span className="font-bold text-slate-900">{finalPrice} € TTC</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Nouveau Quota mensuel:</span>
                  <span className="font-bold text-teal-700">+{quotas[selectedFormula]} Générations</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl transition shadow-md"
              >
                Accéder à mes générations
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
