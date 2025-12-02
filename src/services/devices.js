import { supabase } from './supabase'

export const deviceService = {
  async addDevice(device, userId) {
    const { data, error } = await supabase
      .from('devices')
      .insert({
        ...device,
        owner_id: userId,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getDevices(userId) {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getDevice(deviceId) {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', deviceId)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async updateDevice(deviceId, updates) {
    const { data, error } = await supabase
      .from('devices')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', deviceId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteDevice(deviceId) {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', deviceId)
    if (error) throw error
  },

  async getDeviceStatus(deviceId) {
    const { data, error } = await supabase
      .from('device_status')
      .select('*')
      .eq('device_id', deviceId)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async updateDeviceStatus(deviceId, statusData) {
    const { data, error } = await supabase
      .from('device_status')
      .upsert({
        device_id: deviceId,
        ...statusData,
        last_updated: new Date().toISOString(),
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async addDeviceLog(deviceId, action, details) {
    const { data, error } = await supabase
      .from('device_logs')
      .insert({
        device_id: deviceId,
        action,
        details,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getDeviceLogs(deviceId, limit = 100) {
    const { data, error } = await supabase
      .from('device_logs')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  },
}
