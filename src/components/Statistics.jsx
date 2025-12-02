import { useState, useEffect } from 'react'
import { deviceService } from '../services/devices'
import { subscriptionService } from '../services/subscriptions'
import { TrendingUp, Users, Activity, AlertCircle } from 'lucide-react'

export function Statistics({ user }) {
  const [stats, setStats] = useState({
    totalDevices: 0,
    onlineDevices: 0,
    offlineDevices: 0,
    subscription: null,
    invoices: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStatistics()
  }, [])

  const loadStatistics = async () => {
    try {
      const [devices, subscription, invoices] = await Promise.all([
        deviceService.getDevices(user.id),
        subscriptionService.getSubscription(user.id),
        subscriptionService.getInvoices(user.id),
      ])

      const online = devices.filter(d => d.status === 'online').length
      const offline = devices.filter(d => d.status === 'offline').length

      const unpaidInvoices = invoices.filter(i => i.status !== 'paid')
      const totalUnpaid = unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0)

      setStats({
        totalDevices: devices.length,
        onlineDevices: online,
        offlineDevices: offline,
        subscription,
        invoices,
        unpaidAmount: totalUnpaid,
      })
    } catch (err) {
      console.error('Error loading statistics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>جاري التحميل...</div>
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
    }}>
      {/* إجمالي الأجهزة */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderLeft: '4px solid #667eea',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
              إجمالي الأجهزة
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
              {stats.totalDevices}
            </div>
          </div>
          <Activity size={32} color="#667eea" style={{ opacity: 0.2 }} />
        </div>
      </div>

      {/* الأجهزة المتصلة */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderLeft: '4px solid #28a745',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
              أجهزة متصلة
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
              {stats.onlineDevices}
            </div>
          </div>
          <TrendingUp size={32} color="#28a745" style={{ opacity: 0.2 }} />
        </div>
      </div>

      {/* الأجهزة غير المتصلة */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderLeft: '4px solid #dc3545',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
              أجهزة غير متصلة
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
              {stats.offlineDevices}
            </div>
          </div>
          <AlertCircle size={32} color="#dc3545" style={{ opacity: 0.2 }} />
        </div>
      </div>

      {/* الاشتراك الحالي */}
      {stats.subscription && (
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #ffc107',
        }}>
          <div>
            <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
              خطة الاشتراك
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
              {stats.subscription.plan_type}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              الأجهزة المسموح: {stats.totalDevices} / {stats.subscription.max_devices}
            </div>
          </div>
        </div>
      )}

      {/* الفواتير المعلقة */}
      {stats.unpaidAmount > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #ff6b6b',
        }}>
          <div>
            <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>
              مبلغ معلق
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6b6b' }}>
              ${stats.unpaidAmount.toFixed(2)}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              فواتير لم تُدفع بعد
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
