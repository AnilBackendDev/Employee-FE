import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    ArrowLeft,
    Star,
    Crown,
    Calendar,
    CreditCard,
    CheckCircle2,
    Shield,
    Lock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Trainer {
    id: string;
    name: string;
    title: string;
    avatar: string;
    rating: number;
    reviews: number;
    pricePerMonth: number;
    skills: string[];
    isPremium: boolean;
}

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const trainer = location.state?.trainer as Trainer;

    const [paymentMode, setPaymentMode] = useState<"monthly" | "quarterly">("monthly");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [cardName, setCardName] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    if (!trainer) {
        navigate("/interview/trainers");
        return null;
    }

    const calculatePrice = () => {
        if (paymentMode === "quarterly") {
            return Math.round(trainer.pricePerMonth * 3 * 0.9); // 10% discount
        }
        return trainer.pricePerMonth;
    };

    const handlePayment = () => {
        if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
            toast({
                title: "Missing Information",
                description: "Please fill in all payment details",
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            toast({
                title: "Payment Successful!",
                description: `You've successfully booked ${trainer.name}. Check your email for next steps.`,
            });

            setTimeout(() => {
                navigate("/interview");
            }, 2000);
        }, 2000);
    };

    const price = calculatePrice();

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-background border-b border-border">
                    <div className="flex items-center gap-3 px-4 py-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-foreground" />
                        </button>
                        <h1 className="text-xl font-bold text-foreground">Checkout</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4 pb-24">
                    {/* Trainer Summary */}
                    <div className="card-elevated p-4">
                        <p className="text-xs text-muted-foreground mb-3">Booking with</p>
                        <div className="flex gap-3">
                            <img
                                src={trainer.avatar}
                                alt={trainer.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    {trainer.name}
                                    {trainer.isPremium && <Crown className="w-4 h-4 text-amber-500" />}
                                </h3>
                                <p className="text-sm text-muted-foreground">{trainer.title}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                    <span className="text-xs font-semibold">{trainer.rating}</span>
                                    <span className="text-xs text-muted-foreground">({trainer.reviews} reviews)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Plan */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Select Plan</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setPaymentMode("monthly")}
                                className={`p-3 rounded-xl text-left transition-all ${paymentMode === "monthly"
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "bg-secondary hover:bg-secondary/80"
                                    }`}
                            >
                                <p className="text-sm font-medium">Monthly</p>
                                <p className="text-lg font-bold">₹{(trainer.pricePerMonth / 1000).toFixed(0)}k</p>
                            </button>
                            <button
                                onClick={() => setPaymentMode("quarterly")}
                                className={`p-3 rounded-xl text-left transition-all relative ${paymentMode === "quarterly"
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "bg-secondary hover:bg-secondary/80"
                                    }`}
                            >
                                <div className="absolute top-1 right-1">
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold">
                                        SAVE 10%
                                    </span>
                                </div>
                                <p className="text-sm font-medium">Quarterly</p>
                                <p className="text-lg font-bold">₹{(price / 1000).toFixed(0)}k</p>
                            </button>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-foreground">Payment Details</label>

                        {/* Card Number */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Card Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Card Name */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Cardholder Name</label>
                            <Input
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>

                        {/* Expiry & CVV */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">Expiry Date</label>
                                <Input
                                    value={cardExpiry}
                                    onChange={(e) => setCardExpiry(e.target.value)}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground mb-1 block">CVV</label>
                                <Input
                                    value={cardCvv}
                                    onChange={(e) => setCardCvv(e.target.value)}
                                    placeholder="123"
                                    maxLength={3}
                                    type="password"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="card-elevated p-4 space-y-2">
                        <p className="text-sm font-semibold text-foreground">Order Summary</p>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                                {paymentMode === "monthly" ? "Monthly Plan" : "Quarterly Plan (3 months)"}
                            </span>
                            <span className="font-medium">₹{price.toLocaleString()}</span>
                        </div>
                        {paymentMode === "quarterly" && (
                            <div className="flex justify-between text-sm text-emerald-600">
                                <span>Discount (10%)</span>
                                <span>-₹{(trainer.pricePerMonth * 3 * 0.1).toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 pt-2 mt-2 border-t border-border">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-xs text-muted-foreground">
                                First session scheduled after payment
                            </span>
                        </div>
                        <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                            <span>Total</span>
                            <span>₹{price.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Security Info */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/20">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <p className="text-xs text-muted-foreground">
                            <Lock className="w-3 h-3 inline mr-1" />
                            Secure payment • Your data is encrypted
                        </p>
                    </div>

                    {/* Pay Button */}
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className={`w-full p-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${isProcessing
                                ? "bg-secondary text-muted-foreground cursor-wait"
                                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90 shadow-lg"
                            }`}
                    >
                        {isProcessing ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                Pay ₹{price.toLocaleString()}
                            </>
                        )}
                    </button>

                    <p className="text-xs text-center text-muted-foreground">
                        By proceeding, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
