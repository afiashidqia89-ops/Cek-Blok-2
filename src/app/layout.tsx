import type { Metadata } from 'next';
import Link from 'next/link';
import { LayoutDashboard, MapPinned, Leaf } from 'lucide-react';
import './globals.css';
export const metadata:Metadata={title:'Cek Blok',description:'Monitoring data estate, kebun, afdeling, dan blok'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body><aside><div className="brand"><span><Leaf size={22}/></span><div><b>Cek Blok</b><small>Field Intelligence</small></div></div><nav><Link href="/"><LayoutDashboard size={18}/>Dashboard</Link><Link href="/blok"><MapPinned size={18}/>Data Blok</Link></nav><div className="aside-foot">GitHub · Vercel · Neon</div></aside><main>{children}</main></body></html>}
