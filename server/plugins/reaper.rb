require './plugins/provider.rb'
require 'rest-client'

class Reaper < Provider
  attr_accessor :name
  attr_accessor :actions
  attr_accessor :reaper_host
  attr_accessor :reaper_port
  attr_accessor :tracks

  def initialize()
    super()
    @name = "Reaper"
    @actions = []
    @reaper_host = 'localhost'
    @reaper_port = '8080'
    @tracks = []
    refresh_track_data
    @actions << {:readable_name => "Mute Track", :function_name => "mute_track"}
    @actions << {:readable_name => "Set Volume", :function_name => "set_volume"}
  end

  def refresh_track_data
    resp = RestClient.get "http://#{@reaper_host}:#{@reaper_port}/_/TRACK"
    @tracks = []
    resp.body.split("\n").each do |track|
      track_fields = track.split("\t").reject { |field| field == 'TRACK'}
      temp_track_hash = {}
      temp_track_hash['track_number'] = track_fields[0]
      temp_track_hash['track_name'] = track_fields[1]
      temp_track_hash['track_fields'] = track_fields[2]
      temp_track_hash['track_volume'] = track_fields[3]
      temp_track_hash['track_pan'] = track_fields[4]
      # Per REAPER API js - last_meter_peak and last_meter_pos are integers that are dB*10, so -100 would be -10dB.
      temp_track_hash['track_last_meter_peak'] = track_fields[5].to_i / 10
      temp_track_hash['track_last_meter_pos'] = track_fields[6].to_i / 10
      temp_track_hash['width_pan2'] = track_fields[7]
      temp_track_hash['panmode'] = track_fields[8]
      temp_track_hash['sendcnt'] = track_fields[9]
      temp_track_hash['recvcnt'] = track_fields[10]
      temp_track_hash['hwoutcnt'] = track_fields[11]
      temp_track_hash['track_color'] = track_fields[12]
      @tracks << temp_track_hash
    end
  end

  def set_volume(track_index = 0, db_val = 1.0)
    # Reaper returns volumes as an integer, and then converts the integer to DB using a special function.
    # values less than or equal to 0.00000002980232 are -inf db
    # 1.0 = +0 db
    # 3.981072 = +12 db
    db_val = 0 if db_val <= 0.00000002980232
    db_val = 3.981072 if db_val > 3.981072
    resp = RestClient.get "http://#{@reaper_host}:#{@reaper_port}/_/SET/TRACK/#{track_index}/VOL/#{db_val}"
  end

  def mute_track(track_index = 0, value = -1)
    track = @tracks.select { |track| track['track_number'].to_i = track_index }[0]
    is_muted = false
    is_muted = true if (track['track_fields'].to_i)&8 == 8
    if is_muted
      resp = RestClient.get "http://#{@reaper_host}:#{@reaper_port}/_/SET/TRACK/#{track_index}/MUTE/0"
    else
      resp = RestClient.get "http://#{@reaper_host}:#{@reaper_port}/_/SET/TRACK/#{track_index}/MUTE/1"
    end
    refresh_track_data
  end
end