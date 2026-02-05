"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Sparkles, Heart, MapPin, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/yasser-mir-iMnIu-GoEeE-unsplash-1.jpg"
          alt="About Wasturwan Travels"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white/90 tracking-[0.15em] uppercase text-xs font-bold">
              Our Story
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-bold mb-6">About Wasturwan Travels</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">Discover the story behind Kashmir's premier travel agency.</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-8">Our Mission & Vision</h2>
            <div className="space-y-6">
              <p className="text-lg text-slate-600 leading-relaxed">
                At Wasturwan Travels, our mission is to showcase the breathtaking beauty of Kashmir and Jammu to the world. We believe in providing authentic, immersive, and comfortable experiences that go beyond standard sightseeing.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Founded by local experts, we have deep roots in the valley. This allows us to offer exclusive access to hidden gems, local culture, and the warm hospitality that Jammu &amp; Kashmir is known for.
              </p>
            </div>
            <div className="mt-10">
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-6 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
          >
            <Image
              src="/1767803735796.jpeg"
              alt="Kashmir Landscape"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-white border border-blue-100"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Passion</h3>
            <p className="text-slate-600 leading-relaxed">
              We are passionate about showcasing the beauty and culture of Kashmir to travelers from around the world.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-100"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Authenticity</h3>
            <p className="text-slate-600 leading-relaxed">
              Our local expertise ensures authentic experiences that connect you with the true spirit of Kashmir.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Excellence</h3>
            <p className="text-slate-600 leading-relaxed">
              We strive for excellence in every detail, ensuring your journey is nothing short of extraordinary.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
