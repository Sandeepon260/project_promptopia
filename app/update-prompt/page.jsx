'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import Form from '@components/Form'
const InnerEditPrompt = ({ router, submitting, setSubmitting, post, setPost }) => {
    const searchParams = useSearchParams();
    const promptId = searchParams.get('id');
    useEffect(() =>{
        const getPromptDetails = async () => {
            const response = await fetch(`/api/prompt/${promptId}`)
            const data = await response.json();
            setPost({
                prompt: data.prompt,
                tag: data.tag,
            })
        }
        if(promptId) getPromptDetails()
      }, [promptId])
      const updatePrompt = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        if(!promptId) return alert('Prompt ID not found')
        try {
            const response = await fetch(`/api/prompt/${promptId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    prompt: post.prompt,
                    tag:post.tag
                })
            })
    
            if(response.ok) {
                router.push('/');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSubmitting(false)
        }
      }
        return (
        <Form 
            type="Edit"
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={updatePrompt}
        />
      )
}
const EditPrompt = () => {
  const router = useRouter();  
  const [submitting, setSubmitting] = useState(false)
  //const searchParams = useSearchParams();
  //const promptId = searchParams.get('id');
  const [post, setPost] = useState({
    prompt: '',
    tag: '',
  });
  return(
    <Suspense fallback={<div>Loading...</div>}>
      <InnerEditPrompt 
        router={router}
        submitting={submitting}
        setSubmitting={setSubmitting}
        post={post}
        setPost={setPost}
      />
    </Suspense>
  )
}
  


export default EditPrompt