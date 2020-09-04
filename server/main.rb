require 'sinatra'
require "sinatra/cors"
require 'json'
require "rubygems"
require 'bundler/setup'
require 'rest-client'

set :allow_origin, "*"

before do
  content_type :json
  headers 'Access-Control-Allow-Origin' => '*'
  headers 'Access-Control-Allow-Headers' => '*'
end

$plugins = {}

Dir[File.dirname(__FILE__) + '/plugins/*.rb'].each do |file| 
  next if File.basename(file, ".rb") == "provider"
  require file
  $plugins["#{File.basename(file, ".rb").capitalize}"] = Object.const_get("#{File.basename(file, ".rb").capitalize}").new
end

get '/get-action-providers' do
  providers = []

  $plugins.each do |key, value|
    providers << {'provider_name' => value.name}
  end

  return providers.to_json
end

get '/:provider/actions' do
  provider_actions = {}
  $plugins.each do |key, value|
    provider_actions['actions'] = value.actions if value.name == params['provider']
    if params['provider'] == 'Reaper' && value.name == 'Reaper'
      provider_actions['tracks'] = value.tracks
    end
  end
  return provider_actions.to_json
end