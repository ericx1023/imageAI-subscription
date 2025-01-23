import AuthCheck from '@/app/components/features/AuthCheck'
import Hero from '@/app/components/layout/Hero'
import FeatureList from '@/app/components/features/FeatureList'
import Testimonials from '@/app/components/features/Testimonials'

export default async function Home() {
  return (
    <div className="">
      <Hero />
      <FeatureList />
      <Testimonials />
    </div>
  )
} 