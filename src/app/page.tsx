"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, FileSignature, Scale } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-100 absolute w-[100%]">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-lg ml-4 p-2 font-bold text-gray-800">
            Document AI Assistant
          </h1>
          <nav>
            <Button onClick={()=>{
              router.push('/login')
            }} variant="ghost">Login</Button>
            <Button onClick={()=>{
              router.push('/signup')
            }}>Sign Up</Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your AI-Powered Legal Assistant
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Streamline your legal work with advanced AI technology
          </p>
          <Button size="lg" className="text-lg px-8">
            Get Started
          </Button>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileSignature className="h-6 w-6" />
                Document Drafting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Contracts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Complaints
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Motions
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Document Summarization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Quickly summarize lengthy legal documents, saving you time and
                improving comprehension.
              </p>
              <Button variant="outline">Learn More</Button>
            </CardContent>
          </Card>
        </section>

        {/* Pricing Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Pricing</h2>
          <p className="text-xl text-gray-600 mb-8">
          800/month. 
             Contact number:- 8484917439     
          </p>
          <Button size="lg" className="text-lg px-8 border border-black text-black bg-white">
            Subscribe Now
          </Button>
        </section>

        <section className="text-center">
          <h3 className="text-4xl font-bold mb-4">
            Why Choose LegalAI Assistant?
          </h3>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div>
              <Scale className="h-12 w-12 text-black mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Accuracy</h4>
              <p className="text-gray-700">
                AI-powered precision in legal document creation and analysis
              </p>
            </div>
            <div>
              <FileText className="h-12 w-12 text-black mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Efficiency</h4>
              <p className="text-gray-700">
                Save time with rapid document drafting and summarization
              </p>
            </div>
            <div>
              <CheckCircle className="h-12 w-12 text-black mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Compliance</h4>
              <p className="text-gray-700">
                Stay up-to-date with the latest legal standards and regulations
              </p>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
        Get in touch 8484917439
          <p>&copy; 2024 LegalAI Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
