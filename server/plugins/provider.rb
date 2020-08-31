class Provider
  attr_accessor :actions
  attr_accessor :name

  def initialize
    @name = ""
    @actions = []
  end
end