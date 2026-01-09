"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  MoreVertical,
  MapPin,
  Star,
  Heart,
  CheckCircle,
  Phone,
  MessageCircle,
  Calendar,
  Mail,
  ExternalLink,
  Instagram,
  Facebook,
  Globe,
  Play,
  Grid3X3,
  LayoutGrid,
  Briefcase,
  Award,
  Users,
  Shield,
  Camera,
  Plus,
  Crown,
  X,
  Copy,
  Flag,
  UserMinus,
  Bookmark,
  BookmarkCheck,
  Clock,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Send,
  Linkedin,
  Twitter,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Info,
  Package,
  Sparkles,
  TrendingUp,
  Eye,
  ThumbsUp,
  MessageSquare,
  Image as ImageIcon,
  Verified,
  BadgeCheck,
} from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";

const SmartMedia = dynamic(() => import("@/components/mobile/SmartMediaLoader"), {
  loading: () => <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl" />,
  ssr: false,
});

const TABS = [
  { id: "posts", label: "Posts", icon: Grid3X3 },
  { id: "reels", label: "Reels", icon: Play },
  { id: "portfolio", label: "Portfolio", icon: LayoutGrid },
  { id: "services", label: "Services", icon: Package },
];

const MOCK_HIGHLIGHTS = [
  {
    id: 1,
    title: "Events",
    image:
      "https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/24e51fea-306e-4c66-b329-56b20346ff7a/admin_uploads/b6b75577-d774-42d2-909d-81b144c9ff7d.jpg",
    count: 12,
    items: Array.from({ length: 5 }, (_, i) => ({
      id: i,
      image: `https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/e1579b34-dd0c-4252-bf60-416c3b5e2df9/admin_uploads/85352ef0-f918-4b8c-9f90-1e68a1ffdbef.webp`,
      caption: `Event highlight ${i + 1}`,
    })),
  },
  {
    id: 2,
    title: "Reviews",
    image:
      "https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/54fa5dae-1fb4-4368-bf19-e57fc9c59835/admin_uploads/8627e098-311a-4f47-8a0f-54a618e6e4bf.webp",
    count: 45,
    items: Array.from({ length: 8 }, (_, i) => ({
      id: i,
      image: `https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/24e51fea-306e-4c66-b329-56b20346ff7a/admin_uploads/b6b75577-d774-42d2-909d-81b144c9ff7d.jpg`,
      caption: `Review ${i + 1}`,
    })),
  },
  {
    id: 3,
    title: "Behind",
    image:
      "https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/24e51fea-306e-4c66-b329-56b20346ff7a/admin_uploads/b6b75577-d774-42d2-909d-81b144c9ff7d.jpg",
    count: 8,
    items: Array.from({ length: 4 }, (_, i) => ({
      id: i,
      image: `https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/e1579b34-dd0c-4252-bf60-416c3b5e2df9/admin_uploads/85352ef0-f918-4b8c-9f90-1e68a1ffdbef.webp`,
      caption: `Behind the scenes ${i + 1}`,
    })),
  },
  {
    id: 4,
    title: "Awards",
    image:
      "https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/24e51fea-306e-4c66-b329-56b20346ff7a/admin_uploads/b6b75577-d774-42d2-909d-81b144c9ff7d.jpg",
    count: 6,
    items: Array.from({ length: 3 }, (_, i) => ({
      id: i,
      image: `https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/e1579b34-dd0c-4252-bf60-416c3b5e2df9/admin_uploads/85352ef0-f918-4b8c-9f90-1e68a1ffdbef.webp`,
      caption: `Award ${i + 1}`,
    })),
  },
  {
    id: 5,
    title: "Team",
    image:
      "https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/24e51fea-306e-4c66-b329-56b20346ff7a/admin_uploads/b6b75577-d774-42d2-909d-81b144c9ff7d.jpg",
    count: 15,
    items: Array.from({ length: 6 }, (_, i) => ({
      id: i,
      image: `https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/e1579b34-dd0c-4252-bf60-416c3b5e2df9/admin_uploads/85352ef0-f918-4b8c-9f90-1e68a1ffdbef.webp`,
      caption: `Team member ${i + 1}`,
    })),
  },
];

const MOCK_POSTS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  type: "image",
  thumbnail: `https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/24e51fea-306e-4c66-b329-56b20346ff7a/admin_uploads/b6b75577-d774-42d2-909d-81b144c9ff7d.jpg`,
  fullImage: `https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/24e51fea-306e-4c66-b329-56b20346ff7a/admin_uploads/b6b75577-d774-42d2-909d-81b144c9ff7d.jpg`,
  likes: Math.floor(Math.random() * 500) + 50,
  comments: Math.floor(Math.random() * 100) + 10,
  caption: `Beautiful moment captured at event #${
    i + 1
  }. Working with amazing clients is always a pleasure! ✨ #photography #events #wedding`,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  isLiked: Math.random() > 0.5,
  isSaved: Math.random() > 0.7,
}));

const MOCK_REELS = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  type: "video",
  thumbnail: `https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/e1579b34-dd0c-4252-bf60-416c3b5e2df9/admin_uploads/85352ef0-f918-4b8c-9f90-1e68a1ffdbef.webp`,
  videoUrl: `https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/e1579b34-dd0c-4252-bf60-416c3b5e2df9/admin_uploads/85352ef0-f918-4b8c-9f90-1e68a1ffdbef.webp`,
  views: `${Math.floor(Math.random() * 50) + 10}K`,
  likes: Math.floor(Math.random() * 1000) + 100,
  comments: Math.floor(Math.random() * 200) + 20,
  duration: `0:${Math.floor(Math.random() * 50) + 10}`,
  caption: `Amazing reel from recent event! 🎬`,
}));

const MOCK_PORTFOLIO = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  type: "collection",
  title: [
    "Wedding Collection",
    "Corporate Events",
    "Birthday Parties",
    "Anniversary",
    "Product Shoots",
    "Fashion",
    "Portraits",
    "Travel",
    "Food",
    "Architecture",
    "Sports",
    "Music Events",
    "Art Gallery",
    "Nature",
    "Street",
  ][i],
  thumbnail: `https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/24e51fea-306e-4c66-b329-56b20346ff7a/admin_uploads/b6b75577-d774-42d2-909d-81b144c9ff7d.jpg`,
  count: Math.floor(Math.random() * 20) + 5,
  images: Array.from(
    { length: 8 },
    (_, j) =>
      `https://imageswedding.theweddingcompany.com/bh_prod_bucket/weddings/24e51fea-306e-4c66-b329-56b20346ff7a/admin_uploads/b6b75577-d774-42d2-909d-81b144c9ff7d.jpg`
  ),
}));

const MOCK_SERVICES = [
  {
    id: 1,
    name: "Wedding Photography",
    price: "₹50,000",
    duration: "Full Day",
    description: "Complete wedding coverage with 500+ edited photos",
    popular: true,
    rating: 4.9,
    bookings: 120,
  },
  {
    id: 2,
    name: "Pre-Wedding Shoot",
    price: "₹25,000",
    duration: "4-5 Hours",
    description: "Creative pre-wedding photoshoot at location of choice",
    popular: true,
    rating: 4.8,
    bookings: 85,
  },
  {
    id: 3,
    name: "Corporate Event",
    price: "₹35,000",
    duration: "Half Day",
    description: "Professional coverage for corporate events",
    popular: false,
    rating: 4.7,
    bookings: 45,
  },
  {
    id: 4,
    name: "Birthday Party",
    price: "₹15,000",
    duration: "3-4 Hours",
    description: "Candid and posed photography for birthday celebrations",
    popular: false,
    rating: 4.9,
    bookings: 200,
  },
  {
    id: 5,
    name: "Product Photography",
    price: "₹5,000",
    duration: "Per Product",
    description: "High-quality product shots for e-commerce",
    popular: true,
    rating: 4.8,
    bookings: 150,
  },
  {
    id: 6,
    name: "Portrait Session",
    price: "₹8,000",
    duration: "2 Hours",
    description: "Professional portrait photography session",
    popular: false,
    rating: 4.9,
    bookings: 95,
  },
];

const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Priya Sharma",
    avatar: "/api/placeholder/50/50",
    rating: 5,
    date: "2 weeks ago",
    comment: "Absolutely amazing work! The photos from our wedding are breathtaking. Highly recommend!",
    helpful: 24,
  },
  {
    id: 2,
    name: "Rahul Verma",
    avatar: "/api/placeholder/50/50",
    rating: 5,
    date: "1 month ago",
    comment: "Professional, punctual, and incredibly talented. The corporate event photos exceeded our expectations.",
    helpful: 18,
  },
  {
    id: 3,
    name: "Anita Desai",
    avatar: "/api/placeholder/50/50",
    rating: 4,
    date: "2 months ago",
    comment: "Great experience overall. Beautiful candid shots. Would definitely book again.",
    helpful: 12,
  },
  {
    id: 4,
    name: "Vikram Singh",
    avatar: "/api/placeholder/50/50",
    rating: 5,
    date: "3 months ago",
    comment: "The pre-wedding shoot was magical! They made us feel so comfortable in front of the camera.",
    helpful: 31,
  },
];

const AVAILABILITY_SLOTS = [
  { date: "Today", slots: ["10:00 AM", "2:00 PM", "4:00 PM"] },
  { date: "Tomorrow", slots: ["9:00 AM", "11:00 AM", "3:00 PM", "5:00 PM"] },
  { date: "Jan 12", slots: ["10:00 AM", "1:00 PM"] },
  { date: "Jan 13", slots: ["9:00 AM", "12:00 PM", "3:00 PM"] },
];

const ProfilePictureModal = ({ isOpen, onClose, image, name }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/10 rounded-full"
        >
          <X size={24} className="text-white" />
        </motion.button>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-72 h-72 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl"
        >
          <SmartMedia
            src={image}
            type="image"
            className="w-full h-full object-cover"
            loaderImage="/GlowLoadingGif.gif"
          />
        </motion.div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-20 text-white font-bold text-xl"
        >
          {name}
        </motion.p>
      </motion.div>
    )}
  </AnimatePresence>
);

const StoryViewer = ({ highlight, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < highlight.items.length - 1) {
            setCurrentIndex((i) => i + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [currentIndex, isPaused, highlight.items.length, onClose]);

  const goNext = () => {
    if (currentIndex < highlight.items.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black"
    >
      <div className="absolute top-0 left-0 right-0 z-10 p-3 flex gap-1">
        {highlight.items.map((_, idx) => (
          <div key={idx} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              style={{ width: idx < currentIndex ? "100%" : idx === currentIndex ? `${progress}%` : "0%" }}
            />
          </div>
        ))}
      </div>

      <div className="absolute top-10 left-0 right-0 z-10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/50">
            <SmartMedia
              src={highlight.image}
              type="image"
              className="w-full h-full object-cover"
              loaderImage="/GlowLoadingGif.gif"
            />
          </div>
          <div>
            <p className="text-white font-bold text-sm">{highlight.title}</p>
            <p className="text-white/60 text-xs">{highlight.items[currentIndex]?.caption}</p>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
          <X size={28} className="text-white" />
        </motion.button>
      </div>

      <div
        className="absolute inset-0 flex"
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="w-1/3 h-full" onClick={goPrev} />
        <div className="w-1/3 h-full" />
        <div className="w-1/3 h-full" onClick={goNext} />
      </div>

      <SmartMedia
        src={highlight.items[currentIndex]?.image}
        type="image"
        className="w-full h-full object-cover"
        loaderImage="/GlowLoadingGif.gif"
      />

      <div className="absolute bottom-8 left-0 right-0 px-4">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-full px-4 py-3">
          <input
            type="text"
            placeholder="Send a message..."
            className="flex-1 bg-transparent text-white placeholder-white/50 text-sm outline-none"
          />
          <motion.button whileTap={{ scale: 0.9 }}>
            <Send size={20} className="text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const PostDetailModal = ({ post, onClose, vendorName }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col"
    >
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-white/10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
          <X size={24} className="text-white" />
        </motion.button>
        <span className="text-white font-bold text-sm">Post</span>
        <motion.button whileTap={{ scale: 0.9 }}>
          <MoreVertical size={24} className="text-white" />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="aspect-square bg-gray-900">
          <SmartMedia
            src={post.fullImage || post.thumbnail}
            type="image"
            className="w-full h-full object-cover"
            loaderImage="/GlowLoadingGif.gif"
          />
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button whileTap={{ scale: 0.9 }} onClick={handleLike}>
                <Heart size={28} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} />
              </motion.button>
              <motion.button whileTap={{ scale: 0.9 }}>
                <MessageCircle size={28} className="text-white" />
              </motion.button>
              <motion.button whileTap={{ scale: 0.9 }}>
                <Send size={28} className="text-white" />
              </motion.button>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsSaved(!isSaved)}>
              {isSaved ? (
                <BookmarkCheck size={28} className="text-white fill-white" />
              ) : (
                <Bookmark size={28} className="text-white" />
              )}
            </motion.button>
          </div>

          <p className="text-white font-bold text-sm">{likes.toLocaleString()} likes</p>

          <div className="space-y-1">
            <p className="text-white text-sm">
              <span className="font-bold">{vendorName}</span> {post.caption}
            </p>
            <p className="text-gray-400 text-xs">{post.date}</p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-gray-400 text-sm mb-3">View all {post.comments} comments</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700" />
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm outline-none"
              />
              <motion.button whileTap={{ scale: 0.9 }} className="text-blue-500 font-bold text-sm">
                Post
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ReelViewer = ({ reel, onClose, vendorName }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(reel.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black"
    >
      <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
          <ArrowLeft size={28} className="text-white" />
        </motion.button>
        <span className="text-white font-bold text-sm">Reels</span>
        <motion.button whileTap={{ scale: 0.9 }}>
          <Camera size={28} className="text-white" />
        </motion.button>
      </div>

      <div className="absolute inset-0" onClick={() => setIsPlaying(!isPlaying)}>
        <SmartMedia
          src={reel.thumbnail}
          type="image"
          className="w-full h-full object-cover"
          loaderImage="/GlowLoadingGif.gif"
        />
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30"
            >
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center">
                <Play size={40} className="text-white ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6">
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleLike} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
            <Heart size={24} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} />
          </div>
          <span className="text-white text-xs font-bold">
            {likes >= 1000 ? `${(likes / 1000).toFixed(1)}K` : likes}
          </span>
        </motion.button>

        <motion.button whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
            <MessageCircle size={24} className="text-white" />
          </div>
          <span className="text-white text-xs font-bold">{reel.comments}</span>
        </motion.button>

        <motion.button whileTap={{ scale: 0.9 }} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
            <Send size={24} className="text-white" />
          </div>
          <span className="text-white text-xs font-bold">Share</span>
        </motion.button>

        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsMuted(!isMuted)}>
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
            {isMuted ? <VolumeX size={24} className="text-white" /> : <Volume2 size={24} className="text-white" />}
          </div>
        </motion.button>
      </div>

      <div className="absolute left-4 right-20 bottom-8 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 ring-2 ring-white/50" />
          <span className="text-white font-bold text-sm">{vendorName}</span>
          <motion.button whileTap={{ scale: 0.95 }} className="px-4 py-1.5 bg-white/20 backdrop-blur-xl rounded-lg">
            <span className="text-white text-xs font-bold">Follow</span>
          </motion.button>
        </div>
        <p className="text-white text-sm line-clamp-2">{reel.caption}</p>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white/20" />
          <p className="text-white/80 text-xs">Original Audio</p>
        </div>
      </div>
    </motion.div>
  );
};

const PortfolioViewer = ({ portfolio, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black"
    >
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-white/10">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
          <X size={24} className="text-white" />
        </motion.button>
        <div className="text-center">
          <span className="text-white font-bold text-sm block">{portfolio.title}</span>
          <span className="text-white/60 text-xs">
            {currentIndex + 1} of {portfolio.images.length}
          </span>
        </div>
        <motion.button whileTap={{ scale: 0.9 }}>
          <Share2 size={24} className="text-white" />
        </motion.button>
      </div>

      <div className="flex-1 overflow-x-auto snap-x snap-mandatory flex">
        {portfolio.images.map((img, idx) => (
          <div key={idx} className="w-full flex-shrink-0 snap-center flex items-center justify-center p-4">
            <SmartMedia
              src={img}
              type="image"
              className="max-w-full max-h-[70vh] object-contain rounded-xl"
              loaderImage="/GlowLoadingGif.gif"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 left-0 right-0 px-4">
        <div className="flex gap-2 justify-center mb-4">
          {portfolio.images.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? "bg-white" : "bg-white/30"}`}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-3 bg-white rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2"
          >
            <Calendar size={18} />
            Book This Style
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} className="py-3 px-4 bg-white/10 backdrop-blur-xl rounded-xl">
            <Heart size={20} className="text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const BookingDrawer = ({ isOpen, onClose, services, vendorName }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [step, setStep] = useState(1);

  const handleBook = () => {
    if (selectedService && selectedDate && selectedSlot) {
      toast.success(`Booking confirmed for ${selectedService.name} on ${selectedDate} at ${selectedSlot}`);
      onClose();
      setStep(1);
      setSelectedService(null);
      setSelectedDate("");
      setSelectedSlot("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl max-h-[90vh] overflow-hidden"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Book {vendorName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Step {step} of 3</p>
                </div>
                <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
                  <X size={24} className="text-gray-500" />
                </motion.button>
              </div>
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-1 rounded-full transition-colors ${
                      s <= step ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 dark:text-white">Select a Service</h4>
                  {services.map((service) => (
                    <motion.button
                      key={service.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedService(service)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                        selectedService?.id === service.id
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 dark:text-white">{service.name}</span>
                          {service.popular && (
                            <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold rounded-full">
                              POPULAR
                            </span>
                          )}
                        </div>
                        <span className="font-black text-blue-600">{service.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{service.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {service.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-500 fill-yellow-500" />
                          {service.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {service.bookings} booked
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 dark:text-white">Select Date & Time</h4>
                  {AVAILABILITY_SLOTS.map((day) => (
                    <div key={day.date} className="space-y-2">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{day.date}</p>
                      <div className="flex flex-wrap gap-2">
                        {day.slots.map((slot) => (
                          <motion.button
                            key={`${day.date}-${slot}`}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedDate(day.date);
                              setSelectedSlot(slot);
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                              selectedDate === day.date && selectedSlot === slot
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {slot}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 dark:text-white">Confirm Booking</h4>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Service</span>
                        <span className="font-bold text-gray-900 dark:text-white">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Date</span>
                        <span className="font-bold text-gray-900 dark:text-white">{selectedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Time</span>
                        <span className="font-bold text-gray-900 dark:text-white">{selectedSlot}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Duration</span>
                        <span className="font-bold text-gray-900 dark:text-white">{selectedService?.duration}</span>
                      </div>
                      <div className="pt-3 border-t border-blue-200 dark:border-blue-700 flex justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">Total</span>
                        <span className="font-black text-xl text-blue-600">{selectedService?.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                    <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Free cancellation up to 24 hours before the appointment
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-900 px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              {step > 1 && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-300"
                >
                  Back
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (step < 3) setStep(step + 1);
                  else handleBook();
                }}
                disabled={step === 1 ? !selectedService : step === 2 ? !selectedSlot : false}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 3 ? "Confirm Booking" : "Continue"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ReviewsDrawer = ({ isOpen, onClose, reviews, vendorName }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl max-h-[85vh] overflow-hidden"
        >
          <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 pt-4 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Reviews</h3>
              <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
                <X size={24} className="text-gray-500" />
              </motion.button>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-gray-900 dark:text-white">4.8</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= 4 ? "text-yellow-500 fill-yellow-500" : "text-yellow-500 fill-yellow-500/50"}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Based on {reviews.length * 31} reviews</span>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(85vh-150px)] p-6 space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <SmartMedia
                        src={review.avatar}
                        type="image"
                        className="w-full h-full object-cover"
                        loaderImage="/GlowLoadingGif.gif"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">{review.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        className={star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
                >
                  <ThumbsUp size={12} />
                  <span>Helpful ({review.helpful})</span>
                </motion.button>
              </div>
            ))}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-blue-600 rounded-xl font-bold text-white text-sm"
            >
              Write a Review
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const MoreOptionsDrawer = ({ isOpen, onClose, onReport, onBlock, isSaved, onSave }) => {
  const options = [
    {
      id: "save",
      label: isSaved ? "Remove from Saved" : "Save Profile",
      icon: isSaved ? BookmarkCheck : Bookmark,
      action: onSave,
    },
    { id: "share", label: "Share Profile", icon: Share2, action: () => {} },
    {
      id: "copy",
      label: "Copy Profile Link",
      icon: Copy,
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
        onClose();
      },
    },
    { id: "report", label: "Report", icon: Flag, action: onReport, danger: true },
    { id: "block", label: "Block", icon: UserMinus, action: onBlock, danger: true },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-6"
          >
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />
            <div className="space-y-2">
              {options.map((option) => (
                <motion.button
                  key={option.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    option.action();
                    if (option.id !== "copy") onClose();
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    option.danger
                      ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <option.icon size={22} />
                  <span className="font-medium">{option.label}</span>
                </motion.button>
              ))}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-full mt-4 py-4 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-300"
            >
              Cancel
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ShareModal = ({ isOpen, onClose, vendorName }) => {
  const shareOptions = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500",
      action: () => window.open(`https://wa.me/?text=Check out ${vendorName} on PlanWAB! ${window.location.href}`),
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: Facebook,
      color: "bg-blue-600",
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`),
    },
    {
      id: "twitter",
      label: "Twitter",
      icon: Twitter,
      color: "bg-sky-500",
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=Check out ${vendorName} on PlanWAB!&url=${window.location.href}`
        ),
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700",
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`),
    },
    {
      id: "instagram",
      label: "Instagram",
      icon: Instagram,
      color: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
      action: () => toast.info("Open Instagram to share"),
    },
    {
      id: "email",
      label: "Email",
      icon: Mail,
      color: "bg-gray-600",
      action: () => window.open(`mailto:?subject=Check out ${vendorName}&body=${window.location.href}`),
    },
    {
      id: "sms",
      label: "SMS",
      icon: MessageSquare,
      color: "bg-green-600",
      action: () => window.open(`sms:?body=Check out ${vendorName} on PlanWAB! ${window.location.href}`),
    },
    {
      id: "copy",
      label: "Copy Link",
      icon: Copy,
      color: "bg-gray-500",
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!");
        onClose();
      },
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-6"
          >
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-bold text-center mb-6 text-gray-900 dark:text-white">Share Profile</h3>
            <div className="grid grid-cols-4 gap-4">
              {shareOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={option.action}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-14 h-14 rounded-2xl ${option.color} flex items-center justify-center shadow-lg`}>
                    <option.icon size={24} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ContactDrawer = ({ isOpen, onClose, vendor }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-6"
        >
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-5" />
          <h3 className="text-lg font-bold text-center mb-6 text-gray-900 dark:text-white">Contact Options</h3>
          <div className="space-y-3">
            <motion.a
              href={`tel:${vendor?.phoneNo}`}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Phone size={24} />
              </div>
              <div>
                <p className="font-bold">Call Now</p>
                <p className="text-sm opacity-80">{vendor?.phoneNo || "+91 98765 43210"}</p>
              </div>
            </motion.a>
            <motion.a
              href={`https://wa.me/${vendor?.whatsappNo || vendor?.phoneNo}`}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageCircle size={24} />
              </div>
              <div>
                <p className="font-bold">WhatsApp</p>
                <p className="text-sm opacity-80">Chat on WhatsApp</p>
              </div>
            </motion.a>
            <motion.a
              href={`mailto:${vendor?.email || "contact@vendor.com"}`}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Mail size={24} />
              </div>
              <div>
                <p className="font-bold">Email</p>
                <p className="text-sm opacity-80">{vendor?.email || "contact@vendor.com"}</p>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const StatsModal = ({ isOpen, onClose, stat, vendor }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              {stat && <stat.icon size={32} className="text-white" />}
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{stat?.value}</h3>
            <p className="text-gray-500 dark:text-gray-400">{stat?.label}</p>
          </div>
          <div className="space-y-3 mb-6">
            {stat?.label === "Reviews" && (
              <>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">5 Star Reviews</span>
                  <span className="font-bold text-gray-900 dark:text-white">89</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">4 Star Reviews</span>
                  <span className="font-bold text-gray-900 dark:text-white">28</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Response Rate</span>
                  <span className="font-bold text-green-600">98%</span>
                </div>
              </>
            )}
            {stat?.label === "Trust Score" && (
              <>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Verified Identity</span>
                  <CheckCircle size={18} className="text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Business Verified</span>
                  <CheckCircle size={18} className="text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Since</span>
                  <span className="font-bold text-gray-900 dark:text-white">2019</span>
                </div>
              </>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-gray-700 dark:text-gray-300"
          >
            Close
          </motion.button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const VendorProfilePageWrapper = () => {
  const { id } = useParams();
  const router = useRouter();

  const [vendor, setVendor] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  const [showShareModal, setShowShareModal] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showBookingDrawer, setShowBookingDrawer] = useState(false);
  const [showReviewsDrawer, setShowReviewsDrawer] = useState(false);
  const [showContactDrawer, setShowContactDrawer] = useState(false);
  const [showProfilePicture, setShowProfilePicture] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const [selectedStat, setSelectedStat] = useState(null);
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedReel, setSelectedReel] = useState(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const headerRef = useRef(null);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/vendor/${id}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setVendor(data);
        setProfile(data.vendorProfile || (Array.isArray(data.vendorProfile) ? data.vendorProfile[0] : {}));
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: vendor?.name,
        text: `Check out ${vendor?.name} on PlanWAB!`,
        url: window.location.href,
      });
    } else {
      setShowShareModal(true);
    }
  }, [vendor]);

  const handleFollow = useCallback(() => {
    setIsFollowing((prev) => !prev);
    toast.success(isFollowing ? "Unfollowed" : "Following");
  }, [isFollowing]);

  const handleSaveProfile = useCallback(() => {
    setIsSaved((prev) => !prev);
    toast.success(isSaved ? "Removed from saved" : "Profile saved");
  }, [isSaved]);

  const handleReport = useCallback(() => {
    toast.success("Report submitted. We'll review this profile.");
  }, []);

  const handleBlock = useCallback(() => {
    toast.success("Profile blocked");
    router.back();
  }, [router]);

  const stats = useMemo(
    () => [
      { label: "Reviews", value: vendor?.reviews || "124", icon: Star },
      { label: "Trust Score", value: "4.8", icon: Shield },
      { label: "Liked", value: "2.5K", icon: Heart },
      { label: "Services", value: vendor?.bookings || "340", icon: Briefcase },
    ],
    [vendor]
  );

  const handleStatClick = (stat) => {
    setSelectedStat(stat);
    if (stat.label === "Reviews") {
      setShowReviewsDrawer(true);
    } else {
      setShowStatsModal(true);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <div className="grid grid-cols-3 gap-0.5 p-0.5">
            {MOCK_POSTS.map((post) => (
              <motion.div
                key={post.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedPost(post)}
                className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden relative group cursor-pointer"
              >
                <SmartMedia
                  src={post.thumbnail}
                  type="image"
                  className="w-full h-full object-cover"
                  loaderImage="/GlowLoadingGif.gif"
                />
                <div className="absolute inset-0 bg-black/0 group-active:bg-black/40 transition-colors flex items-center justify-center gap-4 text-white text-xs font-bold opacity-0 group-active:opacity-100">
                  <span className="flex items-center gap-1">
                    <Heart size={14} className="fill-white" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} className="fill-white" />
                    {post.comments}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "reels":
        return (
          <div className="grid grid-cols-3 gap-0.5 p-0.5">
            {MOCK_REELS.map((reel) => (
              <motion.div
                key={reel.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedReel(reel)}
                className="aspect-[9/16] bg-gray-100 dark:bg-gray-800 overflow-hidden relative group cursor-pointer"
              >
                <SmartMedia
                  src={reel.thumbnail}
                  type="image"
                  className="w-full h-full object-cover"
                  loaderImage="/GlowLoadingGif.gif"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center gap-1 text-white text-xs font-bold">
                    <Play size={10} className="fill-white" />
                    {reel.views}
                  </div>
                </div>
                <div className="absolute top-2 right-2 text-white text-[9px] font-bold bg-black/60 px-1.5 py-0.5 rounded">
                  {reel.duration}
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "portfolio":
        return (
          <div className="grid grid-cols-2 gap-3 p-4">
            {MOCK_PORTFOLIO.map((item) => (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedPortfolio(item)}
                className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden relative cursor-pointer shadow-sm"
              >
                <SmartMedia
                  src={item.thumbnail}
                  type="image"
                  className="w-full h-full object-cover"
                  loaderImage="/GlowLoadingGif.gif"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-bold text-sm mb-0.5 truncate">{item.title}</p>
                  <p className="text-white/70 text-xs">{item.count} photos</p>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center">
                  <LayoutGrid size={14} className="text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "services":
        return (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900 dark:text-white">Services & Packages</h3>
              <span className="text-sm text-gray-500">{MOCK_SERVICES.length} services</span>
            </div>
            {MOCK_SERVICES.map((service) => (
              <motion.div
                key={service.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowBookingDrawer(true);
                }}
                className="p-4 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-sm space-y-3 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 dark:text-white">{service.name}</span>
                      {service.popular && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[9px] font-bold rounded-full flex items-center gap-1">
                          <Sparkles size={8} />
                          POPULAR
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-blue-600">{service.price}</span>
                    <p className="text-[10px] text-gray-500">{service.duration}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      {service.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {service.bookings} booked
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!vendor || !profile) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6 shadow-lg">
          <Camera size={40} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          The profile you're looking for doesn't exist or has been removed.
        </p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-sm shadow-lg shadow-blue-500/25"
        >
          Go Back
        </motion.button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black pb-24">
      <motion.div
        ref={headerRef}
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50"
      >
        <div className="flex items-center justify-center px-4 py-3">
          <span className="font-bold text-gray-900 dark:text-white">{vendor.name}</span>
        </div>
      </motion.div>

      <div className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
          </motion.button>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
            >
              <Share2 size={18} className="text-gray-900 dark:text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMoreOptions(true)}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
            >
              <MoreVertical size={18} className="text-gray-900 dark:text-white" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900/50 rounded-b-3xl shadow-sm">
        <div className="px-5 pt-2 pb-5">
          <div className="flex items-start gap-5 mb-5">
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfilePicture(true)}
              className="relative cursor-pointer"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden p-[3px] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 shadow-lg shadow-purple-500/25">
                <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
                  {profile.profilePicture ? (
                    <SmartMedia
                      src={profile.profilePicture}
                      type="image"
                      className="w-full h-full object-cover"
                      loaderImage="/GlowLoadingGif.gif"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <Camera size={36} className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              {vendor.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-3 border-white dark:border-gray-900 shadow-md">
                  <BadgeCheck size={16} className="text-white" />
                </div>
              )}
            </motion.div>

            <div className="flex-1 flex justify-around pt-3">
              {stats.map((stat, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStatClick(stat)}
                  className="flex flex-col items-center min-w-0 group"
                >
                  <span className="text-lg font-black text-gray-900 dark:text-white group-active:text-blue-600 transition-colors">
                    {stat.value}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                    {stat.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-2 mb-5">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {vendor.name}
                {vendor.isPremium && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold rounded-full flex items-center gap-1">
                    <Crown size={9} />
                    PRO
                  </span>
                )}
              </h2>
              {profile.tagline && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{profile.tagline}</p>}
            </div>

            {profile.bio && <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{profile.bio}</p>}

            <div className="flex flex-wrap items-center gap-3 text-xs">
              {vendor.address?.city && (
                <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <MapPin size={12} />
                  {vendor.address.city}
                </span>
              )}
              {vendor.category && (
                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium">
                  {vendor.category}
                </span>
              )}
            </div>

            {(profile.website || profile.socialLinks?.instagram) && (
              <div className="flex items-center gap-3 text-xs pt-1">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 font-medium"
                  >
                    <Globe size={12} />
                    Website
                    <ExternalLink size={10} />
                  </a>
                )}
                {profile.socialLinks?.instagram && (
                  <a
                    href={profile.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full text-pink-600 dark:text-pink-400 font-medium"
                  >
                    <Instagram size={12} />
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 mb-5">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleFollow}
              className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                isFollowing
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
              }`}
            >
              {isFollowing ? <CheckCircle size={14} /> : <Plus size={14} />}
              {isFollowing ? "Following" : "Follow"}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBookingDrawer(true)}
              className="py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Calendar size={14} />
              Book
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowContactDrawer(true)}
              className="py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Phone size={14} />
              Call
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(`https://wa.me/${vendor.whatsappNo || vendor.phoneNo}`)}
              className="py-2.5 bg-green-500 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-sm shadow-green-500/25"
            >
              <MessageCircle size={14} />
              Chat
            </motion.button>
          </div>

          <div className="overflow-x-auto no-scrollbar -mx-5 px-5">
            <div className="flex gap-4 py-1">
              {MOCK_HIGHLIGHTS.map((highlight) => (
                <motion.button
                  key={highlight.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedHighlight(highlight)}
                  className="flex flex-col items-center gap-2 min-w-[72px]"
                >
                  <div className="w-[68px] h-[68px] rounded-2xl overflow-hidden p-[2px] bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-md">
                    <div className="w-full h-full rounded-[14px] overflow-hidden bg-white dark:bg-gray-900">
                      <SmartMedia
                        src={highlight.image}
                        type="image"
                        className="w-full h-full object-cover"
                        loaderImage="/GlowLoadingGif.gif"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 truncate w-full text-center">
                    {highlight.title}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-[52px] z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 mt-2">
        <div className="flex">
          {TABS.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3.5 flex items-center justify-center gap-2 relative"
            >
              <tab.icon
                size={20}
                className={activeTab === tab.id ? "text-gray-900 dark:text-white" : "text-gray-400"}
              />
              <span
                className={`text-xs font-semibold ${
                  activeTab === tab.id ? "text-gray-900 dark:text-white" : "text-gray-400"
                }`}
              >
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-gray-900 dark:bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-900 min-h-[50vh]"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      <ProfilePictureModal
        isOpen={showProfilePicture}
        onClose={() => setShowProfilePicture(false)}
        image={profile.profilePicture || "/api/placeholder/400/400"}
        name={vendor.name}
      />

      <AnimatePresence>
        {selectedHighlight && <StoryViewer highlight={selectedHighlight} onClose={() => setSelectedHighlight(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPost && (
          <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} vendorName={vendor.name} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedReel && (
          <ReelViewer reel={selectedReel} onClose={() => setSelectedReel(null)} vendorName={vendor.name} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPortfolio && (
          <PortfolioViewer portfolio={selectedPortfolio} onClose={() => setSelectedPortfolio(null)} />
        )}
      </AnimatePresence>

      <BookingDrawer
        isOpen={showBookingDrawer}
        onClose={() => setShowBookingDrawer(false)}
        services={MOCK_SERVICES}
        vendorName={vendor.name}
      />

      <ReviewsDrawer
        isOpen={showReviewsDrawer}
        onClose={() => setShowReviewsDrawer(false)}
        reviews={MOCK_REVIEWS}
        vendorName={vendor.name}
      />

      <ContactDrawer isOpen={showContactDrawer} onClose={() => setShowContactDrawer(false)} vendor={vendor} />

      <MoreOptionsDrawer
        isOpen={showMoreOptions}
        onClose={() => setShowMoreOptions(false)}
        onReport={handleReport}
        onBlock={handleBlock}
        isSaved={isSaved}
        onSave={handleSaveProfile}
      />

      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} vendorName={vendor.name} />

      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        stat={selectedStat}
        vendor={vendor}
      />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
};

export default VendorProfilePageWrapper;
