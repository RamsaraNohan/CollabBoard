import React from 'react'
import Badge from '../common/Badge'

export default function WorkloadSummary({ metrics }) {
  const tone = metrics.workload === 'High' ? 'danger' : metrics.workload === 'Medium' ? 'warning' : 'success'
  return <div className="workload-summary"><span>Open workload</span><strong>{metrics.open}</strong><Badge tone={tone}>{metrics.workload}</Badge></div>
}
