'use client'
import { useCallback, useEffect, useState } from 'react'
import LiveCursors from './cursor/LiveCursors'
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from '@liveblocks/react'
import { CursorMode, CursorState, Reaction, ReactionEvent } from '@/types/type'
import CursorChat from './cursor/CursorChat'
import ReactionSelector from './reaction/ReactionButton'
import FlyingReaction from './reaction/FlyingReaction'
import useInterval from '@/hooks/useInterval'

const Live = () => {
    const others = useOthers()
    const [{cursor},updateMyPresence] = useMyPresence() as any ;

    const [cursorState, setCursorState] = useState<CursorState>({
      mode: CursorMode.Hidden,
    })

    const [reaction, setReaction] = useState<Reaction[]>([])

    const broadcast = useBroadcastEvent();

    useInterval(()=>{
      setReaction((reaction)=> reaction.filter((r)=>r.timestamp > Date.now() - 4000))
    },1000)

    useInterval(()=>{
      if(cursorState.mode === CursorMode.Reaction  && cursorState.isPressed && cursor){
        setReaction((reactions)=>reactions.concat([{
          value: cursorState.reaction,
          point: {x: cursor.x, y: cursor.y},
          timestamp: Date.now()

        }]))

        broadcast({
          x: cursor.x,
          y: cursor.y,
          value: cursorState.reaction,
        })
      }
    },100)

    useEventListener((eventData)=>{
      const event = eventData.event as ReactionEvent

      setReaction((reactions)=>reactions.concat([{
        point: {x : event.x, y: event.y},
        value: event.value,
        timestamp: Date.now()

      }])
    )


    })

    const handlePointerMove = useCallback((event:React.PointerEvent)=>{
      // event.preventDefault();
      // const x = event.clientX - event.currentTarget.getBoundingClientRect().x
      // const y = event.clientY - event.currentTarget.getBoundingClientRect().y
      //  updateMyPresence({cursor:{x,y}})
      if(cursor == null ||cursorState.mode !== CursorMode.ReactionSelector){
        const cursor = { x: Math.floor(event.clientX), y: Math.floor(event.clientY) };
        updateMyPresence({ cursor });
      }  
    },[])

    const handlePointerLeave = useCallback((event:React.PointerEvent)=>{
      setCursorState({mode: CursorMode.Hidden})
      updateMyPresence({cursor:null,mesage:null})
    },[])

    const handlePointerUp = useCallback((event:React.PointerEvent)=>{
      setCursorState((state:CursorState)=>cursorState.mode === CursorMode.Reaction ?{...state,isPressed: true}: state)
    },[cursorState.mode, setCursorState])
    

    const handlePointerDown = useCallback((event:React.PointerEvent)=>{
      // event.preventDefault();
      // const x = event.clientX - event.currentTarget.getBoundingClientRect().x
      // const y = event.clientY - event.currentTarget.getBoundingClientRect().y
      // updateMyPresence({cursor:{x,y}})
      const cursor = { x: Math.floor(event.clientX), y: Math.floor(event.clientY) };
      updateMyPresence({ cursor });
      setCursorState((state:CursorState)=>cursorState.mode === CursorMode.Reaction ?{...state,isPressed:true}: state)
    },[cursorState.mode, setCursorState])

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
        else if(e.key === 'e'){
          setCursorState({mode: CursorMode.ReactionSelector})
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

    const setReactions =useCallback((reaction:string)=>{
      setCursorState({mode: CursorMode.Reaction, reaction, isPressed: false})
    },[])

  return (
    <div 
      onPointerMove = {handlePointerMove}
      onPointerLeave = {handlePointerLeave}
      onPointerDown = {handlePointerDown}
      onPointerUp = {handlePointerUp}
      className='h-[100vh] w-full flex justify-center items-center text-center'>

      <h1 className=" text-white text-5xl font-xl">Livebocks Figma Clone</h1>

      {reaction.map((r,index)=>(
        <FlyingReaction key={`${r.timestamp.toString()}-${index}`} x={r.point.x} y={r.point.y} timestamp={r.timestamp} value={r.value}/>
      ))}

      {cursor && (
        <CursorChat
          cursor = {cursor}
          cursorState = {cursorState}
          setCursorState = {setCursorState}
          updateMyPresence = {updateMyPresence}
        />
      )}

      {cursorState.mode === CursorMode.ReactionSelector &&(
        <ReactionSelector
        setReaction={setReactions}/>
      )}

      <LiveCursors others={others}/>
    </div>
  )
}

export default Live