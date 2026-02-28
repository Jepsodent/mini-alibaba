import { ChevronRight } from 'lucide-react'

interface Alert {
  id: string
  merchantId: string
  type: string
  detectionTime: string
  severity: string
  action: string
}

interface AlertsTableProps {
  alerts: Alert[]
}

export default function AlertsTable({ alerts }: AlertsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Merchant ID</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Type</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Detection Time</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Severity</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id} className="border-b border-border hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 text-foreground font-mono text-xs">{alert.merchantId}</td>
              <td className="px-4 py-3 text-foreground">{alert.type}</td>
              <td className="px-4 py-3 text-muted-foreground">{alert.detectionTime}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  alert.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {alert.severity}
                </span>
              </td>
              <td className="px-4 py-3">
                <button className="text-primary font-medium text-xs hover:underline flex items-center gap-1">
                  {alert.action}
                  <ChevronRight size={12} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
