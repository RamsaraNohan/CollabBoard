import React from 'react'
import AsyncState from '../components/common/AsyncState'

export default function NotFoundPage() { return <div className="standalone-state"><AsyncState state="not-found" title="Page not found" message="The CollabBoard page you requested does not exist." actionLabel="Go to Dashboard" actionTo="/dashboard" /></div> }
