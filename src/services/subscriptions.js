import { supabase } from './supabase'

export const subscriptionService = {
  async getSubscription(userId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle()
    if (error) throw error
    return data
  },

  async createSubscription(userId, planType, maxDevices, price) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_type: planType,
        max_devices: maxDevices,
        price,
        status: 'active',
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async upgradeSubscription(subscriptionId, newPlan, maxDevices, newPrice) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        plan_type: newPlan,
        max_devices: maxDevices,
        price: newPrice,
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async cancelSubscription(subscriptionId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        auto_renew: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getInvoices(userId) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('issue_date', { ascending: false })
    if (error) throw error
    return data
  },

  async createInvoice(userId, amount, subscriptionId = null) {
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        user_id: userId,
        subscription_id: subscriptionId,
        amount,
        status: 'pending',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async markInvoiceAsPaid(invoiceId) {
    const { data, error } = await supabase
      .from('invoices')
      .update({
        status: 'paid',
        paid_date: new Date().toISOString(),
      })
      .eq('id', invoiceId)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
