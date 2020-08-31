require './plugins/provider.rb'

class Test < Provider
  attr_accessor :name
  attr_accessor :actions

  def initialize
    super()
    @name = "Test"
    @actions << {:readable_name => "Test Action", :function_name => "test_action"}
    @actions << {:readable_name => "Test Action1", :function_name => "test_action1"}
  end

  def test_action
    puts "test action called"
  end
end