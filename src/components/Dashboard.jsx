import { useState, useEffect } from 'react'
import { deviceService } from '../services/devices'
import { subscriptionService } from '../services/subscriptions'
import { Statistics } from './Statistics'
import { Invoices } from './Invoices'
import { Server, Plus, Trash2, Edit2, Eye, BarChart3, FileText } from 'lucide-react'

export function Dashboard({ user, onLogout }) {
  const [devices, setDevices] = useState([])
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddDevice, setShowAddDevice] = useState(false)
  const [currentTab, setCurrentTab] = useState('dashboard')
  const [newDevice, setNewDevice] = useState({
    name: '',
    ip_address: '',
    identity: '',
    model: '',
    location: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [devicesData, subData] = await Promise.all([
        deviceService.getDevices(user.id),
        subscriptionService.getSubscription(user.id),
      ])
      setDevices(devicesData || [])
      setSubscription(subData)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('حدث خطأ في تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  const handleAddDevice = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const device = await deviceService.addDevice(newDevice, user.id)
      setDevices([device, ...devices])
      setNewDevice({
        name: '',
        ip_address: '',
        identity: '',
        model: '',
        location: '',
      })
      setShowAddDevice(false)
      await deviceService.addDeviceLog(device.id, 'created', 'Device added')
    } catch (err) {
      console.error('Error adding device:', err)
      setError('خطأ في إضافة الجهاز: ' + err.message)
    }
  }

  const handleDeleteDevice = async (deviceId) => {
    if (window.confirm('هل تريد حذف هذا الجهاز؟')) {
      try {
        await deviceService.deleteDevice(deviceId)
        setDevices(devices.filter(d => d.id !== deviceId))
      } catch (err) {
        console.error('Error deleting device:', err)
        setError('خطأ في حذف الجهاز')
      }
    }
  }

  const canAddMoreDevices = !subscription || devices.length < subscription.max_devices

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f5f5f5' }}>
      <div style={{
        width: '250px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        overflow: 'auto',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '30px',
          paddingBottom: '15px',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
        }}>
          📊 مدير الميكروتك
        </div>

        <ul style={{ listStyle: 'none', marginBottom: '30px' }}>
          <li style={{ marginBottom: '10px' }}>
            <button
              onClick={() => setCurrentTab('dashboard')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 15px',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                background: currentTab === 'dashboard' ? 'rgba(255,255,255,0.2)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                gap: '10px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (currentTab !== 'dashboard') {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (currentTab !== 'dashboard') {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <BarChart3 size={18} /> لوحة التحكم
            </button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button
              onClick={() => setCurrentTab('devices')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 15px',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                background: currentTab === 'devices' ? 'rgba(255,255,255,0.2)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                gap: '10px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (currentTab !== 'devices') {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (currentTab !== 'devices') {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <Server size={18} /> الأجهزة
            </button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button
              onClick={() => setCurrentTab('invoices')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 15px',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                background: currentTab === 'invoices' ? 'rgba(255,255,255,0.2)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                gap: '10px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (currentTab !== 'invoices') {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (currentTab !== 'invoices') {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <FileText size={18} /> الفواتير
            </button>
          </li>
        </ul>

        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '12px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
          }}
        >
          🚪 تسجيل الخروج
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e0e0e0',
          padding: '15px 25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>
            {currentTab === 'dashboard' && 'لوحة التحكم'}
            {currentTab === 'devices' && 'أجهزة الميكروتك'}
            {currentTab === 'invoices' && 'الفواتير'}
          </h1>
          {currentTab === 'devices' && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>
                {devices.length} / {subscription?.max_devices || 1}
              </span>
              {canAddMoreDevices && (
                <button
                  onClick={() => setShowAddDevice(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#5568d3'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#667eea'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <Plus size={18} /> إضافة جهاز
                </button>
              )}
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '25px' }}>
          {error && (
            <div style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: '12px',
              borderRadius: '5px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              ⚠️ {error}
            </div>
          )}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{
                display: 'inline-block',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #667eea',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite',
                marginBottom: '15px',
              }}></div>
              <p>جاري التحميل...</p>
            </div>
          ) : currentTab === 'dashboard' ? (
            <Statistics user={user} />
          ) : currentTab === 'devices' ? (
            devices.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#999',
              }}>
                <Server size={48} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
                <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>
                  لا توجد أجهزة مضافة
                </p>
                <p>أضف جهاز ميكروتك أولاً للبدء</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}>
                {devices.map(device => (
                  <div
                    key={device.id}
                    style={{
                      background: 'white',
                      borderRadius: '8px',
                      padding: '20px',
                      border: '1px solid #e0e0e0',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#667eea'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0'
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '15px',
                  }}>
                    <div>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#333',
                      }}>
                        {device.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#999',
                        marginTop: '4px',
                      }}>
                        {device.ip_address}
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: device.status === 'online' ? '#d4edda' : '#f8d7da',
                      color: device.status === 'online' ? '#155724' : '#721c24',
                    }}>
                      {device.status === 'online' ? '🟢 متصل' : '🔴 غير متصل'}
                    </span>
                  </div>

                    <div style={{
                      fontSize: '13px',
                      color: '#666',
                      marginBottom: '8px',
                      lineHeight: '1.6',
                    }}>
                      <p>📍 الموقع: {device.location || 'غير محدد'}</p>
                      <p>💾 الموديل: {device.model || 'غير محدد'}</p>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '15px',
                      paddingTop: '15px',
                      borderTop: '1px solid #e0e0e0',
                    }}>
                      <button
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          fontSize: '12px',
                          background: '#f0f0f0',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#667eea'
                          e.currentTarget.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#f0f0f0'
                          e.currentTarget.style.color = 'inherit'
                        }}
                      >
                        <Eye size={14} style={{ marginRight: '4px' }} /> عرض
                      </button>
                      <button
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          fontSize: '12px',
                          background: '#f0f0f0',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#667eea'
                          e.currentTarget.style.color = 'white'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#f0f0f0'
                          e.currentTarget.style.color = 'inherit'
                        }}
                      >
                        <Edit2 size={14} style={{ marginRight: '4px' }} /> تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteDevice(device.id)}
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          fontSize: '12px',
                          background: '#f8d7da',
                          color: '#721c24',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f5c6cb'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#f8d7da'
                        }}
                      >
                        <Trash2 size={14} style={{ marginRight: '4px' }} /> حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : currentTab === 'invoices' ? (
            <Invoices user={user} />
          ) : null}
        </div>
      </div>

      {showAddDevice && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.3s ease',
          }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#333',
            }}>
              إضافة جهاز جديد
            </h2>

            <form onSubmit={handleAddDevice}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#333',
                }}>
                  اسم الجهاز
                </label>
                <input
                  type="text"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                  }}
                  placeholder="أدخل اسم الجهاز"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#333',
                }}>
                  عنوان IP
                </label>
                <input
                  type="text"
                  value={newDevice.ip_address}
                  onChange={(e) => setNewDevice({ ...newDevice, ip_address: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                  }}
                  placeholder="192.168.1.1"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#333',
                }}>
                  Identity
                </label>
                <input
                  type="text"
                  value={newDevice.identity}
                  onChange={(e) => setNewDevice({ ...newDevice, identity: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                  }}
                  placeholder="معرف الجهاز"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#333',
                }}>
                  الموديل
                </label>
                <input
                  type="text"
                  value={newDevice.model}
                  onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                  }}
                  placeholder="المودل مثل RB941-2nD"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#333',
                }}>
                  الموقع
                </label>
                <input
                  type="text"
                  value={newDevice.location}
                  onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '14px',
                  }}
                  placeholder="موقع الجهاز"
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '25px',
                justifyContent: 'flex-end',
              }}>
                <button
                  type="button"
                  onClick={() => setShowAddDevice(false)}
                  style={{
                    padding: '10px 20px',
                    background: '#e0e0e0',
                    color: '#333',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#5568d3'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#667eea'
                  }}
                >
                  إضافة الجهاز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
