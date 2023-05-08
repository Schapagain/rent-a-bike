import React from 'react'
import { BsGearWideConnected } from 'react-icons/bs'

export default function BikeHighlights({ bike, max}) {
    return (
        <ul>
            {(max ? bike.highlightedFeatures.slice(0,max) : bike.highlightedFeatures).map((feature, i) => <li key={bike.id + 'feature-' + i}><BsGearWideConnected className="mr-2 inline-block text-xs my-auto" />{feature}</li>)}
        </ul>
    )
}
