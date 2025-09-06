import useTasks from '../hooks/useTasks'

export default function Counter() {
  const { stats } = useTasks()
  return (
    <div className="card flex items-center justify-between">
      <div>Total: <strong>{stats.total}</strong></div>
      <div>Terminées: <strong>{stats.done}</strong></div>
      <div>Restantes: <strong>{stats.remaining}</strong></div>
    </div>
  )
}
