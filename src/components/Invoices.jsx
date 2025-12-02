import { useState, useEffect } from 'react'
import { subscriptionService } from '../services/subscriptions'
import { FileText, Download, CheckCircle } from 'lucide-react'

export function Invoices({ user }) {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      const data = await subscriptionService.getInvoices(user.id)
      setInvoices(data || [])
    } catch (err) {
      console.error('Error loading invoices:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsPaid = async (invoiceId) => {
    try {
      await subscriptionService.markInvoiceAsPaid(invoiceId)
      await loadInvoices()
    } catch (err) {
      console.error('Error updating invoice:', err)
    }
  }

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'paid') return inv.status === 'paid'
    if (filter === 'pending') return inv.status !== 'paid'
    return true
  })

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-SA')
  }

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>جاري التحميل...</div>
  }

  return (
    <div style={{ background: 'white', borderRadius: '8px', padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>الفواتير</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 16px',
              background: filter === 'all' ? '#667eea' : '#e0e0e0',
              color: filter === 'all' ? 'white' : '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            الكل
          </button>
          <button
            onClick={() => setFilter('pending')}
            style={{
              padding: '8px 16px',
              background: filter === 'pending' ? '#667eea' : '#e0e0e0',
              color: filter === 'pending' ? 'white' : '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            معلقة
          </button>
          <button
            onClick={() => setFilter('paid')}
            style={{
              padding: '8px 16px',
              background: filter === 'paid' ? '#667eea' : '#e0e0e0',
              color: filter === 'paid' ? 'white' : '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            مدفوعة
          </button>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#999',
        }}>
          <FileText size={48} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
          <p>لا توجد فواتير</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
                  رقم الفاتورة
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
                  المبلغ
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
                  تاريخ الإصدار
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
                  الحالة
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '12px' }}>
                    {invoice.id.substring(0, 8).toUpperCase()}
                  </td>
                  <td style={{ padding: '12px', fontWeight: '600' }}>
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {formatDate(invoice.issue_date)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: invoice.status === 'paid'
                        ? '#d4edda'
                        : invoice.status === 'pending'
                        ? '#fff3cd'
                        : '#f8d7da',
                      color: invoice.status === 'paid'
                        ? '#155724'
                        : invoice.status === 'pending'
                        ? '#856404'
                        : '#721c24',
                    }}>
                      {invoice.status === 'paid' ? '✓ مدفوعة' : invoice.status === 'pending' ? '⏳ معلقة' : 'ملغاة'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={{
                          padding: '6px 12px',
                          background: '#f0f0f0',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
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
                        <Download size={14} /> تحميل
                      </button>
                      {invoice.status !== 'paid' && (
                        <button
                          onClick={() => handleMarkAsPaid(invoice.id)}
                          style={{
                            padding: '6px 12px',
                            background: '#d4edda',
                            color: '#155724',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#c3e6cb'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#d4edda'
                          }}
                        >
                          <CheckCircle size={14} /> وضع علامة مدفوعة
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
