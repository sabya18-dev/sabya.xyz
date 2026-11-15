import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { 
  FaFilePdf, 
  FaLock, 
  FaUnlock, 
  FaDownload, 
  FaEye, 
  FaCheckCircle, 
  FaShieldAlt, 
  FaStar, 
  FaBolt, 
  FaTimes,
  FaBookOpen
} from 'react-icons/fa';
import { HiCheck, HiSparkles } from 'react-icons/hi';

const API_BASE = process.env.REACT_APP_API_URL || '';

const Notes = ({ isDark }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // State management
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);

  // Check on mount if user already purchased (stored in localStorage)
  useEffect(() => {
    const savedToken = localStorage.getItem('dsa_notes_access_token');
    const savedDetails = localStorage.getItem('dsa_notes_payment_info');
    
    if (savedToken) {
      setAccessToken(savedToken);
      if (savedDetails) {
        try {
          setPaymentDetails(JSON.parse(savedDetails));
        } catch (e) {}
      }

      // Verify token with backend
      fetch(`${API_BASE}/api/verify-token?token=${savedToken}`)
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            setIsUnlocked(true);
          } else {
            // Invalid/expired token
            localStorage.removeItem('dsa_notes_access_token');
            localStorage.removeItem('dsa_notes_payment_info');
            setIsUnlocked(false);
          }
        })
        .catch(() => {
          // If offline/server not reachable yet, keep cached state
          setIsUnlocked(true);
        });
    }
  }, []);

  // Dynamically load Razorpay SDK if not already loaded
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Checkout Click
  const handlePayment = async () => {
    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'Initializing secure checkout...' });

    try {
      // 1. Fetch public config & create order from backend
      const orderRes = await fetch(`${API_BASE}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create order on server.');
      }

      const orderData = await orderRes.json();

      // Check if server is in demo mode (e.g. before user configures keys)
      if (orderData.isDemo) {
        setStatusMessage({
          type: 'info',
          text: 'Demo test mode active. Completing verified order simulation...',
        });

        // Simulate successful checkout for test mode
        setTimeout(async () => {
          const verifyRes = await fetch(`${API_BASE}/api/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: orderData.id,
              razorpay_payment_id: `pay_demo_${Date.now()}`,
              razorpay_signature: 'demo_valid_signature',
              isDemo: true,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            localStorage.setItem('dsa_notes_access_token', verifyData.accessToken);
            localStorage.setItem('dsa_notes_payment_info', JSON.stringify(verifyData));
            setAccessToken(verifyData.accessToken);
            setPaymentDetails(verifyData);
            setIsUnlocked(true);
            setIsLoading(false);
            setStatusMessage({
              type: 'success',
              text: 'Payment Successful! Notes have been unlocked.',
            });
          }
        }, 1200);
        return;
      }

      // 2. Fetch Razorpay key ID
      const configRes = await fetch(`${API_BASE}/api/config`);
      const configData = await configRes.json();
      const keyId = configData.keyId || process.env.REACT_APP_RAZORPAY_KEY_ID;

      if (!keyId) {
        throw new Error('Razorpay Key ID not configured. Please check environment variables.');
      }

      // 3. Ensure Razorpay SDK is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // 4. Open Razorpay modal
      const options = {
        key: keyId,
        amount: orderData.amount, // 1900 paise = ₹19 INR
        currency: orderData.currency || 'INR',
        name: 'Sabyasachi Samal',
        description: 'DSA Placement Preparation Sheet',
        image: '/images/hero-photo.jpg',
        order_id: orderData.id,
        theme: {
          color: '#0066ff',
        },
        handler: async function (response) {
          setStatusMessage({ type: 'info', text: 'Verifying payment with server...' });
          try {
            // Server-side signature verification
            const verifyRes = await fetch(`${API_BASE}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              // Store access token securely in localStorage
              localStorage.setItem('dsa_notes_access_token', verifyData.accessToken);
              localStorage.setItem('dsa_notes_payment_info', JSON.stringify(verifyData));
              setAccessToken(verifyData.accessToken);
              setPaymentDetails(verifyData);
              setIsUnlocked(true);
              setStatusMessage({
                type: 'success',
                text: 'Payment Successful! Your DSA Placement Preparation Sheet is unlocked.',
              });
            } else {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            setStatusMessage({
              type: 'error',
              text: err.message || 'Payment verification failed. Please contact support.',
            });
          } finally {
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            setStatusMessage({
              type: 'warning',
              text: 'Payment was cancelled. You can retry anytime.',
            });
          },
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        console.error('Razorpay payment failed:', response.error);
        setIsLoading(false);
        setStatusMessage({
          type: 'error',
          text: `Payment Failed: ${response.error.description || 'Transaction declined'}`,
        });
      });

      paymentObject.open();
    } catch (error) {
      console.error('Payment checkout error:', error);
      setIsLoading(false);
      setStatusMessage({
        type: 'error',
        text: error.message || 'Could not initiate checkout. Please try again.',
      });
    }
  };

  const handleDownload = () => {
    if (!accessToken) return;
    window.location.href = `${API_BASE}/api/pdf/download?token=${accessToken}`;
  };

  const handleView = () => {
    if (!accessToken) return;
    setPdfViewerOpen(true);
  };

  const featuresList = [
    {
      title: 'Pattern-wise DSA Questions',
      desc: 'Master Two Pointers, Sliding Window, Fast & Slow, Monotonic Stack, Backtracking, and Greedy patterns with recurring interview problems.',
    },
    {
      title: 'Topic-wise Organization',
      desc: 'Structured flow from Arrays & Strings to Linked Lists, Recursion, Binary Trees, BST, Graphs, Dynamic Programming & Tries.',
    },
    {
      title: 'Important Coding Interview Problems',
      desc: 'Curated high-frequency problems from LeetCode, GFG, and top product company archives with optimal intuitions.',
    },
    {
      title: 'Structured Placement Preparation',
      desc: 'Includes Brute Force → Better → Optimal step-by-step logic, edge case checklists, time/space complexity, and clean code templates.',
    },
    {
      title: 'Designed for FAANG & Top Tech',
      desc: 'Built specifically for students & working professionals preparing for Google, Microsoft, Amazon, Meta, Uber, and high-growth startups.',
    },
  ];

  const syllabusPreview = [
    { step: 'Step 1', title: 'Basics, Math & Patterns', pages: '45 Pages' },
    { step: 'Step 2', title: 'Arrays (Easy, Medium, Hard)', pages: '80 Pages' },
    { step: 'Step 3', title: 'Binary Search & 2D Matrices', pages: '55 Pages' },
    { step: 'Step 4', title: 'Strings & Two Pointers', pages: '40 Pages' },
    { step: 'Step 5', title: 'Linked List (1D, 2D, Reversals)', pages: '50 Pages' },
    { step: 'Step 6', title: 'Recursion & Backtracking', pages: '48 Pages' },
    { step: 'Step 7', title: 'Bit Manipulation & Math', pages: '30 Pages' },
    { step: 'Step 8', title: 'Stack & Queues (Monotonic)', pages: '52 Pages' },
    { step: 'Step 9', title: 'Sliding Window & Two Pointer Patterns', pages: '42 Pages' },
    { step: 'Step 10', title: 'Heaps / Priority Queue', pages: '36 Pages' },
    { step: 'Step 11', title: 'Binary Trees & Traversals', pages: '65 Pages' },
    { step: 'Step 12', title: 'Binary Search Trees (BST)', pages: '45 Pages' },
    { step: 'Step 13', title: 'Graphs (BFS, DFS, Dijkstra, MST)', pages: '85 Pages' },
    { step: 'Step 14', title: 'Dynamic Programming (1D, 2D, Grids, DP on Trees)', pages: '110 Pages' },
    { step: 'Step 15', title: 'Tries & Advanced Interview Tricks', pages: '35 Pages' },
  ];

  return (
    <section id="notes" className="py-24 relative overflow-hidden">
      {/* Background Ambient Glow Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue/15 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue/40 bg-blue/10 text-cyan-400 text-xs md:text-sm font-semibold mb-4 tracking-wider uppercase">
            <HiSparkles className="text-blue" />
            Premium Placement Resource
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            DSA Placement <span className="text-gradient">Preparation Sheet</span>
          </h2>

          <p className="text-gray-300 text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
            "Your complete roadmap to mastering Data Structures and Algorithms for top tech company interviews."
          </p>
        </div>

        {/* Main Content Grid */}
        <div 
          ref={ref}
          className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-start transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Left Column: Syllabus & Key Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-dark p-6 sm:p-8 rounded-2xl border border-blue/20 shadow-xl">
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <FaBookOpen className="text-blue" />
                Everything You Need To Crack Top Tech Interviews
              </h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                Comprehensive, crystal-clear, handwritten and structured DSA notes based on the proven Striver A2Z curriculum. Covers all edge cases, step-by-step dry runs, and time/space complexity breakdowns.
              </p>

              {/* Feature Cards */}
              <div className="space-y-4">
                {featuresList.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-4 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-blue/30 hover:bg-white/[0.08] transition-all duration-300"
                  >
                    <div className="p-2 rounded-lg bg-blue/20 text-cyan-400 flex-shrink-0 mt-0.5">
                      <HiCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm md:text-base mb-1">
                        {item.title}
                      </h4>
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Target Companies Strip */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
                  Targeted For Top Tech Recruiters:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {['Google', 'Microsoft', 'Amazon', 'Meta', 'Uber', 'Atlassian', 'Adobe', 'Flipkart'].map((company) => (
                    <span 
                      key={company}
                      className="px-3 py-1 text-xs rounded-full bg-blue/10 border border-blue/20 text-blue-200 font-medium"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: PDF Preview & Razorpay Checkout Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-dark rounded-2xl border border-blue/30 shadow-2xl overflow-hidden relative">
              {/* Top Accent Gradient Bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-blue via-cyan-400 to-purple-500"></div>

              {/* PDF Document Visual Cover */}
              <div className="p-6 sm:p-8">
                <div className="relative group perspective">
                  {/* PDF Cover Card Preview */}
                  <div className="relative rounded-2xl bg-gradient-to-br from-[#12182b] via-[#0d1322] to-[#0a0e1a] border border-blue/30 p-6 shadow-2xl transition-all duration-500 hover:border-blue/50">
                    {/* Badge on cover */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                        <FaFilePdf /> 38 MB PDF
                      </span>
                      <span className="text-xs font-medium text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                        450+ Pages
                      </span>
                    </div>

                    {/* PDF Title Header */}
                    <div className="border-b border-white/10 pb-4 mb-4">
                      <h4 className="text-lg md:text-xl font-bold text-white leading-snug">
                        Striver A2Z DSA Placement Sheet
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        All Approaches Included (Brute • Better • Optimal)
                      </p>
                    </div>

                    {/* Snippet / Content Preview items */}
                    <div className="space-y-2 text-xs text-gray-300">
                      <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5">
                        <span className="font-mono text-cyan-300">01. Arrays & Hashing</span>
                        <span className="text-emerald-400 font-semibold">Included ✓</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5">
                        <span className="font-mono text-cyan-300">02. Dynamic Programming</span>
                        <span className="text-emerald-400 font-semibold">Included ✓</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-black/30 border border-white/5">
                        <span className="font-mono text-cyan-300">03. Graph Algorithms</span>
                        <span className="text-emerald-400 font-semibold">Included ✓</span>
                      </div>
                    </div>

                    {/* Watermark / Lock overlay */}
                    {!isUnlocked ? (
                      <div className="mt-4 pt-3 border-t border-dashed border-white/15 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-amber-300">
                          <FaLock className="text-amber-400" />
                          <span>Premium Protected PDF</span>
                        </div>
                        <button
                          onClick={() => setPreviewModalOpen(true)}
                          className="text-xs text-blue hover:text-cyan-300 transition-colors underline flex items-center gap-1"
                        >
                          <FaEye /> Peek Index
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 pt-3 border-t border-dashed border-emerald-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                          <FaUnlock /> Unlocked & Ready
                        </div>
                        <span className="text-xs text-gray-400">Authentic Original</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Message Notification */}
                {statusMessage && (
                  <div
                    className={`mt-6 p-4 rounded-xl text-sm border flex items-start gap-3 transition-all ${
                      statusMessage.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : statusMessage.type === 'error'
                        ? 'bg-red-500/10 border-red-500/30 text-red-300'
                        : statusMessage.type === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-blue/10 border-blue/30 text-blue-200'
                    }`}
                  >
                    {statusMessage.type === 'success' && <FaCheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" />}
                    {statusMessage.type === 'error' && <FaTimes className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />}
                    {statusMessage.type === 'warning' && <FaLock className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />}
                    {statusMessage.type === 'info' && <FaBolt className="w-5 h-5 flex-shrink-0 mt-0.5 text-cyan-400 animate-pulse" />}
                    <div className="flex-1">
                      <p className="font-medium">{statusMessage.text}</p>
                    </div>
                  </div>
                )}

                {/* State A: Locked (Show Pricing & Unlock Button) */}
                {!isUnlocked ? (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    {/* Price Display */}
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl sm:text-5xl font-extrabold text-white">
                            ₹19
                          </span>
                          <span className="text-gray-300 text-base font-semibold">
                            Only
                          </span>
                          <span className="text-gray-500 text-sm line-through ml-2">
                            ₹499
                          </span>
                        </div>
                        <p className="text-xs text-emerald-400 font-semibold mt-1">
                          ⚡ Limited Offer — Save 96% Today
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="inline-block px-2.5 py-1 text-xs font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          One-time Payment
                        </span>
                      </div>
                    </div>

                    {/* Unlock Button */}
                    <button
                      onClick={handlePayment}
                      disabled={isLoading}
                      className="w-full btn-primary py-4 px-6 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-3 shadow-glow group hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing Secure Payment...</span>
                        </>
                      ) : (
                        <>
                          <FaLock className="group-hover:translate-x-0.5 transition-transform" />
                          <span>Unlock Premium Notes – ₹19</span>
                        </>
                      )}
                    </button>

                    {/* Trust & Payment Badges */}
                    <div className="mt-5 space-y-2 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                        <FaShieldAlt className="text-emerald-400" />
                        <span>100% Secure Checkout via Razorpay</span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        Supports UPI (GPay, PhonePe, Paytm), All Debit & Credit Cards, NetBanking
                      </p>
                    </div>
                  </div>
                ) : (
                  /* State B: Unlocked (Payment Successful & Action Buttons) */
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                      <div className="inline-flex p-2.5 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                        <FaCheckCircle className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-white">Payment Successful!</h4>
                      <p className="text-xs text-gray-300 mt-1">
                        Your DSA Placement Sheet is permanently unlocked.
                      </p>
                      {paymentDetails && (
                        <p className="text-[10px] text-gray-500 font-mono mt-2">
                          Payment ID: {paymentDetails.paymentId || paymentDetails.razorpay_payment_id}
                        </p>
                      )}
                    </div>

                    {/* View and Download Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={handleView}
                        className="btn-primary py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
                      >
                        <FaEye />
                        <span>View PDF</span>
                      </button>

                      <button
                        onClick={handleDownload}
                        className="btn-secondary py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform text-white border-blue hover:bg-blue"
                      >
                        <FaDownload />
                        <span>Download PDF</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-center text-gray-400 pt-1">
                      💡 Tip: You can download the file to read offline anytime on any device.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Guarantees Box */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <FaStar className="text-amber-400" /> 4.9/5 Rating (1,200+ Students)
              </span>
              <span className="text-blue font-medium">Instant PDF Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Syllabus / Peek Index Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-dark max-w-2xl w-full rounded-2xl border border-blue/30 p-6 max-h-[85vh] flex flex-col relative shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FaBookOpen className="text-blue" />
                <h3 className="text-xl font-bold text-white">DSA Sheet — Table of Contents</h3>
              </div>
              <button 
                onClick={() => setPreviewModalOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Syllabus list scrollable */}
            <div className="overflow-y-auto py-4 space-y-2 pr-1">
              {syllabusPreview.map((item, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue/20 text-cyan-300">
                      {item.step}
                    </span>
                    <span className="text-sm font-medium text-gray-200">{item.title}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{item.pages}</span>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-sm text-gray-300">
                Unlock full 450+ pages for only <strong className="text-white font-bold">₹19</strong>
              </span>
              {!isUnlocked ? (
                <button
                  onClick={() => {
                    setPreviewModalOpen(false);
                    handlePayment();
                  }}
                  className="btn-primary py-2 px-5 text-sm font-semibold rounded-lg"
                >
                  Unlock Now – ₹19
                </button>
              ) : (
                <button
                  onClick={() => {
                    setPreviewModalOpen(false);
                    handleView();
                  }}
                  className="btn-primary py-2 px-5 text-sm font-semibold rounded-lg"
                >
                  View Full PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Inline PDF Viewer Modal */}
      {pdfViewerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="glass-dark w-full max-w-6xl h-[92vh] rounded-2xl border border-blue/40 flex flex-col overflow-hidden shadow-2xl">
            {/* Viewer Header */}
            <div className="p-4 bg-dark/95 border-b border-blue/20 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <FaFilePdf className="text-red-400 text-xl" />
                <div>
                  <h4 className="text-base font-bold text-white">DSA Placement Preparation Sheet</h4>
                  <p className="text-xs text-gray-400">Authenticated Access • Verified Purchase</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue/20 hover:bg-blue/30 text-cyan-300 text-xs font-semibold border border-blue/30 transition-colors"
                >
                  <FaDownload /> Download Copy
                </button>
                <button
                  onClick={() => setPdfViewerOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Protected PDF Iframe */}
            <div className="flex-1 bg-darkBg w-full h-full relative">
              <iframe
                title="DSA Placement Sheet"
                src={`${API_BASE}/api/pdf/view?token=${accessToken}#toolbar=1`}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Notes;
