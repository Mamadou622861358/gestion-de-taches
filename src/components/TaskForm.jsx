import { useState, useCallback } from 'react'
import useTasks from '../hooks/useTasks'

export default function TaskForm() {
  const { addTask } = useTasks()
  const [title, setTitle] = useState('')

  const onSubmit = useCallback((e) => {
    e.preventDefault()
    if (!title.trim()) return
    addTask(title)
    setTitle('')
  }, [title, addTask])

  return (
    <form onSubmit={onSubmit} className="card flex gap-2 items-center">
      <input
        aria-label="Nouvelle tâche"
        className="input flex-1"
        placeholder="Ajouter une tâche..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit" className="btn btn-primary">Ajouter</button>
    </form>
  )
}
