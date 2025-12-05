"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Bell, LogOut, MoreVertical, RefreshCw, Search, Wifi, WifiOff, Zap } from "lucide-react"
import Link from "next/link"

// Mock data types
type Device = {
  id: string
  alias: string
  ip: string
  status: "connected" | "disconnected"
  userRole: string
}

type LogEntry = {
  id: string
  timestamp: string
  message: string
  type: "info" | "success" | "error" | "warning"
}

export default function AlertScannerDashboard() {
  const [devices, setDevices] = useState<Device[]>([
    { id: "1", alias: "Router Principal", ip: "192.168.1.1", status: "connected", userRole: "ADMIN" },
    { id: "2", alias: "Switch Core", ip: "192.168.1.10", status: "connected", userRole: "OPERATOR" },
    { id: "3", alias: "Firewall Gateway", ip: "192.168.1.254", status: "disconnected", userRole: "SUPER_ADMIN" },
    { id: "4", alias: "AP Oficina Norte", ip: "192.168.2.1", status: "connected", userRole: "OPERATOR" },
    { id: "5", alias: "AP Oficina Sur", ip: "192.168.2.2", status: "disconnected", userRole: "OPERATOR" },
    { id: "6", alias: "Server Backup", ip: "192.168.3.50", status: "connected", userRole: "ADMIN" },
  ])

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "1", timestamp: new Date().toLocaleTimeString(), message: "Sistema iniciado correctamente", type: "success" },
    {
      id: "2",
      timestamp: new Date().toLocaleTimeString(),
      message: "Sincronización de inventario completada",
      type: "info",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentUser] = useState({ name: "Admin", role: "SUPER_ADMIN" })

  // Calculate metrics
  const connectedDevices = devices.filter((d) => d.status === "connected").length
  const disconnectedDevices = devices.filter((d) => d.status === "disconnected").length
  const alertsSentToday = 12 // Mock value

  // Filter devices
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.alias.toLowerCase().includes(searchTerm.toLowerCase()) || device.ip.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || device.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
    }
    setLogs((prev) => [newLog, ...prev].slice(0, 50)) // Keep last 50 logs
  }

  const handleSyncInventory = async () => {
    addLog("Iniciando sincronización de inventario maestro...", "info")
    // Simulate API call
    setTimeout(() => {
      addLog("Sincronización completada exitosamente", "success")
    }, 1500)
  }

  const handlePing = (device: Device) => {
    addLog(`Enviando PING a ${device.alias} (${device.ip})...`, "info")
    setTimeout(() => {
      const success = Math.random() > 0.3
      if (success) {
        addLog(`✓ PONG recibido de ${device.alias}`, "success")
      } else {
        addLog(`✗ Timeout al hacer PING a ${device.alias}`, "error")
      }
    }, 800)
  }

  const handleAlarm = (device: Device) => {
    addLog(`Activando alarma en ${device.alias} (${device.ip})...`, "warning")
    setTimeout(() => {
      addLog(`⚠ Alarma enviada a ${device.alias}`, "success")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">AlertScanner Control</h1>
            <h3><Link href="/admin/users">Administrador de Usuarios</Link></h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Usuario</p>
              <p className="text-sm font-medium text-foreground">
                {currentUser.name} · {currentUser.role}
              </p>
            </div>
            <Button variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar - Metrics and Actions */}
        <aside className="w-80 border-r border-border bg-card p-6">
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">Dashboard de Métricas</h2>
              <div className="space-y-3">
                <Card className="bg-background/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Dispositivos Conectados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Wifi className="h-5 w-5 text-green-500" />
                      <span className="text-3xl font-bold text-foreground">{connectedDevices}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Dispositivos Desconectados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <WifiOff className="h-5 w-5 text-red-500" />
                      <span className="text-3xl font-bold text-foreground">{disconnectedDevices}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Alertas Enviadas Hoy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-blue-500" />
                      <span className="text-3xl font-bold text-foreground">{alertsSentToday}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <Button className="w-full" size="lg" onClick={handleSyncInventory}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sincronizar Inventario Maestro
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Device Table Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Inventario de Dispositivos</CardTitle>
                <CardDescription>Gestión y monitoreo de dispositivos en red</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters and Search */}
                <div className="mb-4 flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre o IP..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="connected">Conectados</SelectItem>
                      <SelectItem value="disconnected">Desconectados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Device Table */}
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Alias</TableHead>
                        <TableHead>Dirección IP</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Rol del Usuario</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDevices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No se encontraron dispositivos
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredDevices.map((device) => (
                          <TableRow key={device.id}>
                            <TableCell className="font-medium">{device.alias}</TableCell>
                            <TableCell className="font-mono text-sm">{device.ip}</TableCell>
                            <TableCell>
                              {device.status === "connected" ? (
                                <Badge variant="outline" className="border-green-500 text-green-500">
                                  <Wifi className="mr-1 h-3 w-3" />
                                  Conectado
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-red-500 text-red-500">
                                  <WifiOff className="mr-1 h-3 w-3" />
                                  Desconectado
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{device.userRole}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handlePing(device)}>
                                    <Activity className="mr-2 h-4 w-4" />
                                    Enviar PING
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleAlarm(device)}>
                                    <Zap className="mr-2 h-4 w-4" />
                                    Activar Alarma
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Logs/Console Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Consola de Eventos</CardTitle>
                <CardDescription>Logs y notificaciones en tiempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 overflow-y-auto rounded-lg bg-black/50 p-4 font-mono text-sm">
                  {logs.length === 0 ? (
                    <p className="text-muted-foreground">No hay eventos para mostrar</p>
                  ) : (
                    <div className="space-y-1">
                      {logs.map((log) => (
                        <div key={log.id} className="flex gap-3">
                          <span className="text-muted-foreground">[{log.timestamp}]</span>
                          <span
                            className={
                              log.type === "success"
                                ? "text-green-400"
                                : log.type === "error"
                                  ? "text-red-400"
                                  : log.type === "warning"
                                    ? "text-yellow-400"
                                    : "text-blue-400"
                            }
                          >
                            {log.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
