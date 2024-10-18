/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Label } from "@/components/ui/label"
import axios from 'axios'; // Ensure axios is imported
import { Textarea } from '@/components/ui/textarea'



export default function LegalAssistant() {
  const [language, setLanguage] = useState('english')
  const [template, setTemplate] = useState('contract')
  const [content, setContent] = useState('')
  const [prompt, setPrompt] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true); // Set loading to true when sending starts

    try {
        // Make an API call to /api/user/draft
        const response = await axios.post('/api/user/draft', {
             prompt: prompt ,
             template: template
        });
console.log(response.data.answer);

        // Assuming the response contains the updated content
            setContent(response.data.answer); // Update the content state with the response
    } catch (error) {
        console.error('Error sending content:', error); // Handle any errors
    }
  };

  // New state for card values

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
  }

  const handleTemplateChange = (value: string) => {
    setTemplate(value)
  }


  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Select onValueChange={handleLanguageChange} value={language}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="hindi">Hindi</SelectItem>
            <SelectItem value="marathi">Marathi</SelectItem>
          </SelectContent>
        </Select>
         
      </div>
      <Tabs defaultValue="document">
        <TabsList>
          <TabsTrigger value="document">Document</TabsTrigger>
          {/* <TabsTrigger value="client">Client Info</TabsTrigger>
          <TabsTrigger value="tools">Legal Tools</TabsTrigger> */}
        </TabsList>
        <TabsContent value="document" className="space-y-4">
          <div className="flex justify-between items-center">
            <Select onValueChange={handleTemplateChange} value={template}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
                <SelectItem value="motion">Motion</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Download </Button>
          </div>
           
        <div className="flex space-x-2 mb-4">
                <Input
                    type="text" 
                    value={prompt} 
                    onChange={(e) => setPrompt(e.target.value)} 
                    placeholder="Type msg..." 
                    className="flex-1"
                />

                <Button onClick={handleSend} className="bg-blue-500 text-white" disabled={loading}>
                {loading ? 'Loading...' : 'Send'} {/* Show loader text when loading */}
                  </Button>
            </div>

<div className='w-[50vw]  ml-[10%] mr-[10%] '>
<Textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            className="min-h-[500px] font-mono text-sm w-[80%] mx-auto" 
          /> 
{/* <Editor 

          data={content} 
          onChange={(e:any) => setContent(e.target.value)} 
          holder="editorjs-holder" 
        /> */}

</div>

          
        </TabsContent>
        {/* <TabsContent value="client" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input 
                    id="clientName"
                    placeholder="Client Name" 
                    value={cardValues.clientName} 
                    onChange={(e) => handleCardValueChange('clientName', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caseNumber">Case Number</Label>
                  <Input 
                    id="caseNumber"
                    placeholder="Case Number" 
                    value={cardValues.caseNumber} 
                    onChange={(e) => handleCardValueChange('caseNumber', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courtName">Court Name</Label>
                  <Input 
                    id="courtName"
                    placeholder="Court Name" 
                    value={cardValues.courtName} 
                    onChange={(e) => handleCardValueChange('courtName', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partyA">Party A</Label>
                  <Input 
                    id="partyA"
                    placeholder="Party A" 
                    value={cardValues.partyA} 
                    onChange={(e) => handleCardValueChange('partyA', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partyB">Party B</Label>
                  <Input 
                    id="partyB"
                    placeholder="Party B" 
                    value={cardValues.partyB} 
                    onChange={(e) => handleCardValueChange('partyB', e.target.value)} 
                  />
                </div>
              </div>
              <Button variant="outline">Save Client Info</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Common Clauses</CardTitle>
            </CardHeader>
            <CardContent className="flex space-x-2">
              <Button onClick={() => insertClause('confidentiality')} variant="outline">Confidentiality</Button>
              <Button onClick={() => insertClause('arbitration')} variant="outline">Arbitration</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Citation Helper</CardTitle>
            </CardHeader>
            <CardContent className="flex space-x-2">
              <Button onClick={() => insertCitation('case')} variant="outline">Case Law</Button>
              <Button onClick={() => insertCitation('statute')} variant="outline">Statute</Button>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>

    </div>
  )
}
