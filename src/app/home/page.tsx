import Hero from "@/components/home/Hero"
import Experiences from "@/components/home/Experiences"
import FeaturedPackages from "@/components/home/FeaturedPackages"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Testimonials from "@/components/home/Testimonials"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Experiences />
      <FeaturedPackages />
      <WhyChooseUs />
      <Testimonials />
    </div>
  )
}

