'use client'
import { useCallback, useEffect, useState } from 'react'
import LiveCursors from './cursor/LiveCursors'
import { useMyPresence, useOthers } from '@liveblocks/react'
import { CursorMode, CursorState } from '@/types/type'
import CursorChat from './cursor/CursorChat'

const Live = () => {
    const others = useOthers()
    const [{cursor},updateMyPresence] = useMyPresence() as any ;

    const [cursorState, setCursorState] = useState<CursorState>({
      mode: CursorMode.Hidden
    })

    const handlePointerMove = useCallback((event:React.PointerEvent)=>{
      // event.preventDefault();
      // const x = event.clientX - event.currentTarget.getBoundingClientRect().x
      // const y = event.clientY - event.currentTarget.getBoundingClientRect().y
      //  updateMyPresence({cursor:{x,y}})
      const cursor = { x: Math.floor(event.clientX), y: Math.floor(event.clientY) };
      updateMyPresence({ cursor });
      
    },[])

    const handlePointerLeave = useCallback((event:React.PointerEvent)=>{
      setCursorState({mode: CursorMode.Hidden})
      updateMyPresence({cursor:null,mesage:null})
    },[])
    

    const handlePointerDown = useCallback((event:React.PointerEvent)=>{
      // event.preventDefault();
      // const x = event.clientX - event.currentTarget.getBoundingClientRect().x
      // const y = event.clientY - event.currentTarget.getBoundingClientRect().y
      // updateMyPresence({cursor:{x,y}})
      const cursor = { x: Math.floor(event.clientX), y: Math.floor(event.clientY) };
      updateMyPresence({ cursor });
    },[])

    useEffect(()=>{

      const onKeyup = (e:KeyboardEvent)=>{
        if(e.key === '/'){
          setCursorState({
            mode: CursorMode.Chat, 
            previousMessage:null, 
            message:'',
          })
        }
        else if(e.key === 'Escape'){
            updateMyPresence({message:''})
            setCursorState({mode: CursorMode.Hidden})
        }
      }

      window.addEventListener('keyup',onKeyup)

      const onKeyDown = (e:KeyboardEvent)=>{
        if(e.key === '/'){
          e.preventDefault()
        }
      }

      window.addEventListener('keydown',onKeyDown)

     return ()=>{
       window.removeEventListener('keyup',onKeyup)
       window.removeEventListener('keydown',onKeyDown)
      }

    },[updateMyPresence])

  return (
    <div 
      onPointerMove = {handlePointerMove}
      onPointerLeave = {handlePointerLeave}
      onPointerDown = {handlePointerDown}
      className='h-[100vh] w-full flex justify-center items-center text-center'
    >
      <h1 className=" text-white text-5xl font-xl">Livebocks Figma Clone</h1>

      {cursor && (
        <CursorChat
          cursor = {cursor}
          cursorState = {cursorState}
          setCursorState = {setCursorState}
          updateMyPresence = {updateMyPresence}
        />
      )}
      <LiveCursors others={others}/>
    </div>
  )
}

export default Live