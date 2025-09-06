import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

export const TaskContext = createContext()

const STORAGE_KEY = 'tasks_v1'

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const addTask = useCallback((title) => {
    setTasks(prev => [
      { id: crypto.randomUUID(), title: title.trim(), done: false, createdAt: Date.now() },
      ...prev,
    ])
  }, [])

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }, [])

  const removeTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

    const editTask = useCallback((id, newTitle) => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, title: newTitle.trim() } : t))
    }, [])

  const stats = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter(t => t.done).length
    return { total, done, remaining: total - done }
  }, [tasks])

    const value = useMemo(() => ({
      tasks, addTask, toggleTask, removeTask, editTask, stats
    }), [tasks, addTask, toggleTask, removeTask, editTask, stats])

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  )
}
