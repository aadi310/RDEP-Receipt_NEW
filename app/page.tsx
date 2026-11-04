"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronRight,
  LayoutGrid,
  Headset,
  Check,
  Lock,
  ArrowRight,
  ArrowUpRight,
  Gift,
  Trophy,
  Ticket,
  Zap,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  History,
  Instagram,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Star,
  User2,
  ThumbsUp,
  Share2,
  Facebook,
  Sparkles,
  MapPin,
  ShoppingBagIcon,
  Utensils,
  Package,
  Receipt as ReceiptIcon,
} from "lucide-react"

interface Receipt {
  id: string
  date: string
  time: string
  associate: string
  items: Array<{
    id: number
    name: string
    description: string
    price: number
    quantity: number
    category?: string
    taxApplicable?: boolean
    baseAmount?: number
    tax?: number
    itemCode?: string
    size?: string
    color?: string
    material?: string
  }>
  subtotal: number
  tax: number
  total: number
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showTerms, setShowTerms] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [expandedProducts, setExpandedProducts] = useState<number[]>([])
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: string[] }>({})
  const [currentReceiptId, setCurrentReceiptId] = useState("current")
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const [showReferModal, setShowReferModal] = useState(false)
  const [showStoreLocation, setShowStoreLocation] = useState(false)
  const receiptContainerRef = useRef<HTMLDivElement>(null)
const [selectedTags, setSelectedTags] = useState<string[]>([])
const [couponToast, setCouponToast] = useState(false)
  const [itemFeedback, setItemFeedback] = useState({})
const [expandedItemFeedback, setExpandedItemFeedback] = useState([])
  const [feedback, setFeedback] = useState({
    service: 0,
    quality: 0,
    style: 0,
    pricing: 0,
    store: 0,
    comments: "",
  })
  const [profile, setProfile] = useState({
    mobile: "",
    name: "",
    email: "",
    gender: "",
  })
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState("")

  const copyCoupon = (code: string) => {
  navigator.clipboard.writeText(code)

  setCouponToast(true)

  setTimeout(() => {
    setCouponToast(false)
  }, 2000)
}

  const toggleItemFeedback = (id) => {
  setExpandedItemFeedback((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
  )
}

  const setItemRating = (itemId, rating) => {
  setItemFeedback((prev) => ({
    ...prev,
    [itemId]: {
      ...prev[itemId],
      rating,
    },
  }))
}

  const toggleItemTag = (itemId, tag) => {
  setItemFeedback((prev) => {
    const currentTags = prev[itemId]?.tags || []

    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag]

    return {
      ...prev,
      [itemId]: {
        ...prev[itemId],
        tags: newTags,
      },
    }
  })
}

  const customerName = "Vikas"

  // Carousel refs and APIs
  const [promoApi, setPromoApi] = useState<CarouselApi>()
  const feedbackButtonRef = useRef<HTMLButtonElement>(null)
  const historyButtonRef = useRef<HTMLButtonElement>(null)
  const referButtonRef = useRef<HTMLButtonElement>(null)

  // Auto-play effect for promo carousel
  useEffect(() => {
    if (!promoApi) return
    const interval = setInterval(() => {
      promoApi.scrollNext()
    }, 4000)
    return () => clearInterval(interval)
  }, [promoApi])

  useEffect(() => {
  setItemFeedback({})
  setExpandedItemFeedback([])
}, [currentReceiptId])

  // Simple auto-height for WordPress iframe
  useEffect(() => {
    const postHeight = () => {
      const marker = document.getElementById("height-marker")
      if (marker && window.parent) {
        const rect = marker.getBoundingClientRect()
        const newHeight = Math.ceil(rect.top + rect.height + window.scrollY)
        window.parent.postMessage({ frameHeight: newHeight }, "*")
      }
    }

    // Run on load
    postHeight()

    // Observe changes to the DOM
    const ro = new ResizeObserver(postHeight)
    ro.observe(document.body)

    // Re-run on resize
    window.addEventListener("resize", postHeight)

    return () => {
      ro.disconnect()
      window.removeEventListener("resize", postHeight)
    }
  }, [])

  // Update current slide when carousel changes
  useEffect(() => {
    if (!promoApi) return
    promoApi.on("select", () => {
      setCurrentSlide(promoApi.selectedScrollSnap())
    })
  }, [promoApi])

 const receipts = {
  current: {
    id: "PMIN-BR7891XQ12",
    date: "05-04-2026",
    time: "19:22:18",
    associate: "Rahul Kumar",
    branch: "Brigade Road, BLR",
    items: [
      {
        id: 0,
        name: "Velocity NITRO 4",
        color: "Warm White-Gold",
        price: 11999,
        quantity: 1,
        category: "Running",
        itemCode: "P-377745-01",
        baseAmount: 10713.39,
        tax: 1285.61, // 12% GST
      },
      {
        id: 1,
        name: "Train All Day Tee",
        color: "PUMA White",
        price: 1079, // Sale price from screenshot
        originalPrice: 1799,
        quantity: 1,
        category: "Training",
        itemCode: "P-524872-02",
        baseAmount: 963.39,
        tax: 115.61,
      },
      {
        id: 2,
        name: "CR Cricket Shorts",
        color: "PUMA Black",
        price: 1099,
        originalPrice: 1999,
        quantity: 1,
        category: "Cricket",
        itemCode: "P-678234-01",
        baseAmount: 981.25,
        tax: 117.75,
      },
    ],
    subtotal: 12658.03,
    tax: 1518.97,
    total: 14177,
  },

  hist1: {
    id: "PMIN-IN6719YT92",
    date: "20-03-2026",
    time: "14:22:18",
    associate: "Anita Sharma",
    branch: "Indiranagar, BLR",
    items: [
      {
        id: 0,
        name: "Ferrari Neo Cat 2.0",
        color: "PUMA Black-White",
        price: 4124,
        originalPrice: 7499,
        quantity: 1,
        category: "Motorsport",
        itemCode: "P-307239-02",
        baseAmount: 3682.14,
        tax: 441.86,
      },
      {
        id: 1,
        name: "PUMA x RCB Jacket",
        color: "Navy-Red",
        price: 5499,
        quantity: 1,
        category: "Fanwear",
        itemCode: "P-625890-01",
        baseAmount: 4909.82,
        tax: 589.18,
      },
      {
        id: 2,
        name: "Essentials Track Suit",
        color: "Medium Gray",
        price: 3949,
        originalPrice: 5266,
        quantity: 1,
        category: "Lifestyle",
        itemCode: "P-586747-03",
        baseAmount: 3525.89,
        tax: 423.11,
      },
    ],
    subtotal: 12117.85,
    tax: 1454.15,
    total: 13572,
  },

  hist2: {
    id: "PMIN-KM5590LP33",
    date: "15-02-2026",
    time: "12:45:33",
    associate: "Sanjay Reddy",
    branch: "Koramangala, BLR",
    items: [
      {
        id: 0,
        name: "Court Shatter Low",
        color: "PUMA White",
        price: 2819,
        originalPrice: 5999,
        quantity: 1,
        category: "Lifestyle",
        itemCode: "P-384123-05",
        baseAmount: 2516.96,
        tax: 302.04,
      },
      {
        id: 1,
        name: "PUMA x POKEMON Jacket",
        color: "Strong Gray",
        price: 7499,
        quantity: 1,
        category: "Collab",
        itemCode: "P-536547-01",
        baseAmount: 6695.54,
        tax: 803.46,
      },
      {
        id: 2,
        name: "Train All Day Pants",
        color: "PUMA Black",
        price: 3799,
        quantity: 1,
        category: "Training",
        itemCode: "P-523120-01",
        baseAmount: 3391.96,
        tax: 407.04,
      },
    ],
    subtotal: 12604.46,
    tax: 1512.54,
    total: 14117,
  },
};
  
  const currentReceipt = receipts[currentReceiptId]

  const totalSlides = 2

  const transactionHistory = [
    {
      id: "current",
      date: "05-03-2026",
      branch: "PUMA",
      amount: currentReceiptId === "current" ? receipts.current.subtotal + receipts.current.tax : 14177.00,
    },
    { id: "hist1", date: "20-01-2026", branch: "PUMA", amount: 13572.00 },
    { id: "hist2", date: "15-12-2025", branch: "PUMA", amount: 14117.00 },
  ]

  const toggleProductExpansion = (productId: number) => {
    setExpandedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const handleProfileUpdate = () => {
    setProfileUpdateSuccess(true)
    setTimeout(() => setProfileUpdateSuccess(false), 3000)
  }

  const getModalPositionRelativeToContainer = (buttonRef: React.RefObject<HTMLButtonElement>) => {
    if (!buttonRef.current || !receiptContainerRef.current) {
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
    }

    const button = buttonRef.current
    const container = receiptContainerRef.current

    const buttonRect = button.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    // Calculate position relative to container
    const relativeTop = buttonRect.top - containerRect.top
    const relativeLeft = buttonRect.left - containerRect.left

    // Modal dimensions (approximate)
    const modalWidth = Math.min(400, containerRect.width - 32)
    const modalHeight = 400

    // Calculate ideal top position (above button, with offset)
    let top = Math.max(16, relativeTop - modalHeight - 8)

    // If modal would go off top, place it below button
    if (top < 16) {
      top = relativeTop + buttonRect.height + 8
    }

    // If still too high, center it vertically
    if (top + modalHeight > containerRect.height) {
      top = Math.max(16, (containerRect.height - modalHeight) / 2)
    }

    // Calculate ideal left position (centered on button)
    let left = relativeLeft + buttonRect.width / 2 - modalWidth / 2

    // Keep modal within horizontal bounds
    left = Math.max(16, Math.min(left, containerRect.width - modalWidth - 16))

    return {
      position: "absolute" as const,
      top: `${top}px`,
      left: `${left}px`,
      width: `${modalWidth}px`,
      maxHeight: "85vh",
    }
  }

  const handleFeedbackModalOpen = () => {
    setShowFeedbackModal(true)
  }

  const handleTransactionHistoryOpen = () => {
    setShowTransactionHistory(true)
  }

  const handleReferModalOpen = () => {
    setShowReferModal(true)
  }

  const handleFeedbackSubmit = () => {
    setFeedbackSubmitted(true)
    setShowFeedbackModal(false)
    setTimeout(() => setFeedbackSubmitted(false), 5000)
  }

  const handleShare = () => {
    handleReferModalOpen()
  }

  const handleEmailReceipt = () => {
    window.open(`mailto:?subject=Receipt from PUMA Bangalore&body=Receipt ID: ${currentReceipt.id}`)
  }

  const handleDownloadReceipt = () => {
    const receiptContent = `
  <!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>PUMA Official Digital Receipt</title>

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    color: #000;
    background: #fff;
    width: 800px;
    margin: 0 auto;
    padding: 40px;
}

/* Header */
.receipt-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 4px solid #000;
}

.company-info h1 {
    font-size: 36px;
    color: #000;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -1px;
    margin-bottom: 8px;
}

.company-info p {
    font-size: 12px;
    color: #444;
    line-height: 1.6;
    text-transform: uppercase;
    font-weight: 500;
}

.bill-info {
    text-align: right;
    font-size: 11px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.bill-info div {
    margin-bottom: 6px;
}

.bill-id {
    font-weight: 700;
    color: #BA2C2F;
}

/* Customer section */
.customer-section {
    background: #f9f9f9;
    padding: 20px;
    border-left: 6px solid #BA2C2F;
    border-radius: 4px;
    margin-bottom: 30px;
}

.customer-section h3 {
    font-size: 14px;
    color: #000;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 4px;
    letter-spacing: 1px;
}

.customer-section p {
    font-size: 11px;
    color: #666;
    text-transform: uppercase;
    font-weight: 500;
}

/* Table */
.items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 30px;
}

.items-table th {
    background: #000;
    color: white;
    padding: 12px 10px;
    text-align: left;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
}

.items-table td {
    padding: 16px 10px;
    border-bottom: 1px solid #eee;
    font-size: 12px;
    vertical-align: middle;
}

.item-name {
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 4px;
}

.item-category {
    font-size: 10px;
    color: #888;
    text-transform: uppercase;
    font-weight: 600;
}

/* Totals */
.totals-section {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.items-count {
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    color: #999;
}

.totals-table {
    text-align: right;
    min-width: 250px;
}

.totals-table div {
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
}

.net-total {
    font-size: 24px;
    font-weight: 700;
    color: #000;
    border-top: 3px solid #000;
    padding-top: 10px;
    margin-top: 10px;
}

/* Footer */
.footer {
    text-align: center;
    margin-top: 50px;
    padding-top: 30px;
    border-top: 2px solid #f0f0f0;
    font-size: 11px;
    color: #000;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.footer strong {
    color: #BA2C2F;
    font-size: 13px;
}

.powered {
    margin-top: 20px;
    font-size: 9px;
    color: #bbb;
    font-weight: 700;
    letter-spacing: 2px;
}

@media print {
    body {
        -webkit-print-color-adjust: exact;
        width: 100%;
        padding: 20px;
    }
}
</style>
</head>

<body>

<div class="receipt-header">
    <div class="company-info">
        <h1>PUMA</h1>
        <p>
            <strong>PUMA India Retail</strong><br>
            No 777/H, 100 Feet Rd, HAL 2nd Stage<br>
            Indiranagar, Bengaluru 560008<br>
            GSTIN: 29AAACP3423F1Z5
        </p>
    </div>

    <div class="bill-info">
        <div>Order ID: <span class="bill-id">#7891XQ12</span></div>
        <div>Date: ${currentReceipt.date}</div>
        <div>Store Lead: ${currentReceipt.associate}</div>
    </div>
</div>

<div class="customer-section">
    <h3>Athlete: ${customerName}</h3>
    <p>Status: Verified Purchase</p>
</div>

<table class="items-table">
    <thead>
        <tr>
            <th style="width:60%">Product Description</th>
            <th style="width:10%">Qty</th>
            <th style="width:30%; text-align:right;">Amount</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <div class="item-name">Velocity Nitro 4</div>
                <div class="item-category">Running</div>
            </td>
            <td>1</td>
            <td style="text-align:right;"><strong>₹11,999.00</strong></td>
        </tr>
        <tr>
            <td>
                <div class="item-name">Train All Day Tee</div>
                <div class="item-category">Training</div>
            </td>
            <td>1</td>
            <td style="text-align:right;"><strong>₹1,079.00</strong></td>
        </tr>
        <tr>
            <td>
                <div class="item-name">CR Cricket Shorts</div>
                <div class="item-category">Cricket</div>
            </td>
            <td>1</td>
            <td style="text-align:right;"><strong>₹1,099.00</strong></td>
        </tr>
    </tbody>
</table>

<div class="totals-section">
    <div class="items-count">
        Total Units: 3
    </div>

    <div class="totals-table">
        <div>Subtotal: ₹12,658.03</div>
        <div>GST (12%): ₹1,518.97</div>
        <div class="net-total">Total Paid: ₹14,177.00</div>
    </div>
</div>

<div class="footer">
    <p><strong>Forever Faster.</strong></p>
    <p style="margin-top: 8px;">Explore latest collections at in.puma.com</p>

    <div class="powered">
        POWERED BY RDEP
    </div>
</div>

</body>
</html>
`

    const blob = new Blob([receiptContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "PUMA_Receipt_SK251107001.html"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleWhatsApp = () => {
    window.open("https://wa.me/+919620921294", "_blank")
  }

  const handleCall = () => {
    window.open("tel:+919620921294", "_blank")
  }

  const handleEmail = () => {
    window.open("mailto:sagar.p@proenx.com", "_blank")
  }

  const handleSocialLink = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div
        id="receipt-root"
        ref={receiptContainerRef}
        className="w-full max-w-md mx-auto bg-white shadow-lg relative overflow-hidden"
      >
        <div className="flex flex-col w-full gap-3 pb-4 px-3">

          {/* PUMA Refined Premium Top Section */}
<div className="bg-white rounded-3xl shadow-xl border border-gray-100 mt-6 mx-4 overflow-hidden">
  {/* Header: Consolidated Clean Layout */}
  <div className="px-6 pt-8 pb-5 bg-white">
    <div className="flex items-center justify-between gap-4">
      {/* Logo: Significantly Larger & Featured */}
      <img
        src="/images/design-mode/puma-logo.png"
        alt="PUMA"
        className="h-14 w-auto object-contain" 
      />
      
      {/* Premium Minimalist QR - Compacted */}
      <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100 flex-shrink-0">
        <Image
          src="/images/design-mode/800px-QR_code_for_mobile_English_Wikipedia.svg.png"
          alt="Support QR"
          width={40}
          height={40}
          className="grayscale opacity-90"
        />
      </div>
    </div>

    {/* Greeting: Personal, Professional, and Bold */}
    <div className="mt-6">
      <div className="text-2xl font-black italic uppercase tracking-tight text-black">
        Thank you, {customerName}
      </div>
      <div className="text-xs uppercase tracking-widest text-gray-500 font-medium mt-1">
        Summary of your PUMA India purchase
      </div>
    </div>
  </div>

  {/* Receipt Metadata & Amount: Condensed Grid */}
  <div className="px-6 py-6 bg-gray-50/50 border-t border-gray-100">
    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
      
      {/* Amount: Direct Retail Language */}
      <div className="col-span-2 flex justify-between items-end border-b border-gray-200 pb-4 mb-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
            Total Amount (Incl. Taxes)
          </div>
          <div className="text-4xl font-black text-black tabular-nums mt-0.5">
            ₹{currentReceipt.total.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="bg-[#BA2C2F] text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-tighter mb-1.5 flex-shrink-0">
          Paid
        </div>
      </div>

      {/* Transaction ID: Clean */}
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
          Receipt ID
        </span>
        <span className="text-sm font-mono font-bold text-black mt-1">
          #{currentReceipt.id.slice(-8)}
        </span>
      </div>
      
      {/* Date & Time: Re-added Time */}
      <div className="flex flex-col text-right">
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
          Date & Time
        </span>
        <div className="text-sm font-bold text-black mt-1">
          <span className="font-mono">{currentReceipt.date}</span>
          <span className="text-gray-400 mx-1">•</span>
          <span className="font-mono">{currentReceipt.time}</span>
        </div>
      </div>
    </div>
  </div>
</div>
          
         {/* Purchase Details Section */}
<div className="bg-white rounded-3xl shadow-xl border border-gray-100 mt-6 mx-4 p-6">

  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-sm font-bold uppercase tracking-wider flex items-center text-black">
      <Package className="mr-2 h-4 w-4 text-[#BA2C2F]" />
      Purchase Summary
    </h3>
    <span className="text-[10px] font-semibold bg-black text-white px-3 py-1 rounded-full uppercase">
      {currentReceipt.items.length} Units
    </span>
  </div>

  {/* Items List */}
  <div className="space-y-4">
    {currentReceipt.items.map((product) => (
      <div
        key={product.id}
        className="border-l-2 border-[#BA2C2F] bg-gray-50/80 rounded-r-xl p-4"
      >
        {/* Item Header */}
        <div
          className="flex items-start justify-between cursor-pointer"
          onClick={() => toggleProductExpansion(product.id)}
        >
          <div className="flex items-start flex-1">
            <ChevronRight
              className={`h-4 w-4 mt-1 mr-2 text-black transition-transform duration-200 ${
                expandedProducts.includes(product.id) ? "rotate-90" : ""
              }`}
            />
            <div>
              <div className="font-bold text-sm uppercase tracking-tight text-black">
                {product.name}
              </div>
              <div className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mt-0.5">
                {product.category}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-semibold text-gray-400 uppercase">
              QTY {product.quantity}
            </div>
            <div className="font-bold text-sm text-black mt-1">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Expanded Section: SKU and Color */}
        {expandedProducts.includes(product.id) && (
          <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 gap-y-2">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase">SKU</span>
              <span className="text-[11px] font-medium text-black uppercase">{product.itemCode}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-bold text-gray-400 uppercase">Color</span>
              <span className="text-[11px] font-bold text-black uppercase">{product.color}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase">Tax (GST)</span>
              <span className="text-[11px] font-medium text-black">₹{product.tax.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Feedback Toggle */}
        <div className="mt-3">
          <button
            onClick={() => toggleItemFeedback(product.id)}
            className="flex items-center text-[10px] font-bold uppercase tracking-wider text-[#BA2C2F]"
          >
            {expandedItemFeedback.includes(product.id) ? "Close Review" : "Rate Product"}
            <Star className={`ml-1 h-3 w-3 ${expandedItemFeedback.includes(product.id) ? "fill-[#BA2C2F]" : ""}`} />
          </button>
        </div>

        {/* Feedback Panel */}
        {expandedItemFeedback.includes(product.id) && (
          <div className="mt-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setItemRating(product.id, star)}>
                  <Star
                    className={`h-5 w-5 ${
                      star <= (itemFeedback[product.id]?.rating || 0)
                        ? "fill-black text-black"
                        : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Comfort", "Fit", "Style", "Quality"].map((tag) => {
                const isActive = itemFeedback[product.id]?.tags?.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleItemTag(product.id, tag)}
                    className={`text-[9px] font-semibold uppercase px-3 py-1 rounded-full border transition-colors ${
                      isActive
                        ? "bg-black text-white border-black"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>

  {/* Totals Section */}
  <div className="mt-8 pt-6 border-t border-gray-100 space-y-2">
    <div className="flex justify-between text-[11px] font-semibold text-gray-500 uppercase">
      <span>Subtotal</span>
      <span className="text-black">₹{currentReceipt.subtotal.toLocaleString('en-IN')}</span>
    </div>
    <div className="flex justify-between text-[11px] font-semibold text-gray-500 uppercase">
      <span>GST (12%)</span>
      <span className="text-black">₹{currentReceipt.tax.toLocaleString('en-IN')}</span>
    </div>
    <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200">
      <span className="text-sm font-bold uppercase text-black">Total Paid</span>
      <span className="text-xl font-bold text-black tracking-tighter">
        ₹{currentReceipt.total.toLocaleString('en-IN')}
      </span>
    </div>
  </div>

  {/* Payment Section */}
  <div className="mt-6">
    <div className="bg-black rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center mr-3">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-[10px] font-semibold text-white/50 uppercase">Payment Method</div>
          <div className="text-xs font-bold text-white uppercase tracking-wider">
            Card •••• 4532
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-white">
          ₹{currentReceipt.total.toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  </div>
</div>
          
          {/* Feedback Section */}
<div className="bg-white rounded-3xl border border-gray-100 shadow-xl mx-4 mt-6 p-6">

  {feedbackSubmitted ? (
    <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/20">
        <Check className="w-8 h-8 text-[#BA2C2F]" />
      </div>
      <div className="text-sm font-bold uppercase tracking-tight text-black mb-1">
        Review Submitted
      </div>
      <div className="text-[11px] text-gray-400 font-medium uppercase tracking-widest px-6 leading-relaxed">
        Thank you for sharing your experience with PUMA.
      </div>
    </div>
  ) : (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <div className="bg-black p-2.5 rounded-xl mr-4 shadow-lg shadow-black/10">
          <MessageSquare className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-tight text-black">
          Rate Your Experience
        </h3>
      </div>

      {/* Golden Star Rating */}
      <div className="flex justify-center gap-4 py-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => {
              setRating(star);
              setSelectedTags([]);
            }}
            className="transition-all duration-200 active:scale-90"
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= rating 
                  ? "fill-[#FFB800] text-[#FFB800]" 
                  : "text-gray-200"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Feedback Chips */}
      {rating > 0 && (
        <div className="space-y-3">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
            What did you like most?
          </div>
          <div className="flex flex-wrap gap-2">
            {(rating >= 4
              ? [
                  "Product Quality",
                  "Fast Checkout",
                  "Store Staff",
                  "Great Selection",
                  "Easy Returns",
                  "Design",
                ]
              : [
                  "Stock Issues",
                  "Long Queues",
                  "Sizing Help",
                  "Quality Concern",
                  "App Experience",
                  "Pricing",
                ]
            ).map((item) => (
              <button
                key={item}
                onClick={() =>
                  setSelectedTags((prev) =>
                    prev.includes(item)
                      ? prev.filter((tag) => tag !== item)
                      : [...prev, item]
                  )
                }
                className={`text-[10px] px-4 py-2 rounded-full border-2 font-bold uppercase tracking-tighter transition-all ${
                  selectedTags.includes(item)
                    ? "bg-black text-white border-black"
                    : "border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Optional Comment */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
          Additional Comments (Optional)
        </label>
        <textarea
          rows={3}
          placeholder="Tell us about your visit..."
          className="w-full p-4 text-xs font-medium bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#BA2C2F] outline-none resize-none transition-all placeholder:text-gray-300"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
        />
      </div>

      {/* Submit Button with Design Quirk */}
      <div className="pt-2">
        <button
          className={`w-full h-14 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl active:scale-[0.98] ${
            rating 
              ? "bg-black text-white shadow-black/20 hover:bg-[#BA2C2F]" 
              : "bg-transparent border-2 border-dashed border-gray-200 text-gray-300 cursor-not-allowed"
          }`}
          onClick={handleFeedbackSubmit}
          disabled={!rating}
        >
          {rating ? "Submit Review" : "Select a Rating"}
        </button>
      </div>

      <p className="text-[9px] font-bold text-center text-gray-300 uppercase tracking-tighter">
        Your feedback helps PUMA improve every day.
      </p>
    </div>
  )}
</div>
          
{/* Promo Banner Carousel */}
<div className="bg-white rounded-3xl overflow-hidden mx-4 mt-6 relative shadow-xl border border-gray-100">
  <Carousel
    className="w-full"
    setApi={setPromoApi}
    opts={{
      loop: true,
    }}
  >
    <CarouselContent>
      {/* Banner 1: RCB Launch */}
      <CarouselItem>
        <div className="relative w-full aspect-[1893/667]">
          <a
            href="https://in.puma.com/in/en/rcb-launch"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-full block"
          >
            <Image
              src="/images/design-mode/puma-banner-1.png"
              alt="PUMA RCB Launch"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay for CTA visibility if needed */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          </a>

          {/* Sharp PUMA CTA */}
          <div className="absolute bottom-6 left-6">
            <a
              href="https://in.puma.com/in/en/rcb-launch"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-white text-black text-[10px] font-bold uppercase italic tracking-widest px-6 py-2.5 rounded-sm shadow-lg hover:bg-[#BA2C2F] hover:text-white transition-colors">
                Shop Collection
              </button>
            </a>
          </div>
        </div>
      </CarouselItem>

      {/* Banner 2: Pokémon Collaboration */}
      <CarouselItem>
        <div className="relative w-full aspect-[1893/667]">
          <a
            href="https://in.puma.com/in/en/collaborations/collaborations-select/collaborations-select-pokemon"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-full block"
          >
            <Image
              src="/images/design-mode/puma-banner-2.png"
              alt="PUMA x Pokémon"
              fill
              className="object-cover"
            />
          </a>

          {/* Sharp PUMA CTA */}
          <div className="absolute bottom-6 left-6">
            <a
              href="https://in.puma.com/in/en/collaborations/collaborations-select/collaborations-select-pokemon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-white text-black text-[10px] font-bold uppercase italic tracking-widest px-6 py-2.5 rounded-sm shadow-lg hover:bg-[#BA2C2F] hover:text-white transition-colors">
                Explore Collab
              </button>
            </a>
          </div>
        </div>
      </CarouselItem>
    </CarouselContent>

    {/* Pagination Dots: PUMA Red Style */}
    <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
      {[0, 1].map((index) => (
        <button
          key={index}
          onClick={() => promoApi?.scrollTo(index)}
          className={`h-1 rounded-full transition-all duration-300 ${
            currentSlide === index
              ? "w-8 bg-[#BA2C2F]"
              : "w-2 bg-white/50 hover:bg-white"
          }`}
        />
      ))}
    </div>
  </Carousel>
</div>
          
        {/* Join Membership Section */}
<div className="bg-white rounded-3xl shadow-xl border border-gray-100 mx-4 mt-6 p-6">
  
  {profileUpdateSuccess ? (
    <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/20">
        <Check className="w-8 h-8 text-[#BA2C2F]" />
      </div>
      
      <div className="text-sm font-bold uppercase tracking-tight text-black mb-1">
        Membership Activated
      </div>
      
      <div className="text-[11px] text-gray-500 font-medium uppercase tracking-widest px-6">
        Registration complete. Your profile has been updated successfully.
      </div>
    </div>
  ) : (
    <>
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="bg-black p-2.5 rounded-xl mr-4 shadow-lg shadow-black/10">
          <User2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold uppercase tracking-tight text-black">
            Complete Your Profile
          </div>
          <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-relaxed">
            Get personalized updates, exclusive access, and faster checkout
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Athlete Name"
            value={profile.name}
            onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full h-12 px-4 text-xs font-semibold bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-[#BA2C2F] focus:bg-white transition-all placeholder:text-gray-300 uppercase"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@email.com"
              value={profile.email}
              onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full h-12 px-4 text-xs font-semibold bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-[#BA2C2F] focus:bg-white transition-all placeholder:text-gray-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">
              Mobile Number
            </label>
            <input
              type="tel"
              placeholder="+91"
              value={profile.mobile}
              onChange={(e) => setProfile((prev) => ({ ...prev, mobile: e.target.value }))}
              className="w-full h-12 px-4 text-xs font-semibold bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-[#BA2C2F] focus:bg-white transition-all placeholder:text-gray-300"
            />
          </div>
        </div>
      </div>

      <button
        className="w-full mt-8 bg-black text-white h-14 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-xl hover:bg-[#BA2C2F] transition-all active:scale-[0.98]"
        onClick={handleProfileUpdate}
      >
        Update Profile
      </button>

      <div className="text-[9px] font-medium text-gray-400 text-center mt-4 px-4 leading-relaxed uppercase tracking-tighter">
        By continuing, you agree to PUMA's <span className="underline text-black">Terms of Service</span> and Privacy Policy.
      </div>
    </>
  )}
</div>
          
         {/* Purchase Rewards Section */}
<div className="bg-white rounded-3xl shadow-xl border border-gray-100 mt-6 mx-4 p-6">
  
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center">
      <div className="w-8 h-8 bg-[#BA2C2F] rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-[#BA2C2F]/20">
        <Trophy className="h-4 w-4 text-white" />
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase tracking-tight text-black">My Rewards</h3>
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Active Status</p>
      </div>
    </div>
    <div className="text-right">
      <span className="text-[10px] font-bold bg-black text-white px-3 py-1 rounded-full uppercase">
        Member
      </span>
    </div>
  </div>

  {/* Points Overview */}
  <div className="grid grid-cols-2 gap-4 mb-6">
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Points Earned</div>
      <div className="flex items-baseline">
        <span className="text-xl font-bold text-black">+1,418</span>
        <span className="ml-1 text-[10px] font-bold text-[#BA2C2F]">Pending</span>
      </div>
    </div>

    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Total Balance</div>
      <div className="text-xl font-bold text-black">8,450</div>
    </div>
  </div>

  {/* Progress Bar */}
  <div className="bg-black rounded-2xl p-5 shadow-xl shadow-black/10">
    <div className="flex justify-between items-end mb-3">
      <div>
        <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Next Goal</div>
        <div className="text-sm font-bold text-white uppercase">Unlocked Benefits</div>
      </div>
      <div className="text-right">
        <span className="text-xs font-bold text-white tracking-tighter">₹15,000 / ₹25,000</span>
      </div>
    </div>

    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
      <div 
        className="h-full bg-[#BA2C2F] rounded-full relative"
        style={{ width: "60%" }}
      >
        <div className="absolute top-0 right-0 h-full w-4 bg-white/20 skew-x-12 transform translate-x-2" />
      </div>
    </div>

    <p className="text-[10px] font-medium text-white/60 leading-relaxed uppercase tracking-tight">
      Reach <span className="text-white font-bold">₹25,000</span> total spend to unlock additional multipliers and event access.
    </p>
  </div>

  {/* Perks */}
  <div className="mt-6">
    <div className="text-[11px] font-bold text-black uppercase tracking-widest mb-4 flex items-center">
      <Zap className="h-3 w-3 mr-2 text-[#BA2C2F]" />
      Active Perks
    </div>

    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center mr-3">
            <Ticket className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-black uppercase">₹500 Off Voucher</div>
            <div className="text-[9px] font-medium text-gray-400 uppercase tracking-tighter">Expires in 12 Days</div>
          </div>
        </div>
        <button className="text-[10px] font-bold text-[#BA2C2F] uppercase tracking-tighter hover:underline">
          Redeem
        </button>
      </div>

      <div className="flex items-center justify-between p-3 border border-gray-100 rounded-xl">
        <div className="flex items-center opacity-50">
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mr-3">
            <Gift className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-black uppercase">Birthday Surprise</div>
            <div className="text-[9px] font-medium text-gray-400 uppercase tracking-tighter">Available in June</div>
          </div>
        </div>
        <Lock className="h-3 w-3 text-gray-300 mr-2" />
      </div>
    </div>
  </div>

  {/* CTA */}
  <div className="mt-6 pt-6 border-t border-gray-100">
    <a
      href="https://in.puma.com/in/en/account/"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center w-full bg-gray-50 hover:bg-black hover:text-white border border-gray-200 rounded-xl py-3 transition-all duration-300"
    >
      <span className="text-xs font-bold uppercase tracking-widest mr-2">Account Portal</span>
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  </div>
</div>
          
{/* Featured Categories Section */}
<div className="bg-white rounded-3xl shadow-xl border border-gray-100 mx-4 mt-6 p-6">
  
  {/* Section Header */}
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center">
      <div className="bg-black p-2.5 rounded-xl mr-4 shadow-lg shadow-black/10">
        <LayoutGrid className="h-4 w-4 text-white" />
      </div>
      <h3 className="text-sm font-bold uppercase tracking-tight text-black">
        Explore More Gear
      </h3>
    </div>
  </div>

  {/* Category Grid */}
  <div className="grid grid-cols-2 gap-4">
    
    {/* Backpacks */}
    <a 
      href="https://in.puma.com/in/en/mens/mens-accessories/mens-accessories-bags"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform active:scale-[0.98]"
    >
      <Image 
        src="/images/design-mode/backpack.png" 
        alt="Backpacks" 
        fill 
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-4 left-4">
        <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-[#BA2C2F] px-2 py-1 rounded-sm">
          Backpacks
        </span>
      </div>
    </a>

    {/* Jackets */}
    <a 
      href="https://in.puma.com/in/en/mens/mens-clothing/mens-clothing-jackets"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform active:scale-[0.98]"
    >
      <Image 
        src="/images/design-mode/Jacket.png" 
        alt="Jackets" 
        fill 
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-4 left-4">
        <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-[#BA2C2F] px-2 py-1 rounded-sm">
          Jackets
        </span>
      </div>
    </a>

    {/* Shoes */}
    <a 
      href="https://in.puma.com/in/en/mens/mens-shoes"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform active:scale-[0.98]"
    >
      <Image 
        src="/images/design-mode/shoes.png" 
        alt="Shoes" 
        fill 
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-4 left-4">
        <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-[#BA2C2F] px-2 py-1 rounded-sm">
          Shoes
        </span>
      </div>
    </a>

    {/* Gym Wear */}
    <a 
      href="https://in.puma.com/in/en/mens/mens-clothing/mens-clothing-t-shirts-and-tops"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform active:scale-[0.98]"
    >
      <Image 
        src="/images/design-mode/gym-wear.png" 
        alt="Gym Wear" 
        fill 
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-4 left-4">
        <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-[#BA2C2F] px-2 py-1 rounded-sm">
          Training
        </span>
      </div>
    </a>
  </div>

  {/* Overall Website Link */}
  <div className="mt-8 pt-6 border-t border-gray-100">
    <a 
      href="https://in.puma.com/in/en/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center justify-between w-full h-14 px-6 bg-black text-white rounded-xl shadow-xl shadow-black/20 hover:bg-[#BA2C2F] transition-all group active:scale-[0.98]"
    >
      <span className="text-xs font-bold uppercase tracking-[0.2em]">Visit PUMA Store</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </a>
  </div>

  <p className="text-[9px] font-bold text-center text-gray-500 uppercase tracking-tighter mt-4">
    Exclusive drops and collections available online.
  </p>
</div>
          
         {/* Receipt Actions Section */}
<div className="bg-white rounded-3xl border border-gray-100 shadow-xl mx-4 mt-6 p-6">
  <div className="grid grid-cols-3 gap-4">

    {/* Order History */}
    <button
      ref={historyButtonRef}
      onClick={handleTransactionHistoryOpen}
      className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl py-4 transition-all hover:bg-black hover:text-white group active:scale-[0.95]"
    >
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:bg-white/10">
        <History className="h-5 w-5 text-black group-hover:text-[#BA2C2F]" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider">
        History
      </span>
    </button>

    {/* Email Receipt */}
    <button
      onClick={handleEmailReceipt}
      className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl py-4 transition-all hover:bg-black hover:text-white group active:scale-[0.95]"
    >
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:bg-white/10">
        <Mail className="h-5 w-5 text-black group-hover:text-[#BA2C2F]" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider">
        Email
      </span>
    </button>

    {/* Download Receipt */}
    <button
      onClick={handleDownloadReceipt}
      className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl py-4 transition-all hover:bg-black hover:text-white group active:scale-[0.95]"
    >
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:bg-white/10">
        <Download className="h-5 w-5 text-black group-hover:text-[#BA2C2F]" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider">
        PDF
      </span>
    </button>

  </div>
</div>
          
       {/* Need Help Section */}
<div className="bg-white rounded-3xl border border-gray-100 shadow-xl mx-4 mt-6 p-6">

  {/* Header */}
  <div className="flex items-center mb-6">
    <div className="bg-black p-2.5 rounded-xl mr-4 shadow-lg shadow-black/10">
      <Headset className="h-5 w-5 text-white" />
    </div>
    <div>
      <h3 className="text-sm font-bold uppercase tracking-tight text-black">
        PUMA Support
      </h3>
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
        Available 24/7 for Gear Assistance
      </p>
    </div>
  </div>

  <div className="grid grid-cols-3 gap-4">

    {/* WhatsApp Chat */}
    <button
      onClick={handleWhatsApp}
      className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl py-4 transition-all hover:border-[#BA2C2F] active:scale-[0.95]"
    >
      <MessageSquare className="h-5 w-5 text-black mb-2" />
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
        WhatsApp
      </span>
    </button>

    {/* Call Support */}
    <button
      onClick={handleCall}
      className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl py-4 transition-all hover:border-[#BA2C2F] active:scale-[0.95]"
    >
      <Phone className="h-5 w-5 text-black mb-2" />
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
        Call
      </span>
    </button>

    {/* Email Support */}
    <button
      onClick={handleEmail}
      className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl py-4 transition-all hover:border-[#BA2C2F] active:scale-[0.95]"
    >
      <Mail className="h-5 w-5 text-black mb-2" />
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
        Email
      </span>
    </button>

  </div>
</div>

      {/* Social Media & Store Details */}
<div className="bg-white rounded-3xl border border-gray-100 shadow-xl mx-4 mt-6 p-6 mb-8">

  {/* Header */}
  <div className="flex items-center mb-6">
    <div className="bg-black p-2.5 rounded-xl mr-4 shadow-lg shadow-black/10">
      <Share2 className="h-4 w-4 text-white" />
    </div>
    <h3 className="text-sm font-bold uppercase tracking-tight text-black">
      Stay Connected
    </h3>
  </div>

  {/* Social Links */}
  <div className="flex justify-center space-x-8 mb-8">
    {/* Instagram */}
    <button
      onClick={() => handleSocialLink("https://www.instagram.com/pumaindia/")}
      className="flex flex-col items-center group"
    >
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-2 transition-all group-hover:bg-black group-hover:text-white">
        <Instagram className="h-5 w-5" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black">Instagram</span>
    </button>

    {/* Facebook */}
    <button
      onClick={() => handleSocialLink("https://www.instagram.com/pumaindia/")}
      className="flex flex-col items-center group"
    >
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-2 transition-all group-hover:bg-black group-hover:text-white">
        <Facebook className="h-5 w-5" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black">Facebook</span>
    </button>

    {/* Website */}
    <button
      onClick={() => handleSocialLink("https://in.puma.com/in/en")}
      className="flex flex-col items-center group"
    >
      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-2 transition-all group-hover:bg-black group-hover:text-white">
        <ExternalLink className="h-5 w-5" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black">Website</span>
    </button>
  </div>

  {/* Store Location */}
  <div className="text-[11px] text-gray-600 text-center mb-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
    <button
      onClick={() => setShowStoreLocation(!showStoreLocation)}
      className="w-full flex items-center justify-center mb-2 hover:text-[#BA2C2F] transition-colors"
    >
      <MapPin className="h-4 w-4 mr-2 text-[#BA2C2F]" />
      <span className="font-bold uppercase tracking-tight text-black">
        PUMA Indiranagar {showStoreLocation ? "▲" : "▼"}
      </span>
    </button>

    {showStoreLocation && (
      <div className="mt-3 space-y-1 font-medium border-t border-gray-200 pt-3">
        <p className="font-bold text-black uppercase">PUMA Store</p>
        <p>No 777/H, 100 Feet Rd, HAL 2nd Stage</p>
        <p>Doopanahalli, Indiranagar</p>
        <p>Bengaluru, Karnataka 560008</p>
        
        <div className="mt-3 pt-3 flex flex-col gap-1 border-t border-gray-200/50">
          <p className="text-[9px] font-bold uppercase text-gray-400">GSTIN: 29AAACP3423F1Z5</p>
          <p className="text-[10px] text-black font-bold uppercase tracking-tighter">
            Store Lead: {currentReceipt.associate}
          </p>
        </div>
      </div>
    )}
  </div>

  {/* Terms */}
  <button
    className="w-full text-[10px] text-gray-400 hover:text-black h-8 font-bold uppercase tracking-widest transition-colors"
    onClick={() => setShowTerms(!showTerms)}
  >
    Terms & Conditions {showTerms ? "▲" : "▼"}
  </button>

  {showTerms && (
    <div className="text-[10px] text-gray-500 mt-3 space-y-2 px-4 font-medium leading-relaxed uppercase tracking-tighter border-l-2 border-gray-100">
      <p>• Returns accepted within 14 days with original tags and receipt.</p>
      <p>• Warranty on footwear is limited to manufacturing defects only.</p>
      <p>• PUMA AdvoCAT points are credited after the 14-day cooling period.</p>
      <p>• For online support visit in.puma.com/support.</p>
    </div>
  )}

  {/* Powered by RDEP */}
  <div className="text-center mt-6 pt-6 border-t border-gray-100">
    <div className="flex items-center justify-center space-x-2">
      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
        Powered by
      </span>
      <a
        href="https://www.rdep.io"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center opacity-80 hover:opacity-100 transition-opacity"
      >
        <Image
          src="/images/design-mode/RDEP%20cropped.png"
          alt="RDEP"
          width={55}
          height={14}
          className="object-contain"
        />
      </a>
    </div>
  </div>
</div>
          <div id="height-marker" style={{ height: "1px" }} />
        </div>

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div
            style={getModalPositionRelativeToContainer(feedbackButtonRef)}
            className="bg-white rounded-lg w-full overflow-hidden shadow-xl z-[9999] max-w-sm"
          >
            <div className="flex justify-between items-center p-4 border-b bg-blue-700 text-white">
              <h3 className="text-lg font-semibold">How was your shopping experience?</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white"
                onClick={() => setShowFeedbackModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </div>

            <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
              {[
                { key: "service", label: "Service Quality" },
                { key: "quality", label: "Product Quality" },
                { key: "style", label: "Shoe Style/Design" },
                { key: "pricing", label: "Value for Money" },
                { key: "store", label: "Store Ambiance" },
              ].map((category) => (
                <div key={category.key} className="flex items-center justify-between">
                  <span className="text-sm">{category.label}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          setFeedback((prev) => ({
                            ...prev,
                            [category.key as keyof typeof feedback]: star,
                          }))
                        }
                      >
                        <Star
                          className={`h-5 w-5 ${
                            feedback[category.key as keyof typeof feedback] >= star
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </Button>
                    ))}
                  </div>
                </div>
              ))}

              <Textarea
                placeholder="Please share your feedback about your purchase (optional)"
                className="mt-2"
                value={feedback.comments}
                onChange={(e) => setFeedback((prev) => ({ ...prev, comments: e.target.value }))}
              />
            </div>

            <div className="p-4 border-t">
              <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white" onClick={handleFeedbackSubmit}>
                Submit Feedback
              </Button>
            </div>
          </div>
        )}

  {/* Transaction History Modal */}
{showTransactionHistory && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center">

    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setShowTransactionHistory(false)}
    />

    {/* Modal */}
    <div className="relative bg-white rounded-2xl w-full max-w-sm mx-4 shadow-2xl border border-gray-200 font-poppins overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">

        <div className="flex items-center">

          <div className="bg-[#BA2C2F] p-2 rounded-lg mr-3">
            <History className="h-4 w-4 text-white" />
          </div>

          <h3 className="text-sm font-semibold text-gray-900">
            Order History
          </h3>

        </div>

        <button
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          onClick={() => setShowTransactionHistory(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-4 w-4 text-gray-500"
          >
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>

      </div>


      {/* Transaction List */}
      <div className="max-h-80 overflow-y-auto p-4 space-y-3">

        {transactionHistory.map((transaction) => (

          <button
            key={transaction.id}
            onClick={() => {
              setCurrentReceiptId(transaction.id)
              setShowTransactionHistory(false)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="w-full flex items-center p-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-[#BA2C2F] transition"
          >

            <div className="bg-white border border-gray-200 p-2 rounded-lg mr-3">
              <FileText className="h-4 w-4 text-black" />
            </div>

            <div className="flex-grow text-left">

              <div className="text-sm font-semibold text-gray-900">
                PUMA Store
              </div>

              <div className="text-[11px] text-gray-500">
                {transaction.date}
              </div>

            </div>

            <div className="text-sm font-semibold text-black">
              ₹{transaction.amount.toFixed(2)}
            </div>

          </button>

        ))}

      </div>

    </div>

  </div>
)}
        {/* Refer & Earn Modal */}
        {showReferModal && (
          <div
            style={getModalPositionRelativeToContainer(referButtonRef)}
            className="bg-white rounded-lg w-full overflow-hidden shadow-xl z-[9999] max-w-sm"
          >
            <div className="flex justify-between items-center p-4 border-b bg-blue-700 text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <Share2 className="h-5 w-5 mr-2" />
                Refer & Earn
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-blue-600"
                onClick={() => setShowReferModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="h-8 w-8 text-blue-700" />
                </div>
                <h4 className="text-lg font-semibold text-blue-700 mb-2">Share & Earn RM50!</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Refer friends to Skechers and both of you get RM50 off your next purchase!
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-xs font-medium text-blue-800 mb-1">Your Referral Code</div>
                <div className="text-lg font-bold text-blue-700 text-center">SKECH{customerName.toUpperCase()}50</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Try Skechers! Use code SKECH${customerName.toUpperCase()}50 for RM50 off!`,
                    )
                    setShowReferModal(false)
                  }}
                >
                  Copy Code
                </Button>
                <Button
                  className="bg-blue-700 hover:bg-blue-800 text-white"
                  onClick={() => {
                    window.open(
                      `https://wa.me/60362032728?text=Try Skechers Malaysia! Use my code SKECH${customerName.toUpperCase()}50 for RM50 off your next purchase!`,
                    )
                    setShowReferModal(false)
                  }}
                >
                  Share Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
