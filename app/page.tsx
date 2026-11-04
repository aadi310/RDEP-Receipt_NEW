"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
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
  Copy,
  Download,
  ExternalLink,
  FileText,
  History,
  Instagram,
  Mail,
  MessageSquare,
  Phone,
  Star,
  User2,
  Share2,
  Facebook,
  MapPin,
  Package,
  Truck,
} from "lucide-react"

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type ReceiptKey = "current" | "hist1" | "hist2"

interface ReceiptItem {
  id: number
  name: string
  color: string
  price: number
  quantity: number
  category: string
  itemCode: string
  baseAmount: number
  tax: number
}

interface DeliveryStep {
  date: string
  time: string
}

interface ReceiptData {
  id: string
  date: string // DD/MM/YYYY
  time: string
  associate: string
  branch: string
  items: ReceiptItem[]
  subtotal: number // ex GST
  tax: number // GST (10%) included in prices
  total: number
  points: number
  /** 0 = Shipped, 1 = In transit, 2 = Delivered */
  deliveryStage: 0 | 1 | 2
  delivery: {
    carrier: string
    trackingId: string
    note: string
    steps: [DeliveryStep, DeliveryStep, DeliveryStep]
  }
}

interface ItemFeedback {
  rating?: number
  tags?: string[]
}

/* -------------------------------------------------------------------------- */
/*  Static data                                                                */
/* -------------------------------------------------------------------------- */

const CUSTOMER = {
  first: "Liam",
  full: "Liam Henderson",
  addressLine1: "Unit 12, 48 Campbell Parade",
  addressLine2: "Bondi Beach NSW 2026",
}

const STORE = {
  name: "RDEP Pitt Street",
  line1: "Shop 14, 215 Pitt Street",
  line2: "Sydney NSW 2000",
  abn: "51 824 753 556",
  phone: "+61491570006",
  email: "support@rdep.io",
}

const money = (n: number) =>
  `$${n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// Prices are GST-inclusive (10%), as per Australian retail
const RECEIPTS: Record<ReceiptKey, ReceiptData> = {
  current: {
    id: "RDEP-SY7891XQ12",
    date: "03/11/2026",
    time: "4:42:18 pm",
    associate: "Emily Thompson",
    branch: "Pitt Street, Sydney",
    items: [
      {
        id: 0,
        name: "Aero Runner Sneakers",
        color: "Cloud White",
        price: 189.95,
        quantity: 1,
        category: "Footwear",
        itemCode: "RD-377745-01",
        baseAmount: 172.68,
        tax: 17.27,
      },
      {
        id: 1,
        name: "Essential Training Tee",
        color: "Midnight Black",
        price: 49.95,
        quantity: 1,
        category: "Activewear",
        itemCode: "RD-524872-02",
        baseAmount: 45.41,
        tax: 4.54,
      },
      {
        id: 2,
        name: "Performance Shorts",
        color: "Slate Grey",
        price: 64.95,
        quantity: 1,
        category: "Activewear",
        itemCode: "RD-678234-01",
        baseAmount: 59.05,
        tax: 5.9,
      },
    ],
    subtotal: 277.14,
    tax: 27.71,
    total: 304.85,
    points: 305,
    deliveryStage: 1,
    delivery: {
      carrier: "Australia Post",
      trackingId: "AP4821XQ930AU",
      note: "Your parcel has left the Sydney Metro hub and is on its way to you.",
      steps: [
        { date: "Tue 3 Nov", time: "7:30 pm" },
        { date: "Wed 4 Nov", time: "8:10 am" },
        { date: "Fri 6 Nov", time: "Estimated" },
      ],
    },
  },

  hist1: {
    id: "RDEP-BJ6719YT92",
    date: "18/10/2026",
    time: "2:22:18 pm",
    associate: "Daniel Nguyen",
    branch: "Bondi Junction, Sydney",
    items: [
      {
        id: 0,
        name: "Street Court Low",
        color: "Black-White",
        price: 139.95,
        quantity: 1,
        category: "Footwear",
        itemCode: "RD-307239-02",
        baseAmount: 127.23,
        tax: 12.72,
      },
      {
        id: 1,
        name: "RDEP Varsity Jacket",
        color: "Navy-Royal",
        price: 229.0,
        quantity: 1,
        category: "Outerwear",
        itemCode: "RD-625890-01",
        baseAmount: 208.18,
        tax: 20.82,
      },
      {
        id: 2,
        name: "Essentials Track Suit",
        color: "Medium Grey",
        price: 119.95,
        quantity: 1,
        category: "Lifestyle",
        itemCode: "RD-586747-03",
        baseAmount: 109.05,
        tax: 10.9,
      },
    ],
    subtotal: 444.46,
    tax: 44.44,
    total: 488.9,
    points: 489,
    deliveryStage: 2,
    delivery: {
      carrier: "Australia Post",
      trackingId: "AP3390YT218AU",
      note: "Delivered and left in a safe place at your front door.",
      steps: [
        { date: "Sun 18 Oct", time: "5:40 pm" },
        { date: "Mon 19 Oct", time: "9:05 am" },
        { date: "Wed 21 Oct", time: "1:25 pm" },
      ],
    },
  },

  hist2: {
    id: "RDEP-ML5590LP33",
    date: "27/09/2026",
    time: "12:45:33 pm",
    associate: "Chloe Williams",
    branch: "Melbourne Central, VIC",
    items: [
      {
        id: 0,
        name: "Court Classic Low",
        color: "Cloud White",
        price: 99.95,
        quantity: 1,
        category: "Footwear",
        itemCode: "RD-384123-05",
        baseAmount: 90.86,
        tax: 9.09,
      },
      {
        id: 1,
        name: "Heritage Zip Hoodie",
        color: "Storm Grey",
        price: 159.0,
        quantity: 1,
        category: "Lifestyle",
        itemCode: "RD-536547-01",
        baseAmount: 144.55,
        tax: 14.45,
      },
      {
        id: 2,
        name: "Training Pants",
        color: "Midnight Black",
        price: 89.95,
        quantity: 1,
        category: "Activewear",
        itemCode: "RD-523120-01",
        baseAmount: 81.77,
        tax: 8.18,
      },
    ],
    subtotal: 317.18,
    tax: 31.72,
    total: 348.9,
    points: 349,
    deliveryStage: 2,
    delivery: {
      carrier: "Australia Post",
      trackingId: "AP2275LP540AU",
      note: "Delivered and signed for by L. Henderson.",
      steps: [
        { date: "Sun 27 Sep", time: "4:15 pm" },
        { date: "Mon 28 Sep", time: "8:50 am" },
        { date: "Wed 30 Sep", time: "11:40 am" },
      ],
    },
  },
}

const COUPONS = [
  {
    code: "RDEP20",
    value: "$20",
    unit: "OFF",
    title: "Welcome back offer",
    desc: "On your next order over $150",
    expiry: "30 Nov 2026",
  },
  {
    code: "FREESHIP",
    value: "FREE",
    unit: "DELIVERY",
    title: "Free standard shipping",
    desc: "On any online order over $99",
    expiry: "15 Dec 2026",
  },
  {
    code: "MOVE15",
    value: "15%",
    unit: "OFF",
    title: "Activewear edit",
    desc: "On all training and running gear",
    expiry: "31 Dec 2026",
  },
]

const DELIVERY_STEPS = [
  { label: "Shipped", Icon: Package },
  { label: "In Transit", Icon: Truck },
  { label: "Delivered", Icon: MapPin },
]

const CATEGORIES = [
  { name: "Backpacks", img: "/images/design-mode/backpack.png" },
  { name: "Jackets", img: "/images/design-mode/Jacket.png" },
  { name: "Shoes", img: "/images/design-mode/shoes.png" },
  { name: "Activewear", img: "/images/design-mode/gym-wear.png" },
]

const SITE_URL = "https://www.rdep.io"
const RDEP_LOGO = "/images/design-mode/RDEP%20cropped.png"

const card = "bg-white rounded-3xl shadow-xl border border-gray-100 mx-4 mt-6 p-6"

/* -------------------------------------------------------------------------- */
/*  Animations (brand #180add)                                                 */
/* -------------------------------------------------------------------------- */

const RDEP_CSS = `
@keyframes rdep-ping{0%{transform:scale(1);opacity:.55}80%,100%{transform:scale(2.2);opacity:0}}
@keyframes rdep-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
@keyframes rdep-flow{from{background-position:0 0}to{background-position:16px 0}}
@keyframes rdep-sweep{0%{transform:translateX(-120%)}100%{transform:translateX(420%)}}
@keyframes rdep-truck{0%{left:0%;opacity:0}12%{opacity:1}88%{opacity:1}100%{left:100%;opacity:0}}
@keyframes rdep-blink{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes rdep-star-wave{
  0%,55%,100%{transform:translateY(0) scale(1);fill:transparent}
  25%{transform:translateY(-7px) scale(1.25);fill:#FFB800}
}
.rdep-ping{animation:rdep-ping 1.8s cubic-bezier(0,0,.2,1) infinite}
.rdep-bob{animation:rdep-bob 1.2s ease-in-out infinite}
.rdep-blink{animation:rdep-blink 1.2s ease-in-out infinite}
.rdep-flow{
  background-image:repeating-linear-gradient(90deg,#180add 0,#180add 8px,transparent 8px,transparent 16px);
  background-size:16px 100%;
  animation:rdep-flow .7s linear infinite;
}
.rdep-sweep{
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);
  animation:rdep-sweep 2.2s ease-in-out infinite;
}
.rdep-truck{
  position:absolute;
  top:50%;
  transform:translate(-50%,-50%);
  animation:rdep-truck 3.2s ease-in-out infinite;
}
.rdep-star{animation:rdep-star-wave 1.8s ease-in-out infinite}

/* ---- Cinematic reveal system ---- */
.rv{opacity:0;transform:translateY(34px) scale(.97);filter:blur(6px);
  transition:opacity .8s cubic-bezier(.22,.8,.3,1),transform .8s cubic-bezier(.22,.8,.3,1),filter .8s ease}
.rv.rv-in{opacity:1;transform:none;filter:none}
.rv-reset,.rv-reset *{transition:none!important}
.rv-c{opacity:0;transform:translateY(18px);
  transition:opacity .6s ease var(--d,0ms),transform .6s cubic-bezier(.22,.8,.3,1) var(--d,0ms)}
.rv-in .rv-c{opacity:1;transform:none}

@keyframes rdep-pop{0%{opacity:0;transform:scale(.4) rotate(-8deg)}100%{opacity:1;transform:none}}
.rv-pop-in{opacity:0}
.rv-in .rv-pop-in{animation:rdep-pop .7s cubic-bezier(.3,1.5,.5,1) both}

@keyframes rdep-wipe{
  from{clip-path:inset(-10px 100% -10px 0)}
  to{clip-path:inset(-10px -10px -10px 0)}
}
.rv-wipe{clip-path:inset(-10px 100% -10px 0)}
.rv-in .rv-wipe{animation:rdep-wipe 1.2s cubic-bezier(.4,0,.2,1) .6s both}

.rv-bar{width:0}
.rv-in .rv-bar{width:var(--w,0);transition:width 1.8s cubic-bezier(.22,.8,.3,1) .6s}

@keyframes rdep-shine{0%,55%{transform:translateX(-130%)}100%{transform:translateX(130%)}}
.rdep-shine{position:relative;overflow:hidden}
.rdep-shine::after{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.38) 50%,transparent 70%);
  transform:translateX(-130%);
  animation:rdep-shine 3.2s ease-in-out infinite;
}

.rdep-caret{display:inline-block;width:0;height:.85em;margin-left:2px;border-right:3px solid #180add;
  vertical-align:-.05em;animation:rdep-blink .8s steps(1) infinite}

@media (prefers-reduced-motion:reduce){
  .rv,.rv-c,.rv-pop-in,.rv-wipe{opacity:1!important;transform:none!important;filter:none!important;
    clip-path:none!important;transition:none!important;animation:none!important}
  .rv-bar{width:var(--w,0)!important;transition:none!important}
  .rdep-shine::after{animation:none}
}
`

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  Motion helpers                                                             */
/* -------------------------------------------------------------------------- */

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Counts up from 0 once scrolled into view. Replays whenever `value` changes. */
function CountUp({
  value,
  decimals = 0,
  prefix = "",
  delay = 0,
  duration = 1600,
}: {
  value: number
  decimals?: number
  prefix?: string
  delay?: number
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      setShown(value)
      return
    }
    setShown(0)
    let raf = 0
    let timer: ReturnType<typeof setTimeout> | undefined

    const run = () => {
      const t0 = performance.now()
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration)
        setShown(value * (1 - Math.pow(1 - p, 4)))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect()
          timer = setTimeout(run, delay)
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      if (timer) clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [value, delay, duration])

  return (
    <span ref={ref}>
      {prefix}
      {shown.toLocaleString("en-AU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  )
}

/** Types text out letter by letter with a blinking caret. Layout stays stable. */
function Typewriter({ text, delay = 0, speed = 55 }: { text: string; delay?: number; speed?: number }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setN(text.length)
      return
    }
    setN(0)
    let i = 0
    let iv: ReturnType<typeof setInterval> | undefined
    const t = setTimeout(() => {
      iv = setInterval(() => {
        i++
        setN(i)
        if (i >= text.length && iv) clearInterval(iv)
      }, speed)
    }, delay)
    return () => {
      clearTimeout(t)
      if (iv) clearInterval(iv)
    }
  }, [text, delay, speed])

  return (
    <span aria-label={text}>
      <span aria-hidden>{text.slice(0, n)}</span>
      {n < text.length && <span aria-hidden className="rdep-caret" />}
      <span aria-hidden className="opacity-0">
        {text.slice(n)}
      </span>
    </span>
  )
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showTerms, setShowTerms] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [expandedProducts, setExpandedProducts] = useState<number[]>([])
  const [currentReceiptId, setCurrentReceiptId] = useState<ReceiptKey>("current")
  const [showTransactionHistory, setShowTransactionHistory] = useState(false)
  const [showReferModal, setShowReferModal] = useState(false)
  const [showStoreLocation, setShowStoreLocation] = useState(false)
  const receiptContainerRef = useRef<HTMLDivElement>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [itemFeedback, setItemFeedback] = useState<Record<number, ItemFeedback>>({})
  const [expandedItemFeedback, setExpandedItemFeedback] = useState<number[]>([])
  const [feedback, setFeedback] = useState({
    service: 0,
    quality: 0,
    style: 0,
    pricing: 0,
    store: 0,
    comments: "",
  })
  const [profile, setProfile] = useState({ mobile: "", name: "", email: "" })
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState("")

  // Carousel refs and APIs
  const [promoApi, setPromoApi] = useState<CarouselApi>()
  const feedbackButtonRef = useRef<HTMLButtonElement>(null)
  const historyButtonRef = useRef<HTMLButtonElement>(null)
  const referButtonRef = useRef<HTMLButtonElement>(null)

  const customerName = CUSTOMER.first
  const currentReceipt = RECEIPTS[currentReceiptId]
  const stage = currentReceipt.deliveryStage
  const delivery = currentReceipt.delivery

  const transactionHistory = (Object.keys(RECEIPTS) as ReceiptKey[]).map((key) => ({
    id: key,
    date: RECEIPTS[key].date,
    branch: RECEIPTS[key].branch,
    amount: RECEIPTS[key].total,
  }))

  /* ------------------------------ Handlers -------------------------------- */

  const copyCoupon = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // clipboard may be blocked inside an iframe, still show the confirmation
    }
    setCopiedCode(code)
    setTimeout(() => setCopiedCode((prev) => (prev === code ? null : prev)), 2000)
  }

  const toggleItemFeedback = (id: number) => {
    setExpandedItemFeedback((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const setItemRating = (itemId: number, value: number) => {
    setItemFeedback((prev) => ({ ...prev, [itemId]: { ...prev[itemId], rating: value } }))
  }

  const toggleItemTag = (itemId: number, tag: string) => {
    setItemFeedback((prev) => {
      const currentTags = prev[itemId]?.tags || []
      const newTags = currentTags.includes(tag) ? currentTags.filter((t) => t !== tag) : [...currentTags, tag]
      return { ...prev, [itemId]: { ...prev[itemId], tags: newTags } }
    })
  }

  const toggleProductExpansion = (productId: number) => {
    setExpandedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const handleProfileUpdate = () => {
    setProfileUpdateSuccess(true)
    setTimeout(() => setProfileUpdateSuccess(false), 3000)
  }

  const getModalPositionRelativeToContainer = (buttonRef: React.RefObject<HTMLButtonElement | null>): React.CSSProperties => {
    if (!buttonRef.current || !receiptContainerRef.current) {
      return { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
    }

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const containerRect = receiptContainerRef.current.getBoundingClientRect()

    const relativeTop = buttonRect.top - containerRect.top
    const relativeLeft = buttonRect.left - containerRect.left

    const modalWidth = Math.min(400, containerRect.width - 32)
    const modalHeight = 400

    let top = Math.max(16, relativeTop - modalHeight - 8)
    if (top < 16) {
      top = relativeTop + buttonRect.height + 8
    }
    if (top + modalHeight > containerRect.height) {
      top = Math.max(16, (containerRect.height - modalHeight) / 2)
    }

    let left = relativeLeft + buttonRect.width / 2 - modalWidth / 2
    left = Math.max(16, Math.min(left, containerRect.width - modalWidth - 16))

    return {
      position: "absolute",
      top: `${top}px`,
      left: `${left}px`,
      width: `${modalWidth}px`,
      maxHeight: "85vh",
    }
  }

  const handleTransactionHistoryOpen = () => setShowTransactionHistory(true)

  const handleFeedbackSubmit = () => {
    setFeedbackSubmitted(true)
    setShowFeedbackModal(false)
    setTimeout(() => setFeedbackSubmitted(false), 5000)
  }

  const handleEmailReceipt = () => {
    const subject = encodeURIComponent("Receipt from RDEP Sydney")
    const body = encodeURIComponent(`Receipt ID: ${currentReceipt.id}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const handleDownloadReceipt = () => {
    const rows = currentReceipt.items
      .map(
        (item) => `
        <tr>
            <td>
                <div class="item-name">${item.name}</div>
                <div class="item-category">${item.category}</div>
            </td>
            <td>${item.quantity}</td>
            <td style="text-align:right;"><strong>${money(item.price)}</strong></td>
        </tr>`,
      )
      .join("")

    const receiptContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>RDEP Digital Receipt</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Poppins', sans-serif; font-size: 14px; color: #000; background: #fff; width: 800px; margin: 0 auto; padding: 40px; }
.receipt-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 4px solid #180add; }
.company-info h1 { font-size: 36px; color: #180add; font-weight: 700; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 8px; }
.company-info p { font-size: 12px; color: #444; line-height: 1.6; text-transform: uppercase; font-weight: 500; }
.bill-info { text-align: right; font-size: 11px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
.bill-info div { margin-bottom: 6px; }
.bill-id { font-weight: 700; color: #180add; }
.customer-section { background: #f9f9f9; padding: 20px; border-left: 6px solid #180add; border-radius: 4px; margin-bottom: 30px; }
.customer-section h3 { font-size: 14px; color: #000; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 1px; }
.customer-section p { font-size: 11px; color: #666; text-transform: uppercase; font-weight: 500; }
.items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
.items-table th { background: #180add; color: white; padding: 12px 10px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; }
.items-table td { padding: 16px 10px; border-bottom: 1px solid #eee; font-size: 12px; vertical-align: middle; }
.item-name { font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
.item-category { font-size: 10px; color: #888; text-transform: uppercase; font-weight: 600; }
.totals-section { display: flex; justify-content: space-between; margin-top: 10px; }
.items-count { font-weight: 700; font-size: 12px; text-transform: uppercase; color: #999; }
.totals-table { text-align: right; min-width: 250px; }
.totals-table div { margin-bottom: 8px; font-size: 13px; font-weight: 600; text-transform: uppercase; }
.net-total { font-size: 24px; font-weight: 700; color: #000; border-top: 3px solid #180add; padding-top: 10px; margin-top: 10px; }
.footer { text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #f0f0f0; font-size: 11px; color: #000; text-transform: uppercase; letter-spacing: 1px; }
.footer strong { color: #180add; font-size: 13px; }
.powered { margin-top: 20px; font-size: 9px; color: #bbb; font-weight: 700; letter-spacing: 2px; }
@media print { body { -webkit-print-color-adjust: exact; width: 100%; padding: 20px; } }
</style>
</head>
<body>

<div class="receipt-header">
    <div class="company-info">
        <h1>RDEP</h1>
        <p>
            <strong>RDEP Retail Pty Ltd</strong><br>
            ${STORE.line1}<br>
            ${STORE.line2}<br>
            ABN: ${STORE.abn}
        </p>
    </div>
    <div class="bill-info">
        <div>Order ID: <span class="bill-id">#${currentReceipt.id.slice(-8)}</span></div>
        <div>Date: ${currentReceipt.date}</div>
        <div>Store Lead: ${currentReceipt.associate}</div>
    </div>
</div>

<div class="customer-section">
    <h3>Customer: ${CUSTOMER.full}</h3>
    <p>${CUSTOMER.addressLine1}, ${CUSTOMER.addressLine2}</p>
</div>

<table class="items-table">
    <thead>
        <tr>
            <th style="width:60%">Product Description</th>
            <th style="width:10%">Qty</th>
            <th style="width:30%; text-align:right;">Amount (AUD)</th>
        </tr>
    </thead>
    <tbody>${rows}
    </tbody>
</table>

<div class="totals-section">
    <div class="items-count">Total Units: ${currentReceipt.items.length}</div>
    <div class="totals-table">
        <div>Subtotal (ex GST): ${money(currentReceipt.subtotal)}</div>
        <div>GST (10%): ${money(currentReceipt.tax)}</div>
        <div class="net-total">Total Paid: ${money(currentReceipt.total)}</div>
    </div>
</div>

<div class="footer">
    <p><strong>Thanks for shopping with RDEP.</strong></p>
    <p style="margin-top: 8px;">Explore the latest collections at www.rdep.io</p>
    <div class="powered">POWERED BY RDEP</div>
</div>

</body>
</html>
`

    const blob = new Blob([receiptContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `RDEP_Receipt_${currentReceipt.id}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleWhatsApp = () => window.open(`https://wa.me/${STORE.phone.replace("+", "")}`, "_blank")
  const handleCall = () => window.open(`tel:${STORE.phone}`, "_blank")
  const handleEmail = () => window.open(`mailto:${STORE.email}`, "_blank")
  const handleSocialLink = (url: string) => window.open(url, "_blank")

  /* ------------------------------- Effects -------------------------------- */

  // Auto-play for promo carousel
  useEffect(() => {
    if (!promoApi) return
    const interval = setInterval(() => promoApi.scrollNext(), 4000)
    return () => clearInterval(interval)
  }, [promoApi])

  // Keep the active slide in sync
  useEffect(() => {
    if (!promoApi) return
    const onSelect = () => setCurrentSlide(promoApi.selectedScrollSnap())
    promoApi.on("select", onSelect)
    return () => {
      promoApi.off("select", onSelect)
    }
  }, [promoApi])

  // Reset item feedback when switching receipts
  useEffect(() => {
    setItemFeedback({})
    setExpandedItemFeedback([])
    setExpandedProducts([])
  }, [currentReceiptId])

  // Cinematic scene-by-scene reveal. Cards fade/rise in as they enter the viewport,
  // their inner blocks follow in a staggered sequence. Replays on receipt switch.
  useEffect(() => {
    const root = receiptContainerRef.current
    if (!root || prefersReducedMotion()) return
    const stack = root.firstElementChild as HTMLElement | null
    if (!stack) return

    const cards = Array.from(stack.children).filter((el) => el.id !== "height-marker") as HTMLElement[]

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).classList.add("rv-in")
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    )

    cards.forEach((card) => {
      card.classList.add("rv", "rv-reset")
      card.classList.remove("rv-in")

      const kids: HTMLElement[] = []
      Array.from(card.children).forEach((child) => {
        const el = child as HTMLElement
        if (el.matches(".space-y-2,.space-y-3,.space-y-4,.space-y-6,.grid")) {
          kids.push(...(Array.from(el.children) as HTMLElement[]))
        } else {
          kids.push(el)
        }
      })
      kids.forEach((k, i) => {
        k.classList.add("rv-c")
        k.style.setProperty("--d", `${200 + i * 110}ms`)
      })

      void card.offsetWidth // commit hidden state without a transition
      card.classList.remove("rv-reset")
      io.observe(card)
    })

    return () => io.disconnect()
  }, [currentReceiptId])

  // Auto-height for WordPress iframe
  useEffect(() => {
    const postHeight = () => {
      const marker = document.getElementById("height-marker")
      if (marker && window.parent) {
        const rect = marker.getBoundingClientRect()
        const newHeight = Math.ceil(rect.top + rect.height + window.scrollY)
        window.parent.postMessage({ frameHeight: newHeight }, "*")
      }
    }

    postHeight()
    const ro = new ResizeObserver(postHeight)
    ro.observe(document.body)
    window.addEventListener("resize", postHeight)

    return () => {
      ro.disconnect()
      window.removeEventListener("resize", postHeight)
    }
  }, [])

  /* -------------------------------- Render -------------------------------- */

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <style dangerouslySetInnerHTML={{ __html: RDEP_CSS }} />

      <div
        id="receipt-root"
        ref={receiptContainerRef}
        className="w-full max-w-md mx-auto bg-white shadow-lg relative overflow-hidden"
      >
        <div className="flex flex-col w-full gap-3 pb-4 px-3">
          {/* ------------------------------------------------------------ */}
          {/* Top Section                                                  */}
          {/* ------------------------------------------------------------ */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 mt-6 mx-4 overflow-hidden">
            <div className="px-6 pt-8 pb-5 bg-white">
              <div className="flex items-center justify-between gap-4">
                <img
                  src={RDEP_LOGO}
                  alt="RDEP"
                  className="h-10 w-auto object-contain rv-pop-in"
                  style={{ animationDelay: "250ms" }}
                />

                <div
                  className="bg-gray-50 rounded-xl p-2.5 border border-gray-100 flex-shrink-0 rv-pop-in"
                  style={{ animationDelay: "450ms" }}
                >
                  <Image
                    src="/images/design-mode/800px-QR_code_for_mobile_English_Wikipedia.svg.png"
                    alt="Support QR"
                    width={40}
                    height={40}
                    className="grayscale opacity-90"
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="text-2xl font-black italic uppercase tracking-tight text-black">
                  <Typewriter text={`Thank you, ${customerName}`} delay={600} />
                </div>
                <div className="text-xs uppercase tracking-widest text-gray-500 font-medium mt-1">
                  Summary of your RDEP purchase
                </div>
              </div>
            </div>

            <div className="px-6 py-6 bg-gray-50/50 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="col-span-2 flex justify-between items-end border-b border-gray-200 pb-4 mb-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                      Total Amount (Incl. GST)
                    </div>
                    <div className="text-4xl font-black text-black tabular-nums mt-0.5">
                      <CountUp value={currentReceipt.total} prefix="$" decimals={2} delay={900} duration={1800} />
                      <span className="text-xs font-bold text-gray-400 ml-1.5 tracking-widest">AUD</span>
                    </div>
                  </div>
                  <div
                    className="bg-[#180add] text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-tighter mb-1.5 flex-shrink-0 rv-pop-in rdep-shine"
                    style={{ animationDelay: "2600ms" }}
                  >
                    Paid
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Receipt ID</span>
                  <span className="text-sm font-mono font-bold text-black mt-1">#{currentReceipt.id.slice(-8)}</span>
                </div>

                <div className="flex flex-col text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Date & Time</span>
                  <div className="text-sm font-bold text-black mt-1">
                    <span className="font-mono">{currentReceipt.date}</span>
                    <span className="text-gray-400 mx-1">•</span>
                    <span className="font-mono">{currentReceipt.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Purchase Summary                                             */}
          {/* ------------------------------------------------------------ */}
          <div className={card}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center text-black">
                <Package className="mr-2 h-4 w-4 text-[#180add]" />
                Purchase Summary
              </h3>
              <span className="text-[10px] font-semibold bg-[#180add] text-white px-3 py-1 rounded-full uppercase">
                {currentReceipt.items.length} Units
              </span>
            </div>

            <div className="space-y-4">
              {currentReceipt.items.map((product) => {
                const isOpen = expandedProducts.includes(product.id)
                const isRating = expandedItemFeedback.includes(product.id)
                const itemRatingValue = itemFeedback[product.id]?.rating || 0

                return (
                  <div key={product.id} className="border-l-2 border-[#180add] bg-gray-50/80 rounded-r-xl p-4">
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() => toggleProductExpansion(product.id)}
                    >
                      <div className="flex items-start flex-1">
                        <ChevronRight
                          className={`h-4 w-4 mt-1 mr-2 text-black transition-transform duration-200 ${
                            isOpen ? "rotate-90" : ""
                          }`}
                        />
                        <div>
                          <div className="font-bold text-sm uppercase tracking-tight text-black">{product.name}</div>
                          <div className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mt-0.5">
                            {product.category}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] font-semibold text-gray-400 uppercase">QTY {product.quantity}</div>
                        <div className="font-bold text-sm text-black mt-1">{money(product.price)}</div>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 gap-y-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-gray-400 uppercase">SKU</span>
                          <span className="text-[11px] font-medium text-black uppercase">{product.itemCode}</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[9px] font-bold text-gray-400 uppercase">Colour</span>
                          <span className="text-[11px] font-bold text-black uppercase">{product.color}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-gray-400 uppercase">GST (incl.)</span>
                          <span className="text-[11px] font-medium text-black">{money(product.tax)}</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-3">
                      <button
                        onClick={() => toggleItemFeedback(product.id)}
                        className="flex items-center text-[10px] font-bold uppercase tracking-wider text-[#180add]"
                      >
                        {isRating ? "Close Review" : "Rate Product"}
                        <Star className={`ml-1 h-3 w-3 ${isRating ? "fill-[#180add]" : ""}`} />
                      </button>
                    </div>

                    {isRating && (
                      <div className="mt-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <div className="flex justify-center gap-2 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} onClick={() => setItemRating(product.id, star)}>
                              <Star
                                className={`h-5 w-5 ${
                                  itemRatingValue === 0
                                    ? "rdep-star text-[#FFB800]"
                                    : star <= itemRatingValue
                                      ? "fill-[#180add] text-[#180add]"
                                      : "text-gray-200"
                                }`}
                                style={itemRatingValue === 0 ? { animationDelay: `${(star - 1) * 0.18}s` } : undefined}
                              />
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {["Comfort", "Fit", "Style", "Quality"].map((tag) => {
                            const isActive = itemFeedback[product.id]?.tags?.includes(tag)
                            return (
                              <button
                                key={tag}
                                onClick={() => toggleItemTag(product.id, tag)}
                                className={`text-[9px] font-semibold uppercase px-3 py-1 rounded-full border transition-colors ${
                                  isActive
                                    ? "bg-[#180add] text-white border-[#180add]"
                                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                }`}
                              >
                                {tag}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-[11px] font-semibold text-gray-500 uppercase">
                <span>Subtotal (ex GST)</span>
                <span className="text-black">{money(currentReceipt.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-gray-500 uppercase">
                <span>GST (10%)</span>
                <span className="text-black">{money(currentReceipt.tax)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200">
                <span className="text-sm font-bold uppercase text-black">Total Paid</span>
                <span className="text-xl font-bold text-black tracking-tighter">
                  <CountUp value={currentReceipt.total} prefix="$" decimals={2} delay={500} />
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="bg-[#180add] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center mr-3">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-white/60 uppercase">Payment Method</div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">Card •••• 4532</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">{money(currentReceipt.total)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Delivery Status (horizontal timeline, constant animation)    */}
          {/* ------------------------------------------------------------ */}
          <div className={card}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-[#180add] p-2.5 rounded-xl mr-4 shadow-lg shadow-[#180add]/20">
                  <Truck className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-tight text-black">Delivery Status</h3>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                    Order #{currentReceipt.id.slice(-8)}
                  </p>
                </div>
              </div>
              <span className="flex items-center text-[10px] font-bold uppercase tracking-tight text-[#180add] bg-[#180add]/10 px-3 py-1 rounded-full">
                {stage < 2 && <span className="rdep-blink mr-1.5 h-1.5 w-1.5 rounded-full bg-[#180add]" />}
                {DELIVERY_STEPS[stage].label}
              </span>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Connectors between node centres */}
              <div className="absolute top-[18px] left-[16.667%] right-[16.667%] h-1 flex rv-wipe">
                {[0, 1].map((segment) => (
                  <div key={segment} className="relative flex-1 h-full">
                    <div className="absolute inset-0 bg-gray-200 rounded-full overflow-hidden">
                      {segment < stage && (
                        <div className="absolute inset-0 bg-[#180add] overflow-hidden">
                          <div className="rdep-sweep absolute inset-y-0 left-0 w-1/3" />
                        </div>
                      )}
                      {segment === stage && <div className="rdep-flow absolute inset-0" />}
                    </div>

                    {/* Moving truck on the active leg */}
                    {segment === stage && (
                      <div className="rdep-truck">
                        <div className="h-6 w-6 rounded-full bg-white border border-[#180add]/30 shadow-md flex items-center justify-center">
                          <Truck className="h-3.5 w-3.5 text-[#180add]" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Nodes + labels */}
              <div className="relative grid grid-cols-3">
                {DELIVERY_STEPS.map((step, i) => {
                  const isDone = i < stage || (stage === 2 && i === 2)
                  const isActive = i === stage
                  const reached = i <= stage
                  const StepIcon = isDone ? Check : step.Icon

                  return (
                    <div
                      key={step.label}
                      className="flex flex-col items-center text-center rv-pop-in"
                      style={{ animationDelay: `${500 + i * 450}ms` }}
                    >
                      <div className="relative z-10 h-10 w-10">
                        {isActive && <span className="rdep-ping absolute inset-0 rounded-full bg-[#180add]/40" />}
                        <div
                          className={`relative h-10 w-10 rounded-full flex items-center justify-center ${
                            isDone
                              ? "bg-[#180add] shadow-lg shadow-[#180add]/30"
                              : isActive
                                ? "bg-white border-2 border-[#180add] shadow-lg shadow-[#180add]/20"
                                : "bg-gray-50 border-2 border-dashed border-gray-300"
                          }`}
                        >
                          <StepIcon
                            className={`h-4 w-4 ${isActive && !isDone ? "rdep-bob" : ""} ${
                              isDone ? "text-white" : isActive ? "text-[#180add]" : "text-gray-300"
                            }`}
                          />
                        </div>
                      </div>

                      <div
                        className={`mt-3 text-[10px] font-bold uppercase tracking-wider ${
                          reached ? "text-black" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-[10px] font-semibold text-gray-500 mt-0.5">{delivery.steps[i].date}</div>
                      <div className="text-[10px] font-medium text-gray-400">{delivery.steps[i].time}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Details */}
            <div className="mt-8 bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <p className="text-[11px] font-semibold text-black leading-relaxed">{delivery.note}</p>

              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-y-3 gap-x-4">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Carrier</span>
                  <span className="text-[11px] font-bold text-black">{delivery.carrier}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Tracking ID</span>
                  <span className="text-[11px] font-mono font-bold text-black">{delivery.trackingId}</span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">
                    {stage === 2 ? "Delivered to" : "Delivering to"}
                  </span>
                  <span className="text-[11px] font-bold text-black">{CUSTOMER.full}</span>
                  <span className="text-[11px] font-medium text-gray-600">
                    {CUSTOMER.addressLine1}, {CUSTOMER.addressLine2}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Coupons                                                      */}
          {/* ------------------------------------------------------------ */}
          <div className={card}>
            <div className="flex items-center mb-6">
              <div className="bg-[#180add] p-2.5 rounded-xl mr-4 shadow-lg shadow-[#180add]/20">
                <Ticket className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-tight text-black">Your Coupons</h3>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                  {COUPONS.length} offers ready to use
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {COUPONS.map((coupon) => {
                const copied = copiedCode === coupon.code
                return (
                  <div key={coupon.code} className="relative flex rounded-2xl overflow-hidden bg-gray-50 shadow-sm">
                    {/* Stub */}
                    <div className="w-24 shrink-0 bg-[#180add] text-white flex flex-col items-center justify-center py-5 rdep-shine">
                      <div className="text-2xl font-black italic leading-none">{coupon.value}</div>
                      <div className="text-[9px] font-bold uppercase tracking-widest mt-1.5 text-white/80">
                        {coupon.unit}
                      </div>
                    </div>

                    {/* Ticket notches */}
                    <span className="absolute left-[88px] -top-2 h-4 w-4 rounded-full bg-white" />
                    <span className="absolute left-[88px] -bottom-2 h-4 w-4 rounded-full bg-white" />

                    {/* Details */}
                    <div className="flex-1 min-w-0 p-4 border-l-2 border-dashed border-gray-200">
                      <div className="text-xs font-bold uppercase tracking-tight text-black">{coupon.title}</div>
                      <div className="text-[10px] font-medium text-gray-500 mt-0.5">{coupon.desc}</div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                        Valid until {coupon.expiry}
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 min-w-0 border border-dashed border-[#180add]/40 bg-white rounded-lg px-3 py-1.5 font-mono text-xs font-bold tracking-widest text-[#180add] truncate">
                          {coupon.code}
                        </div>
                        <button
                          onClick={() => copyCoupon(coupon.code)}
                          className={`flex items-center text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg transition-all active:scale-95 ${
                            copied ? "bg-black text-white" : "bg-[#180add] text-white hover:bg-[#1208b0]"
                          }`}
                        >
                          {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="text-[9px] font-bold text-center text-gray-400 uppercase tracking-tighter mt-5">
              Apply at checkout on rdep.io or show the code in store.
            </p>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Feedback                                                     */}
          {/* ------------------------------------------------------------ */}
          <div className={card}>
            {feedbackSubmitted ? (
              <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-[#180add] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#180add]/30">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-bold uppercase tracking-tight text-black mb-1">Review Submitted</div>
                <div className="text-[11px] text-gray-400 font-medium uppercase tracking-widest px-6 leading-relaxed">
                  Thank you for sharing your experience with RDEP.
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-[#180add] p-2.5 rounded-xl mr-4 shadow-lg shadow-[#180add]/20">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-tight text-black">Rate Your Experience</h3>
                </div>

                {/* Stars: waving until the customer taps one */}
                <div>
                  <div className="flex justify-center gap-4 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => {
                          setRating(star)
                          setSelectedTags([])
                        }}
                        className="transition-all duration-200 active:scale-90"
                        aria-label={`Rate ${star} out of 5`}
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            rating === 0
                              ? "rdep-star text-[#FFB800]"
                              : star <= rating
                                ? "fill-[#FFB800] text-[#FFB800]"
                                : "text-gray-200"
                          }`}
                          style={rating === 0 ? { animationDelay: `${(star - 1) * 0.18}s` } : undefined}
                        />
                      </button>
                    ))}
                  </div>
                  {rating === 0 && (
                    <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      Tap a star to rate
                    </p>
                  )}
                </div>

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
                              prev.includes(item) ? prev.filter((tag) => tag !== item) : [...prev, item],
                            )
                          }
                          className={`text-[10px] px-4 py-2 rounded-full border-2 font-bold uppercase tracking-tighter transition-all ${
                            selectedTags.includes(item)
                              ? "bg-[#180add] text-white border-[#180add]"
                              : "border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-100"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Additional Comments (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your visit..."
                    className="w-full p-4 text-xs font-medium bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-[#180add] outline-none resize-none transition-all placeholder:text-gray-300"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <button
                    className={`w-full h-14 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all active:scale-[0.98] ${
                      rating
                        ? "bg-[#180add] text-white shadow-xl shadow-[#180add]/25 hover:bg-[#1208b0]"
                        : "bg-transparent border-2 border-dashed border-gray-200 text-gray-300 cursor-not-allowed"
                    }`}
                    onClick={handleFeedbackSubmit}
                    disabled={!rating}
                  >
                    {rating ? "Submit Review" : "Select a Rating"}
                  </button>
                </div>

                <p className="text-[9px] font-bold text-center text-gray-300 uppercase tracking-tighter">
                  Your feedback helps RDEP improve every day.
                </p>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Promo Banner Carousel                                        */}
          {/* ------------------------------------------------------------ */}
          <div className="bg-white rounded-3xl overflow-hidden mx-4 mt-6 relative shadow-xl border border-gray-100">
            <Carousel className="w-full" setApi={setPromoApi} opts={{ loop: true }}>
              <CarouselContent>
                {[1, 2].map((n) => (
                  <CarouselItem key={n}>
                    <a
                      href={SITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block w-full aspect-video"
                    >
                      <Image
                        src={`/images/design-mode/rdep-banner-${n}.png`}
                        alt={`RDEP banner ${n}`}
                        fill
                        sizes="(max-width: 448px) 100vw, 448px"
                        className="object-cover"
                        priority={n === 1}
                      />
                    </a>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
                {[0, 1].map((index) => (
                  <button
                    key={index}
                    onClick={() => promoApi?.scrollTo(index)}
                    aria-label={`Go to banner ${index + 1}`}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "w-8 bg-[#180add] ring-1 ring-white/70"
                        : "w-2 bg-white/50 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </Carousel>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Membership                                                   */}
          {/* ------------------------------------------------------------ */}
          <div className={card}>
            {profileUpdateSuccess ? (
              <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-[#180add] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#180add]/30">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-bold uppercase tracking-tight text-black mb-1">Membership Activated</div>
                <div className="text-[11px] text-gray-500 font-medium uppercase tracking-widest px-6">
                  Registration complete. Your profile has been updated successfully.
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center mb-6">
                  <div className="bg-[#180add] p-2.5 rounded-xl mr-4 shadow-lg shadow-[#180add]/20">
                    <User2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-tight text-black">Complete Your Profile</div>
                    <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-relaxed">
                      Get personalised updates, exclusive access, and faster checkout
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={profile.name}
                      onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full h-12 px-4 text-xs font-semibold bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-[#180add] focus:bg-white transition-all placeholder:text-gray-300 uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="name@email.com.au"
                        value={profile.email}
                        onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full h-12 px-4 text-xs font-semibold bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-[#180add] focus:bg-white transition-all placeholder:text-gray-300"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em] ml-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+61"
                        value={profile.mobile}
                        onChange={(e) => setProfile((prev) => ({ ...prev, mobile: e.target.value }))}
                        className="w-full h-12 px-4 text-xs font-semibold bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-[#180add] focus:bg-white transition-all placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <button
                  className="w-full mt-8 bg-[#180add] text-white h-14 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-[#180add]/25 hover:bg-[#1208b0] transition-all active:scale-[0.98]"
                  onClick={handleProfileUpdate}
                >
                  Update Profile
                </button>

                <div className="text-[9px] font-medium text-gray-400 text-center mt-4 px-4 leading-relaxed uppercase tracking-tighter">
                  By continuing, you agree to RDEP's <span className="underline text-black">Terms of Service</span> and
                  Privacy Policy.
                </div>
              </>
            )}
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Rewards                                                      */}
          {/* ------------------------------------------------------------ */}
          <div className={card}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#180add] rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-[#180add]/20">
                  <Trophy className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-tight text-black">My Rewards</h3>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Active Status</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold bg-[#180add] text-white px-3 py-1 rounded-full uppercase">
                  Member
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Points Earned</div>
                <div className="flex items-baseline">
                  <span className="text-xl font-bold text-black">
                    +<CountUp value={currentReceipt.points} delay={600} />
                  </span>
                  <span className="ml-1 text-[10px] font-bold text-[#180add]">Pending</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Total Balance</div>
                <div className="text-xl font-bold text-black">
                  <CountUp value={2850} delay={800} duration={2000} />
                </div>
              </div>
            </div>

            <div className="bg-[#180add] rounded-2xl p-5 shadow-xl shadow-[#180add]/20">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Next Goal</div>
                  <div className="text-sm font-bold text-white uppercase">Unlocked Benefits</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white tracking-tighter">$1,500 / $2,500</span>
                </div>
              </div>

              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-white rounded-full relative rv-bar"
                  style={{ "--w": "60%" } as React.CSSProperties}
                >
                  <div className="absolute top-0 right-0 h-full w-4 bg-white/40 skew-x-12 transform translate-x-2" />
                </div>
              </div>

              <p className="text-[10px] font-medium text-white/70 leading-relaxed uppercase tracking-tight">
                Reach <span className="text-white font-bold">$2,500</span> total spend to unlock additional
                multipliers and event access.
              </p>
            </div>

            <div className="mt-6">
              <div className="text-[11px] font-bold text-black uppercase tracking-widest mb-4 flex items-center">
                <Zap className="h-3 w-3 mr-2 text-[#180add]" />
                Active Perks
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <Ticket className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-black uppercase">$20 Off Voucher</div>
                      <div className="text-[9px] font-medium text-gray-400 uppercase tracking-tighter">
                        Expires in 12 Days
                      </div>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold text-[#180add] uppercase tracking-tighter hover:underline">
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
                      <div className="text-[9px] font-medium text-gray-400 uppercase tracking-tighter">
                        Available in June
                      </div>
                    </div>
                  </div>
                  <Lock className="h-3 w-3 text-gray-300 mr-2" />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-full bg-gray-50 hover:bg-[#180add] hover:text-white border border-gray-200 rounded-xl py-3 transition-all duration-300"
              >
                <span className="text-xs font-bold uppercase tracking-widest mr-2">Account Portal</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Featured Categories                                          */}
          {/* ------------------------------------------------------------ */}
          <div className={card}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-[#180add] p-2.5 rounded-xl mr-4 shadow-lg shadow-[#180add]/20">
                  <LayoutGrid className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-tight text-black">Explore More Gear</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((category) => (
                <a
                  key={category.name}
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform active:scale-[0.98]"
                >
                  <Image
                    src={category.img}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-[#180add] px-2 py-1 rounded-sm">
                      {category.name}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full h-14 px-6 bg-[#180add] text-white rounded-xl shadow-xl shadow-[#180add]/25 hover:bg-[#1208b0] transition-all group active:scale-[0.98]"
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Visit RDEP Store</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <p className="text-[9px] font-bold text-center text-gray-500 uppercase tracking-tighter mt-4">
              Exclusive drops and collections available online.
            </p>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Receipt Actions                                              */}
          {/* ------------------------------------------------------------ */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl mx-4 mt-6 p-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "History", Icon: History, onClick: handleTransactionHistoryOpen, ref: historyButtonRef },
                { label: "Email", Icon: Mail, onClick: handleEmailReceipt, ref: undefined },
                { label: "PDF", Icon: Download, onClick: handleDownloadReceipt, ref: undefined },
              ].map(({ label, Icon, onClick, ref }) => (
                <button
                  key={label}
                  ref={ref}
                  onClick={onClick}
                  className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl py-4 transition-all hover:bg-[#180add] hover:text-white group active:scale-[0.95]"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:bg-white/15">
                    <Icon className="h-5 w-5 text-[#180add] group-hover:text-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Support                                                      */}
          {/* ------------------------------------------------------------ */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl mx-4 mt-6 p-6">
            <div className="flex items-center mb-6">
              <div className="bg-[#180add] p-2.5 rounded-xl mr-4 shadow-lg shadow-[#180add]/20">
                <Headset className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-tight text-black">RDEP Support</h3>
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                  Available 7 days for Order Assistance
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "WhatsApp", Icon: MessageSquare, onClick: handleWhatsApp },
                { label: "Call", Icon: Phone, onClick: handleCall },
                { label: "Email", Icon: Mail, onClick: handleEmail },
              ].map(({ label, Icon, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl py-4 transition-all hover:border-[#180add] active:scale-[0.95]"
                >
                  <Icon className="h-5 w-5 text-[#180add] mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Social & Store Details                                       */}
          {/* ------------------------------------------------------------ */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl mx-4 mt-6 p-6 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-[#180add] p-2.5 rounded-xl mr-4 shadow-lg shadow-[#180add]/20">
                <Share2 className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-tight text-black">Stay Connected</h3>
            </div>

            <div className="flex justify-center space-x-8 mb-8">
              {[
                { label: "Instagram", Icon: Instagram, url: "https://www.instagram.com/rdep.io/" },
                { label: "Facebook", Icon: Facebook, url: "https://www.facebook.com/rdep.io/" },
                { label: "Website", Icon: ExternalLink, url: SITE_URL },
              ].map(({ label, Icon, url }) => (
                <button
                  key={label}
                  onClick={() => handleSocialLink(url)}
                  className="flex flex-col items-center group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-2 transition-all group-hover:bg-[#180add] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black">
                    {label}
                  </span>
                </button>
              ))}
            </div>

            <div className="text-[11px] text-gray-600 text-center mb-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <button
                onClick={() => setShowStoreLocation(!showStoreLocation)}
                className="w-full flex items-center justify-center mb-2 hover:text-[#180add] transition-colors"
              >
                <MapPin className="h-4 w-4 mr-2 text-[#180add]" />
                <span className="font-bold uppercase tracking-tight text-black">
                  {STORE.name} {showStoreLocation ? "▲" : "▼"}
                </span>
              </button>

              {showStoreLocation && (
                <div className="mt-3 space-y-1 font-medium border-t border-gray-200 pt-3">
                  <p className="font-bold text-black uppercase">RDEP Store</p>
                  <p>{STORE.line1}</p>
                  <p>{STORE.line2}</p>

                  <div className="mt-3 pt-3 flex flex-col gap-1 border-t border-gray-200/50">
                    <p className="text-[9px] font-bold uppercase text-gray-400">ABN: {STORE.abn}</p>
                    <p className="text-[10px] text-black font-bold uppercase tracking-tighter">
                      Store Lead: {currentReceipt.associate}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              className="w-full text-[10px] text-gray-400 hover:text-black h-8 font-bold uppercase tracking-widest transition-colors"
              onClick={() => setShowTerms(!showTerms)}
            >
              Terms & Conditions {showTerms ? "▲" : "▼"}
            </button>

            {showTerms && (
              <div className="text-[10px] text-gray-500 mt-3 space-y-2 px-4 font-medium leading-relaxed uppercase tracking-tighter border-l-2 border-gray-100">
                <p>• Returns accepted within 30 days with original tags and receipt.</p>
                <p>• Our goods come with guarantees that cannot be excluded under the Australian Consumer Law.</p>
                <p>• RDEP Rewards points are credited after the 14-day cooling period.</p>
                <p>• For online support visit rdep.io/support.</p>
              </div>
            )}

            <div className="text-center mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Powered by</span>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center opacity-80 hover:opacity-100 transition-opacity"
                >
                  <Image src={RDEP_LOGO} alt="RDEP" width={55} height={14} className="object-contain" />
                </a>
              </div>
            </div>
          </div>

          <div id="height-marker" style={{ height: "1px" }} />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Feedback Modal                                                   */}
        {/* ---------------------------------------------------------------- */}
        {showFeedbackModal && (
          <div
            style={getModalPositionRelativeToContainer(feedbackButtonRef)}
            className="bg-white rounded-lg w-full overflow-hidden shadow-xl z-[9999] max-w-sm"
          >
            <div className="flex justify-between items-center p-4 border-b bg-[#180add] text-white">
              <h3 className="text-lg font-semibold">How was your shopping experience?</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/15 hover:text-white"
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
                { key: "style", label: "Style / Design" },
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
                            (feedback[category.key as keyof typeof feedback] as number) >= star
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
              <Button className="w-full bg-[#180add] hover:bg-[#1208b0] text-white" onClick={handleFeedbackSubmit}>
                Submit Feedback
              </Button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Transaction History Modal                                        */}
        {/* ---------------------------------------------------------------- */}
        {showTransactionHistory && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowTransactionHistory(false)}
            />

            <div className="relative bg-white rounded-2xl w-full max-w-sm mx-4 shadow-2xl border border-gray-200 font-poppins overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="bg-[#180add] p-2 rounded-lg mr-3">
                    <History className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Order History</h3>
                </div>

                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  onClick={() => setShowTransactionHistory(false)}
                  aria-label="Close order history"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-gray-500">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto p-4 space-y-3">
                {transactionHistory.map((transaction) => (
                  <button
                    key={transaction.id}
                    onClick={() => {
                      setCurrentReceiptId(transaction.id)
                      setShowTransactionHistory(false)
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    className={`w-full flex items-center p-3 bg-gray-50 border rounded-xl hover:border-[#180add] transition ${
                      transaction.id === currentReceiptId ? "border-[#180add]" : "border-gray-200"
                    }`}
                  >
                    <div className="bg-white border border-gray-200 p-2 rounded-lg mr-3">
                      <FileText className="h-4 w-4 text-black" />
                    </div>

                    <div className="flex-grow text-left">
                      <div className="text-sm font-semibold text-gray-900">RDEP Store</div>
                      <div className="text-[11px] text-gray-500">
                        {transaction.date} • {transaction.branch}
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-black">{money(transaction.amount)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Refer & Earn Modal                                               */}
        {/* ---------------------------------------------------------------- */}
        {showReferModal && (
          <div
            style={getModalPositionRelativeToContainer(referButtonRef)}
            className="bg-white rounded-lg w-full overflow-hidden shadow-xl z-[9999] max-w-sm"
          >
            <div className="flex justify-between items-center p-4 border-b bg-[#180add] text-white">
              <h3 className="text-lg font-semibold flex items-center">
                <Share2 className="h-5 w-5 mr-2" />
                Refer & Earn
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/15 hover:text-white"
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
                <div className="w-16 h-16 bg-[#180add]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="h-8 w-8 text-[#180add]" />
                </div>
                <h4 className="text-lg font-semibold text-[#180add] mb-2">Share & Earn $20!</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Refer friends to RDEP and both of you get $20 off your next purchase!
                </p>
              </div>
              <div className="bg-[#180add]/5 p-3 rounded-lg border border-[#180add]/20">
                <div className="text-xs font-medium text-[#180add] mb-1">Your Referral Code</div>
                <div className="text-lg font-bold text-[#180add] text-center">RDEP{customerName.toUpperCase()}20</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-[#180add]/40 text-[#180add] hover:bg-[#180add]/5 bg-transparent"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Try RDEP! Use code RDEP${customerName.toUpperCase()}20 for $20 off!`,
                    )
                    setShowReferModal(false)
                  }}
                >
                  Copy Code
                </Button>
                <Button
                  className="bg-[#180add] hover:bg-[#1208b0] text-white"
                  onClick={() => {
                    const text = encodeURIComponent(
                      `Try RDEP! Use my code RDEP${customerName.toUpperCase()}20 for $20 off your next purchase!`,
                    )
                    window.open(`https://wa.me/?text=${text}`)
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
