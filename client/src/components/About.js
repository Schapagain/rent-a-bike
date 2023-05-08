import React from 'react'

export default function About({ className }) {
    return (
        <div className={`${className} m-auto lg:text-xl p-5 text-center rounded-xl max-w-xl`}>
            <p>We are a small team of bike enthusiasts who are trying their best to make awesome bikes available to everyone. Most of the bikes featured here are premium ones, and we'd love for more people to experience how it is like to shred trails with them. For more info on what we do, please use the contact us page of the site for inquiries.</p>
        </div>
    )
}
