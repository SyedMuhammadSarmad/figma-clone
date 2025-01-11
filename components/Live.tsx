import React, { useCallback } from 'react'
import LiveCursors from './cursor/LiveCursors'
import { useMyPresence, useOthers } from '@liveblocks/react'

const Live = () => {
    const others = useOthers()
    const [{cursor},updateMyPresence] = useMyPresence() ;

    const handlePointerMove = useCallback((event:React.PointerEvent)=>{
      // event.preventDefault();
      // const x = event.clientX - event.currentTarget.getBoundingClientRect().x
      // const y = event.clientY - event.currentTarget.getBoundingClientRect().y
      //  updateMyPresence({cursor:{x,y}})
      const cursor = { x: Math.floor(event.clientX), y: Math.floor(event.clientY) };
      updateMyPresence({ cursor });
      
    },[])

    const handlePointerLeave = useCallback((event:React.PointerEvent)=>{
      event.preventDefault();
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

  return (
    <div 
    onPointerMove = {handlePointerMove}
    onPointerLeave = {handlePointerLeave}
    onPointerDown = {handlePointerDown}
    className='h-[100vh] w-full flex justify-center items-center text-center'
    >
      <h1 className=" text-white text-5xl font-xl">Livebocks Figma Clone</h1>

      <LiveCursors others={others}/>
    </div>
  )
}

export default Live