"use client"

import { motion } from "framer-motion"
import { Quote, Sparkles } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Aisha & Rahul",
    location: "Mumbai",
    text: "We wanted something more than just sightseeing. Wasturwan Travels gave us a journey. The houseboat stay was magical, but the local guides made it unforgettable.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2459&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "The Williams Family",
    location: "London",
    text: "Safe, luxurious, and deeply authentic. As a family of four, we felt taken care of at every step. The children loved the pony rides in Pahalgam!",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2662&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Elena Rossi",
    location: "Italy",
    text: "I have traveled to the Alps, but the Himalayas have a different soul. Thank you for showing me the hidden valleys where no other tourists go.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2765&auto=format&fit=crop"
  }
]

export default function Testimonials() {
  return (
    <section className="py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 tracking-[0.15em] uppercase text-xs font-bold">
            Guest Stories
          </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-slate-900">
            Memories made in the mountains.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 relative border border-slate-200/50 h-full flex flex-col">
                <div className="absolute top-6 right-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <p className="text-slate-600 text-lg leading-relaxed mb-8 font-serif italic flex-grow pt-4">
                "{testimonial.text}"
              </p>

                <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden relative bg-slate-200 ring-2 ring-slate-100">
                    <Image
                      src={testimonial.image} 
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                   />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-900 text-base">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500 uppercase tracking-wider font-medium">{testimonial.location}</p>
                  </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
