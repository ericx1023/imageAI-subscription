'use client'

import { Button } from '@/components/ui/button'
import React from 'react'

interface GeneratePictureButtonProps {
  userId: string
}

export default function GeneratePictureButton({ userId }: GeneratePictureButtonProps) {
  const generatePicture = async (userId: string): Promise<void> => {
    console.log('generatePicture')
    //call api to generate picture
    const response = await fetch('/api/generate-picture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    })
    const data = await response.json()
    console.log(data)
  }

  return (
    <Button onClick={() => generatePicture(userId)}>Create Picture</Button>
  )
} 