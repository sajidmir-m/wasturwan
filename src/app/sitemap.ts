import { MetadataRoute } from 'next'
import { getJourneys } from '@/lib/actions/journeys'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get base URL from environment variable or use default
  // Make sure to set NEXT_PUBLIC_SITE_URL in your .env.local file
  // Example: NEXT_PUBLIC_SITE_URL=https://wasturwantravels.com
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://wasturwantravels.com')

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Dynamic routes - Fetch packages from database
  let dynamicRoutes: MetadataRoute.Sitemap = []
  
  try {
    const { data: packages } = await getJourneys()
    
    if (packages && packages.length > 0) {
      dynamicRoutes = packages
        .filter((pkg: any) => pkg.status === 'active') // Only include active packages
        .map((pkg: any) => ({
          url: `${baseUrl}/packages/${pkg.id}`,
          lastModified: pkg.updated_at ? new Date(pkg.updated_at) : new Date(pkg.created_at),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }))
    }
  } catch (error) {
    console.error('Error fetching packages for sitemap:', error)
    // Continue without dynamic routes if there's an error
  }

  return [...staticRoutes, ...dynamicRoutes]
}

