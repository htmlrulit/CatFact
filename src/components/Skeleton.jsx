import './skeleton.css'

import {AVATAR_DEFAULT_SIZE} from "@vkontakte/vkui/dist/components/Avatar/Avatar"

export default function Skeleton(props){
  return <div className={"skeleton "+props.className} style={props.style}>
    {props.children}
  </div>
}
export function SkeletonAvatar(props){
  return <div className="skeleton avatar" style={{width:AVATAR_DEFAULT_SIZE,height:AVATAR_DEFAULT_SIZE,...props.style}}>
    {props.children}
  </div>
}
export function SkeletonText(props){
  return <span className="skeleton text" style={props.style}/>
}