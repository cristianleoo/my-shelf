import { formatDistanceToNow } from 'date-fns'

interface Log {
  id: string
  activity_type: string
  details: {
    status?: string
    rating?: number
  }
  timestamp: string
}

interface UserDiaryProps {
  logs: Log[]
}

export default function UserDiary({ logs }: UserDiaryProps) {
  return (
    <ul className="space-y-4">
      {logs.map((log) => (
        <li key={log.id} className="border-b pb-2">
          <p className="font-semibold">
            {log.activity_type === 'update_status'
              ? `Changed product status to "${log.details.status}"`
              : log.activity_type === 'rate'
              ? `Rated a product ${log.details.rating} stars`
              : 'Performed an action'}
          </p>
          <p className="text-sm text-gray-600">
            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
          </p>
        </li>
      ))}
    </ul>
  )
}
