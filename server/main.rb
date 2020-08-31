require 'sinatra'
require 'json'

before do
  content_type :json
  headers 'Access-Control-Allow-Origin' => '*'
end

$plugins = {}

Dir[File.dirname(__FILE__) + '/plugins/*.rb'].each do |file| 
  next if File.basename(file, ".rb") == "provider"
  require file
  $plugins["#{File.basename(file, ".rb").capitalize}"] = Object.const_get("#{File.basename(file, ".rb").capitalize}").new
end

$plugins.each do |key, value|
  puts "Key is: #{key}, value is: #{value}"
  value.test_action
end

get '/get-action-providers' do
  providers = []

  $plugins.each do |key, value|
    providers << {:provider_name => value.name}
  end

  return providers.to_json
end

get '/:provider/actions' do
  $plugins.each do |key, value|
    return value.actions.to_json if value.name == params['provider']
  end
end